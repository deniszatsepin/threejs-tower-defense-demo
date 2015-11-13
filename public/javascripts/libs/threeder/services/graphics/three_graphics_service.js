var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', './graphics_service', '../../core/game', '../../helpers/pick_manager', '../../components/cameras/camera', '../../input/mouse'], function(THREE, Graphics, Game, PickManager, Camera, Mouse) {
  var ThreeGraphicsService, document, window;
  window = this;
  document = window.document;
  return ThreeGraphicsService = (function(_super) {
    __extends(ThreeGraphicsService, _super);

    function ThreeGraphicsService(param) {
      ThreeGraphicsService.__super__.constructor.apply(this, arguments);
    }

    ThreeGraphicsService.prototype.initialize = function(param) {
      this.initPageElements(param);
      this.initScene(param);
      this.initRenderer(param);
      this.initMouse();
      this.initKeyboard();
      return this.initEnviron();
    };

    ThreeGraphicsService.prototype.initPageElements = function(param) {
      if (param.container) {
        return this.container = param.container;
      } else {
        this.container = document.createElement('div');
        return document.body.appendChild(this.container);
      }
    };

    ThreeGraphicsService.prototype.initScene = function(param) {
      var camera, scene;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth / this.container.offsetHeight, Camera.DEFAULT_NEAR, Camera.DEFAULT_FAR);
      camera.position.copy(Camera.DEFAULT_POSITION);
      scene.add(camera);
      this.scene = scene;
      return this.camera = camera;
    };

    ThreeGraphicsService.prototype.initRenderer = function(param) {
      var alpha, antialias, projector, renderer;
      antialias = param.antialias !== void 0 ? param.antialias : true;
      alpha = param.alpha !== void 0 ? param.alpha : true;
      renderer = new THREE.WebGLRenderer({
        antialias: antialias,
        alpha: alpha
      });
      renderer.sortObjects = false;
      renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      if (param && param.backgroundColor) {
        renderer.domElement.style.backgroundColor = param.backgroundColor;
        renderer.domElement.setAttribute('z-index', -1);
      }
      this.container.appendChild(renderer.domElement);
      projector = new THREE.Projector();
      this.renderer = renderer;
      this.projector = projector;
      this.lastFrameTime = 0;
      return void 0;
    };

    ThreeGraphicsService.prototype._initHandlers = function(element, handlers) {
      var event, handler;
      for (event in handlers) {
        handler = handlers[event];
        element.addEventListener(event, handler.bind(this), false);
      }
      return true;
    };

    ThreeGraphicsService.prototype.initMouse = function() {
      var canvas, handlers;
      canvas = this.renderer.domElement;
      handlers = {
        mousemove: this.onCanvasMouseMove,
        mousedown: this.onCanvasMouseDown,
        mouseup: this.onCanvasMouseUp,
        click: this.onCanvasMouseClick,
        dblclick: this.onCanvasMouseDoubleClick,
        mousewheel: this.onCanvasMouseScroll,
        DOMMouseScroll: this.onCanvasMouseScroll,
        touchstart: this.onCanvasTouchStart,
        touchmove: this.onCanvasTouchMove,
        touchend: this.onCanvasTouchEnd
      };
      this._initHandlers(canvas, handlers);
      return true;
    };

    ThreeGraphicsService.prototype.initKeyboard = function() {
      var canvas, handlers;
      canvas = this.renderer.domElement;
      handlers = {
        keydown: this.onKeyDown,
        keyup: this.onKeyUp,
        keypress: this.onKeyPress
      };
      this._initHandlers(canvas, handlers);
      return canvas.setAttribute('tabindex', 99999);
    };

    ThreeGraphicsService.prototype.initEnviron = function() {
      var handlers;
      handlers = {
        resize: this.onWindowResize
      };
      return this._initHandlers(window, handlers);
    };

    ThreeGraphicsService.prototype.getTopVisible = function(intersects) {
      var intersect, intersected, result, _i, _len;
      intersected = null;
      for (_i = 0, _len = intersects.length; _i < _len; _i++) {
        intersect = intersects[_i];
        if (intersect.object.visible && !intersect.object.ignorePick) {
          intersected = intersect;
          break;
        }
      }
      if (!intersected) {
        return result = {
          object: null,
          point: null,
          normal: null
        };
      } else {
        return this.findObjectFromIntersected(intersected.object, intersected.point, intersected.face);
      }
    };

    ThreeGraphicsService.prototype.objectFromMouse = function(event) {
      var eltx, elty, intersects, raycaster, vector, vpx, vpy;
      eltx = event.elementX;
      elty = event.elementY;
      vpx = (eltx / this.container.offsetWidth) * 2 - 1;
      vpy = -(elty / this.container.offsetHeight) * 2 + 1;
      vector = new THREE.Vector3(vpx, vpy, 1);
      this.projector.unprojectVector(vector, this.camera);
      raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
      intersects = raycaster.intersectObjects(this.scene.children, true);
      return this.getTopVisible(intersects);
    };

    ThreeGraphicsService.prototype.objectFromRay = function(hierarchy, origin, direction, near, far) {
      var intersects, objects, raycaster;
      raycaster = new THREE.Raycaster(origin, direction, near, far);
      objects = null;
      if (hierarchy) {
        objects = hierarchy.transform.object.children;
      } else {
        objects = this.scene.children;
      }
      intersects = raycaster.intersectObjects(objects, true);
      return this.getTopVisible(intersects);
    };

    ThreeGraphicsService.prototype.findObjectFromIntersected = function(object, point, face) {
      var hitPointWorld, modelMat, normal, result;
      if (object.data) {
        hitPointWorld = point.clone();
        modelMat = new THREE.Matrix4();
        modelMat.getInverse(object.matrixWorld);
        point.applyMatrix4(modelMat);
        normal = face ? face.normal : null;
        return result = {
          object: object.data,
          point: point,
          hitPointWorld: hitPointWorld,
          face: face,
          normal: normal
        };
      } else if (object.parent) {
        return this.findObjectFromIntersected(object.parent, point, face);
      } else {
        return result = {
          object: null,
          point: null,
          face: null,
          normal: null
        };
      }
    };

    ThreeGraphicsService.prototype.nodeFromMouse = function(event) {
      return console.warn('[Threeder] function dosn\'t implemented');
    };

    ThreeGraphicsService.prototype.getObjectIntersection = function(x, y, object) {
      var intersection, intersects, modelMat, pos, raycaster, vector, vpx, vpy;
      vpx = (eltx / this.container.offsetWidth) * 2 - 1;
      vpy = (elty / this.container.offsetHeight) * 2 + 1;
      vector = new THREE.Vector3(vpx, vpy, 0.5);
      this.projector.unprojectVector(vector, this.camera);
      pos = new THREE.Vector3();
      pos = pos.applyMatrix4(this.camera.matrixWorld);
      raycaster = new THREE.Raycaster(pos, vector.sub(pos).normalize());
      intersects = raycaster.intersectObject(object, true);
      if (intersects.length) {
        intersection = intersects[0];
        modelMat = new THREE.Matrix4();
        modelMat.getInverse(intersection.object.matrixWorld);
        intersection.point.applyMatrix4(modelMat);
        return intersection;
      } else {
        return null;
      }
    };

    ThreeGraphicsService.prototype.calcElementOffset = function(offset) {
      var parent, _results;
      offset.left = this.renderer.domElement.offsetLeft;
      offset.top = this.renderer.domElement.offsetTop;
      parent = this.renderer.domElement.offsetParent;
      _results = [];
      while (parent) {
        offset.left += parent.offsetLeft;
        offset.top += parent.offsetTop;
        _results.push(parent = parent.offsetParent);
      }
      return _results;
    };

    ThreeGraphicsService.prototype.onCanvasMouseMove = function(event) {
      var eltx, elty, evt, offset;
      event.preventDefault();
      offset = {};
      this.calcElementOffset(offset);
      eltx = event.pageX - offset.left;
      elty = event.pageY - offset.top;
      evt = {
        type: event.type,
        pageX: event.pageX,
        pageY: event.pageY,
        elementX: eltx,
        elementY: elty,
        button: event.button,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey
      };
      Mouse._instance.onMouseMove(evt);
      if (PickManager) {
        PickManager.handleMouseMove(evt);
      }
      return Threeder.Game.handleMouseMove(evt);
    };

    ThreeGraphicsService.prototype.onCanvasMouseDown = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onCanvasMouseUp = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onCanvasMouseClick = function(event) {
      var eltx, elty, evt, offset;
      event.preventDefault();
      offset = {};
      this.calcElementOffset(offset);
      eltx = event.pageX - offset.left;
      elty = event.pageY - offset.top;
      evt = {
        type: event.type,
        pageX: event.pageX,
        pageY: event.pageY,
        elementX: eltx,
        elementY: elty,
        button: event.button,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey
      };
      Mouse._instance.onMouseClick(evt);
      if (PickManager) {
        PickManager.handleMouseClick(evt);
      }
      return Threeder.Game.handleMouseClick(evt);
    };

    ThreeGraphicsService.prototype.onCanvasMouseDoubleClick = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onCanvasMouseScroll = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.translateTouch = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onCanvasTouchStart = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onCanvasTouchMove = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onCanvasTouchEnd = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onKeyDown = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onKeyUp = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onKeyPress = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.onWindowResize = function(event) {
      return console.warn('Method dosnt realize');
    };

    ThreeGraphicsService.prototype.setCursor = function(cursor) {
      if (!cursor) {
        cursor = this.savedCursor;
      }
      return this.container.style.cursor = cursor;
    };

    ThreeGraphicsService.prototype.update = function() {
      var deltat, frameTime;
      if (this.sparksContainer) {
        this.sparksContainer.update();
      }
      this.renderer.setClearColor(0xaaaaaa, 1);
      this.renderer.autoClearColor = true;
      this.renderer.render(this.scene, this.camera);
      frameTime = Date.now();
      deltat = (frameTime - this.lastFrameTime) / 1000;
      this.frameRate = 1 / deltat;
      return this.lastFrameTime = frameTime;
    };

    ThreeGraphicsService.prototype.enableShadows = function(enable) {
      this.renderer.shadowMapEnabled = enable;
      this.renderer.shadowMapSoft = enable;
      return this.renderer.shadowMapCullFace = false;
    };

    return ThreeGraphicsService;

  })(Graphics);
});
