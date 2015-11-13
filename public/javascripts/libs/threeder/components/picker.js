var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', '../core/component', '../helpers/pick_manager'], function(THREE, Component, PickManager) {
  var Picker;
  return Picker = (function(_super) {
    __extends(Picker, _super);

    function Picker(param) {
      param = param || {};
      this.overCursor = param.overCursor;
      this.enabled = param.enabled !== void 0 ? param.enabled : true;
    }

    Picker.prototype._componentCategory = 'pickers';

    Picker.prototype.realize = function() {
      Picker.__super__.realize.apply(this, arguments);
      this.lastHitPoint = new THREE.Vector3();
      this.lastHitNormal = new THREE.Vector3();
      return this.lastHitFace = new THREE.Face3();
    };

    Picker.prototype.update = function() {};

    Picker.prototype.toModelSpace = function(vec) {
      var modelMat;
      modelMat = new THREE.Matrix4();
      modelMat.getInverse(this._entity.transform.object.matrixWorld);
      return vec.applyMatrix4(modelMat);
    };

    Picker.prototype.onMouseOver = function(event) {
      return this.emit('mouseover', event);
    };

    Picker.prototype.onMouseOut = function(event) {
      return this.emit('mouseout', event);
    };

    Picker.prototype.onMouseMove = function(event) {
      var mouseOverEntity;
      mouseOverEntity = PickManager.entityFromMouse(event);
      if (this._entity === PickManager.clickedEntity || this._entity === mouseOverEntity) {
        if (event.point) {
          this.lastHitPoint.copy(event.point);
        }
        if (event.normal) {
          this.lastHitNormal.copy(event.normal);
        }
        if (event.face) {
          this.lastHitFace = event.face;
        }
        if (event.point) {
          this.emit('mousemove', event);
        }
      }
      return true;
    };

    Picker.prototype.onMouseDown = function(event) {
      this.lastHitPoint.copy(event.point);
      if (event.normal) {
        this.lastHitNormal.copy(event.normal);
      }
      if (event.face) {
        this.lastHitFace = event.face;
      }
      return this.emit('mousedown', event);
    };

    Picker.prototype.onMouseUp = function(event) {
      var mouseOverEntity;
      mouseOverEntity = PickManager.entityFromMouse(event);
      if (mouseOverEntity !== this._entity) {
        event.point = this.lastHitPoint;
        event.normal = this.lastHitNormal;
        event.face = this.lastHitFace;
      }
      return this.emit('mouseout', event);
    };

    Picker.prototype.onMouseClick = function(event) {
      this.lastHitPoint.copy(event.point);
      if (event.normal) {
        this.lastHitNormal.copy(event.normal);
      }
      if (event.face) {
        this.lastHitFace = event.face;
      }
      return this.emit('click', event);
    };

    Picker.prototype.onMouseDoubleClick = function(event) {
      this.lastHitPoint.copy(event.point);
      if (event.normal) {
        this.lastHitNormal.copy(event.normal);
      }
      if (event.face) {
        this.lastHitFace = event.face;
      }
      return this.emit('dblclick', event);
    };

    Picker.prototype.onMouseScroll = function(event) {
      return this.emit('mousescroll', event);
    };

    Picker.prototype.onTouchMove = function(event) {
      return this.emit('touchmove', event);
    };

    Picker.prototype.onTouchStart = function(event) {
      return this.emit('touchstart', event);
    };

    Picker.prototype.onTouchEnd = function(event) {
      return this.emit('touchend', event);
    };

    Picker.prototype.onMouseDown = function(event) {};

    return Picker;

  })(Component);
});
