var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', '../services/graphics/graphics_service', './scene_component'], function(THREE, Graphics, SceneComponent) {
  var Transform;
  return Transform = (function(_super) {
    __extends(Transform, _super);

    function Transform(param) {
      param = param || {};
      Transform.__super__.constructor.call(this, param);
      if (param.object) {
        this.object = param.object;
      } else {
        this.object = new THREE.Object3D();
      }
    }

    Transform.prototype._componentProperty = 'transform';

    Transform.prototype._componentPropertyType = 'Transform';

    Transform.prototype.addToScene = function() {
      var parent, scene;
      scene = this.layer ? this.layer.scene : Graphics._instance.scene;
      if (this._entity) {
        parent = this._entity._parent && this._entity._parent.transform ? this._entity._parent.transform.object : scene;
        if (parent) {
          parent.add(this.object);
          return this.object.data = this;
        } else {
          return console.warn('Transform add 1');
        }
      } else {
        return console.warn('Transform add 2');
      }
    };

    Transform.prototype.removeFromScene = function() {
      var parent, scene;
      scene = this.layer ? this.layer.scene : Graphics._instance.scene;
      if (this._entity) {
        parent = this._entity._parent && this._entity._parent.transform ? this._entity._parent.transform.object : scene;
        if (parent) {
          this.object.data = null;
          return parent.remove(this.object);
        } else {
          return console.warn('Transform remove 1');
        }
      } else {
        return console.warn('Transform remove 2');
      }
    };

    return Transform;

  })(SceneComponent);
});
