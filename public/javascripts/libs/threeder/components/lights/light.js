var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../scene_component'], function(SceneComponent) {
  var Light;
  return Light = (function(_super) {
    __extends(Light, _super);

    function Light(param) {
      param = param in {};
      Light.__super__.constructor.call(this, param);
      Object.defineProperties(this, {
        color: {
          get: function() {
            return this.object.color;
          }
        },
        intensity: {
          get: function() {
            return this.object.intensity;
          },
          set: function(v) {
            return this.object.intensity = v;
          }
        }
      });
    }

    Light.prototype._componentProperty = 'light';

    Light.prototype._componentPropertyType = 'Light';

    Light.prototype.realize = function() {
      return Light.__super__.realize.apply(this, arguments);
    };

    Light.DEFAULT_COLOR = 0xffffff;

    Light.DEFAULT_INTENSITY = 1;

    Light.DEFAULT_RANGE = 10000;

    return Light;

  })(SceneComponent);
});
