var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', '../scene_component'], function(THREE, SceneComponent) {
  var Camera;
  return Camera = (function(_super) {
    __extends(Camera, _super);

    function Camera(param) {}

    Camera.DEFAULT_POSITION = new THREE.Vector3(0, 0, 10);

    Camera.DEFAULT_NEAR = 1;

    Camera.DEFAULT_FAR = 10000;

    return Camera;

  })(SceneComponent);
});
