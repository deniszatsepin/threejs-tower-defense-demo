var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', './scene_component'], function(THREE, SceneComponent) {
  var Visual;
  return Visual = (function(_super) {
    __extends(Visual, _super);

    function Visual(param) {
      param = param || {};
      Visual.__super__.constructor.call(this, param);
      if (param.object) {
        this.object = param.object;
        this.geometry = this.object.geometry;
        this.material = this.object.material;
      } else {
        this.geometry = param.geometry;
        this.material = param.material;
      }
    }

    Visual.prototype._componentCategory = 'visuals';

    Visual.prototype.realize = function() {
      Visual.__super__.realize.apply(this, arguments);
      if (!this.object && this.geometry && this.material) {
        this.object = new THREE.Mesh(this.geometry, this.material);
        this.object.ignorePick = false;
        return this.addToScene();
      }
    };

    return Visual;

  })(SceneComponent);
});
