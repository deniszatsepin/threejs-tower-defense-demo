var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./behavior'], function(Behavior) {
  var RotateBehavior;
  return RotateBehavior = (function(_super) {
    __extends(RotateBehavior, _super);

    RotateBehavior.ROTATIONS = {
      simple: 'simpleRotation',
      target: 'onTargetRotation'
    };

    function RotateBehavior(param) {
      var methodName, rotation;
      param = param || {};
      this.axis = param.axis || new THREE.Vector3(0, 1, 0);
      this.duration = param.duration || 1;
      this.velocity = param.velocity || Math.PI / 2 / this.duration;
      this.startAngle = 0;
      this.angle = 0;
      this.prevDelta = 0;
      rotation = param.method || 'simple';
      methodName = RotateBehavior.ROTATIONS[rotation] || RotateBehavior.ROTATIONS['simple'];
      this.evaluate = this[methodName];
      RotateBehavior.__super__.constructor.call(this, param);
    }

    RotateBehavior.prototype.start = function() {
      var angle, entity, object, rotation;
      this.angle = 0;
      entity = this.getEntity();
      object = entity.transform.object;
      rotation = entity.transform.rotation;
      angle = this.axis.dot(rotation);
      object.rotateOnAxis(this.axis, angle % (Math.PI * 2));
      this.startAngle = this.axis.dot(rotation);
      return RotateBehavior.__super__.start.apply(this, arguments);
    };

    RotateBehavior.prototype.evaluate = function() {};

    RotateBehavior.prototype.simpleRotation = function(t) {
      var object, time;
      time = t - this.prevDelta;
      this.prevDelta = t;
      this.angle = this.velocity * time;
      object = this.getEntity().transform.object;
      object.rotateOnAxis(this.axis, this.startAngle + this.angle);
      if (this.onlyOnce && this.angle >= this.twopi) {
        return this.stop();
      }
    };

    RotateBehavior.prototype.onTargetRotation = function(t) {
      var angle, currentEnemy, delta, entity, object, target;
      delta = t - this.prevDelta;
      this.prevDelta = t;
      entity = this.getEntity();
      currentEnemy = entity.currentEnemy;
      if (!currentEnemy) {
        return;
      }
      target = currentEnemy.transform.position;
      object = entity.transform.object;
      angle = this.getDirection(object, target);
      if (!this.isEquial(angle, 0, 0.01)) {
        return this.stepRotate(angle, delta);
      }
    };

    RotateBehavior.prototype.getDirection = function(object, target) {
      var angle, angleCos, axis, direction, pos, sign, targ;
      direction = new THREE.Vector3(1, 0, 0);
      axis = new THREE.Vector3(0, 1, 0);
      direction.applyEuler(object.rotation);
      direction.normalize();
      pos = object.position.clone();
      pos.applyMatrix4(object.matrixWorld);
      targ = target.clone();
      targ.sub(pos).normalize();
      angleCos = direction.clone().dot(targ);
      if (angleCos > 1) {
        angleCos = 1;
      }
      angle = Math.acos(angleCos);
      sign = axis.dot(direction.cross(targ)) < 0 ? -1 : 1;
      return angle * sign;
    };

    RotateBehavior.prototype.stepRotate = function(angle, delta) {
      var axis, object, rotate, sign, step;
      object = this.getEntity().transform.object;
      sign = angle > 0 ? 1 : -1;
      step = this.velocity * delta * sign;
      if (Math.abs(step) > Math.abs(angle)) {
        step = angle;
      }
      axis = this.axis.clone();
      rotate = object.quaternion.clone().inverse();
      axis.applyQuaternion(rotate);
      return object.rotateOnAxis(axis, step);
    };

    RotateBehavior.prototype.isEquial = function(a, b, e) {
      return Math.abs(a - b) <= e;
    };

    RotateBehavior.prototype.twopi = Math.PI * 2;

    return RotateBehavior;

  })(Behavior);
});
