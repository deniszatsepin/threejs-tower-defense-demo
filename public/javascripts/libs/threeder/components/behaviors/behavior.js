var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../../core/component', '../../services/time'], function(Component, Time) {
  var Behavior;
  return Behavior = (function(_super) {
    __extends(Behavior, _super);

    function Behavior(param) {
      param = param || {};
      this.startTime = 0;
      this.running = false;
      this.loop = param.loop != null ? param.loop : false;
      this.autoStart = param.autoStart != null ? param.autoStart : false;
      Behavior.__super__.constructor.call(this, param);
    }

    Behavior.prototype._componentCategory = 'behaviors';

    Behavior.prototype.realize = function() {
      Behavior.__super__.realize.apply(this, arguments);
      if (this.autoStart) {
        return this.start();
      }
    };

    Behavior.prototype.start = function() {
      this.startTime = Time._instance.currentTime;
      return this.running = true;
    };

    Behavior.prototype.stop = function() {
      this.startTime = 0;
      return this.running = false;
    };

    Behavior.prototype.toggle = function() {
      if (this.running) {
        return this.stop();
      } else {
        return this.start();
      }
    };

    Behavior.prototype.update = function() {
      var elapsedTime, now;
      if (this.running) {
        now = Time._instance.currentTime;
        elapsedTime = (now - this.startTime) / 1000;
        return this.evaluate(elapsedTime);
      }
    };

    Behavior.prototype.evaluate = function(t) {
      if (Behavior.WARN_ON_ABSTRACT) {
        return console.warn('Abstract Begaviour.evaluate called');
      }
    };

    Behavior.WARN_ON_ABSTRACT = true;

    return Behavior;

  })(Component);
});
