var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./behavior', '../../core/game', 'three'], function(Behavior, Game, THREE) {
  var MissileBehavior;
  return MissileBehavior = (function(_super) {
    __extends(MissileBehavior, _super);

    function MissileBehavior(param) {
      param = param || {};
      MissileBehavior.__super__.constructor.call(this, param);
      this.startPosition = param.startPosition || null;
      this.targetPosition = param.targetPosition || new THREE.Vector3();
      this.acceleration = param.acceleration || 0.3;
      this.velocity = param.velocity || new THREE.Vector3(1, 0, 0);
      this.maxVelocity = param.maxVelocity || 0.3;
      this.velocityScalar = 0;
      this.prevDelta = 0;
      this.game = Game._instance;
    }

    MissileBehavior.prototype.realize = function() {
      var threeObject;
      MissileBehavior.__super__.realize.apply(this, arguments);
      if (!this.startPosition) {
        threeObject = this.getEntity().transform.object;
        this.startPosition = threeObject.position.clone();
        return this.startRotation = threeObject.quaternion.clone();
      }
    };

    MissileBehavior.prototype.start = function() {
      this.enemy = this.getEntity().target;
      if (!this.enemy || this.running) {
        return;
      }
      this.prevDelta = 0;
      this.velocityScalar = 0;
      return MissileBehavior.__super__.start.apply(this, arguments);
    };

    MissileBehavior.prototype.setTargetV = function(target) {
      return this.targetPosition.copy(target);
    };

    MissileBehavior.prototype.setTarget = function(x, y, z) {
      return this.targetPosition.set(x, y, z);
    };

    MissileBehavior.prototype.setTargetEntity = function(enemy) {
      return this.enemy = enemy;
    };

    MissileBehavior.prototype.evaluate = function(t) {
      var ang, delta, entity, frac, lengthSq, localTarget, pos, position, qua, rez, target, threeObject, velocity;
      delta = t - this.prevDelta;
      this.prevDelta = t;
      if (!this.enemy) {
        this.stop();
        return;
      }
      entity = this.getEntity();
      threeObject = entity.transform.object;
      pos = threeObject.position.clone();
      if (!entity.isOrphan()) {
        pos.applyMatrix4(threeObject.matrixWorld);
      }
      target = this.enemy.transform.position;
      localTarget = target.clone();
      threeObject.worldToLocal(localTarget);
      lengthSq = localTarget.lengthSq();
      position = threeObject.position;
      if (lengthSq < 0.05 || position.y < 0) {
        this.stop();
        this.emit('target');
        return;
      }
      localTarget.normalize();
      qua = new THREE.Quaternion();
      qua.setFromUnitVectors(this.velocity, localTarget);
      ang = Math.acos(this.velocity.clone().dot(localTarget));
      velocity = this.velocity.clone().applyQuaternion(threeObject.quaternion);
      this.velocityScalar += this.acceleration * delta;
      if (this.velocityScalar > this.maxVelocity) {
        this.velocityScalar = this.maxVelocity;
      }
      position.add(velocity.multiplyScalar(this.velocityScalar));
      if (t > 0.5) {
        rez = threeObject.quaternion.clone().multiply(qua);
        if (ang > 0) {
          frac = ang * this.velocityScalar * 2;
          if (frac > 1) {
            frac = 1;
          }
          return threeObject.quaternion.slerp(rez, frac);
        }
      }
    };

    MissileBehavior.prototype.worldToLocal = function(v) {
      var transform;
      transform = function(entity, v) {
        entity.transform.object.worldToLocal(v);
        if (!entity.isOrphan()) {
          transform(entity._parent, v);
        }
        return null;
      };
      transform(this.getEntity(), v);
      return null;
    };

    MissileBehavior.prototype.localToWorld = function() {
      var objs, transform;
      objs = [];
      transform = function(entity) {
        objs.push(entity.transform.object);
        if (!entity.isOrphan()) {
          transform(entity._parent);
        }
        return null;
      };
      transform(this.getEntity());
      return null;
    };

    return MissileBehavior;

  })(Behavior);
});
