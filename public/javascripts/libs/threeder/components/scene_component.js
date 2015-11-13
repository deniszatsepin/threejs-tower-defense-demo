var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core/component', '../services/graphics/graphics_service'], function(Component, Graphics) {
  var SceneComponent;
  return SceneComponent = (function(_super) {
    __extends(SceneComponent, _super);

    function SceneComponent(param) {
      param = param || {};
      SceneComponent.__super__.constructor.call(this, param);
      Object.defineProperties(this, {
        position: {
          get: function() {
            return this.object.position;
          }
        },
        rotation: {
          get: function() {
            return this.object.rotation;
          }
        },
        scale: {
          get: function() {
            return this.object.scale;
          }
        },
        quaternion: {
          get: function() {
            return this.object.quaternion;
          }
        },
        up: {
          get: function() {
            return this.object.up;
          },
          set: function(v) {
            return this.object.up = v;
          }
        },
        useQuaternion: {
          get: function() {
            return this.object.useQuaternion;
          },
          set: function(v) {
            return this.object.useQuaternion = v;
          }
        },
        visible: {
          get: function() {
            return this.object.visible;
          },
          set: function(v) {
            return this.object.visible = v;
          }
        },
        lookAt: {
          value: function(v) {
            return this.object.lookAt(v);
          }
        },
        translateOnAxis: {
          value: function(a, d) {
            return this.object.translateOnAxis(a, d);
          }
        },
        translateX: {
          value: function(d) {
            return this.object.translateX(d);
          }
        },
        translateY: {
          value: function(d) {
            return this.object.translateY(d);
          }
        },
        translateZ: {
          value: function(d) {
            return this.object.translateZ(d);
          }
        }
      });
      this.layer = param.layer;
    }

    SceneComponent.prototype.realize = function() {
      if (this.object && !this.object.data) {
        this.addToScene();
      }
      return SceneComponent.__super__.realize.apply(this, arguments);
    };

    SceneComponent.prototype.update = function() {
      return SceneComponent.__super__.update.apply(this, arguments);
    };

    SceneComponent.prototype.addToScene = function() {
      var parent, scene;
      scene = this.layer ? this.layer.scene : Graphics._instance.scene;
      if (this.isAttached()) {
        if (this._entity.transform.object !== this.object) {
          parent = this._entity.transform ? this._entity.transform.object : scene;
          if (parent) {
            if (parent !== this.object.parent) {
              parent.add(this.object);
            }
            return this.object.data = this;
          } else {
            return console.warn('Something has gone wrong add 1');
          }
        }
      } else {
        return console.warn('Something has gone wrong add 2');
      }
    };

    SceneComponent.prototype.removeFromScene = function() {
      var parent, scene;
      scene = this.layer ? this.layer.scene : Graphics._instance.scene;
      if (this.isAttached()) {
        parent = this._entity.transform ? this._entity.transform.object : scene;
        if (parent) {
          this.object.data = null;
          parent.remove(this.object);
        } else {
          console.warn('Something has gone wrong remove 1');
        }
      } else {
        console.warn('Something has gone wrong remove 2');
      }
      return this._realized = false;
    };

    return SceneComponent;

  })(Component);
});
