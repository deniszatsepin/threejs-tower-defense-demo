var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', './light', '../../services/graphics/graphics_service'], function(THREE, Light, Graphics) {
  var DirectionalLight;
  return DirectionalLight = (function(_super) {
    __extends(DirectionalLight, _super);

    function DirectionalLight(param) {
      param = param || {};
      this.scaleDir = new THREE.Vector3();
      this.castShadows = param.castShadows != null ? param.castShadows : DirectionalLight.DEFAULT_CAST_SHADOWS;
      DirectionalLight.__super__.constructor.call(this, param);
      if (param.object) {
        this.object = param.object;
        this.direction = param.object.position.clone().normalize().negate();
        this.targetPos = param.object.target.position.clone();
        this.shadowDarkness = param.object.shadowDarkness;
      } else {
        this.direction = param.direction || new THREE.Vector3(0, 0, -1);
        this.object = new THREE.DirectionalLight(param.color, param.intensity, 0);
        this.targetPos = new THREE.Vector3();
        this.shadowDarkness = param.shadowDarkness != null ? param.shadowDarkness : DirectionalLight.DEFAULT_SHADOW_DARKNESS;
      }
    }

    DirectionalLight.prototype.realize = function() {
      return DirectionalLight.__super__.realize.apply(this, arguments);
    };

    DirectionalLight.prototype.update = function() {
      var worldmat;
      this.position.copy(this.direction).normalize().negate();
      worldmat = this.object.parent.matrixWorld;
      this.position.applyMatrix4(worldmat);
      this.scaleDir.copy(this.direction);
      this.scaleDir.multiplyScalar(Light.DEFAULT_RANGE);
      this.targetPos.copy(this.position);
      this.targetPos.add(this.scaleDir);
      this.object.target.position.copy(this.targetPos);
      this.updateShadows();
      return DirectionalLight.__super__.update.apply(this, arguments);
    };

    DirectionalLight.prototype.updateShadows = function() {
      if (this.castShadows) {
        this.object.castShadow = true;
        this.object.shadowCameraNear = 1;
        this.object.shadowCameraFar = Light.DEFAULT_RANGE;
        this.object.shadowCameraFov = 90;
        this.object.shadowBias = 0.0001;
        this.object.shadowDarkness = this.shadowDarkness;
        this.object.shadowMapWidth = 1024;
        this.object.shadowMapHeight = 1024;
        return Graphics._instance.enableShadows(true);
      }
    };

    DirectionalLight.DEFAULT_CAST_SHADOWS = false;

    DirectionalLight.DEFAULT_SHADOW_DARKNESS = 0.3;

    return DirectionalLight;

  })(Light);
});
