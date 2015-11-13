var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', 'ee', '../core/entity', '../core/component', '../components/visual', '../components/transform'], function(THREE, EventEmitter, Entity, Component, Visual, Transform) {
  var Loader;
  return Loader = (function(_super) {
    __extends(Loader, _super);

    function Loader() {
      Loader.__super__.constructor.apply(this, arguments);
    }

    Loader.prototype.loadModel = function(url, userData) {
      var callback, ext, len, loader, loaderClass, splitUrl;
      splitUrl = url.split('.');
      len = splitUrl.length;
      ext = len ? splitUrl[len - 1] : null;
      if (!ext || !ext.length) {
        return;
      }
      loaderClass = null;
      callback = null;
      switch (ext.toUpperCase()) {
        case 'JS':
          loaderClass = THREE.JSONLoader;
          callback = (function(geometry, materials) {
            return this.handleModelLoaded(url, userData, geometry, materials);
          }).bind(this);
          break;
        case 'GLTF':
        case 'JSON':
          loaderClass = THREE.glTFLoader;
          callback = (function(result) {
            return this.handleGLTFModelLoaded(url, userData, result);
          }).bind(this);
          break;
        case 'DAE':
          loaderClass = THREE.ColladaLoader;
          callback = (function(result) {
            return this.handleColladaModelLoaded(url, userData, result);
          }).bind(this);
      }
      if (loaderClass) {
        loader = new loaderClass();
        if (loader && loader.options) {
          loader.options.convertUpAxis = true;
        }
        return loader.load(url, callback);
      }
    };

    Loader.prototype.handleModelLoaded = function(url, userData, geometry, materials) {
      var entity, material, mesh, result, visual;
      material = new THREE.MeshFaceMaterial(materials);
      mesh = new THREE.Mesh(geometry, material);
      entity = new Entity();
      visual = new Visual({
        object: mesh
      });
      entity.addComponent(visual);
      result = {
        scene: entity,
        cameras: [],
        lights: [],
        keyFrameAnimators: [],
        userData: userData
      };
      return this.emit('loaded', result);
    };

    Loader.prototype.handleGLTFModelLoaded = function(url, userData, result) {
      var convertedScene;
      if (result.scene) {
        result.scene.children = result.scene.children[0].children;
        convertedScene = this.convertScene(result.scene);
      }
      return this.emit('loaded', {
        scene: convertedScene,
        cameras: [],
        lights: [],
        keyFrameAnimators: [],
        userData: userData
      });
    };

    Loader.prototype.convertScene = function(scene) {
      var convert;
      convert = function(n) {
        var child, convertedChild, group, v, _i, _len, _ref;
        if (n instanceof THREE.Mesh) {
          n.matrixAutoUpdate = true;
          n.geometry.dynamic = true;
          v = new Visual({
            object: n
          });
          v.name = n.name;
          return v;
        }
        if (n.children) {
          n.matrixAutoUpdate = true;
          group = new Entity({
            autoCreateTransform: false
          });
          group.addComponent(new Transform({
            object: n
          }));
          group.name = n.name;
          _ref = n.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            convertedChild = convert(child);
            if (convertedChild instanceof Entity) {
              group.addChild(convertedChild);
            } else if (convertedChild instanceof Component) {
              group.addComponent(convertedChild);
            } else {
              console.warn('Undefined child');
            }
          }
          return group;
        }
      };
      scene.updateMatrixWorld();
      return convert(scene);
    };

    Loader.prototype.handleColladaModelLoaded = function(url, userData, result) {
      var convertedScene;
      if (result.scene) {
        convertedScene = this.convertScene(result.scene);
      }
      return this.emit('loaded', {
        scene: convertedScene,
        cameras: [],
        lights: [],
        keyFrameAnimators: [],
        userData: userData
      });
    };

    return Loader;

  })(EventEmitter);
});
