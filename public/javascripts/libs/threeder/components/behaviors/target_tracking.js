var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./behavior', '../../core/game', '../../services/time'], function(Behavior, Game, Time) {
  var TargetTracking;
  return TargetTracking = (function(_super) {
    __extends(TargetTracking, _super);

    function TargetTracking(param) {
      param = param || {};
      TargetTracking.__super__.constructor.call(this, param);
      this.maxRadius = param.maxRadius || 3;
      this.maxRadius *= this.maxRadius;
      this.game = Game._instance;
      this.closest = null;
      this.prevDistance = 0;
    }

    TargetTracking.prototype.start = function() {
      return TargetTracking.__super__.start.apply(this, arguments);
    };

    TargetTracking.prototype.findClosetEnemy = function() {
      var closest, curDistance, diff, enemies, enemy, entity, length, maxDistance, position, threeObject, _i, _len;
      enemies = this.game.findEntitiesByTag('Enemy');
      length = enemies.length;
      if (!length) {
        return null;
      }
      entity = this.getEntity();
      threeObject = entity.transform.object;
      position = threeObject.position.clone();
      if (!entity.isOrphan()) {
        position.applyMatrix4(threeObject.matrixWorld);
      }
      maxDistance = Infinity;
      closest = null;
      for (_i = 0, _len = enemies.length; _i < _len; _i++) {
        enemy = enemies[_i];
        diff = enemy.transform.position.clone().sub(position);
        curDistance = diff.lengthSq();
        if (curDistance <= this.maxRadius && curDistance < maxDistance) {
          maxDistance = curDistance;
          closest = enemy;
        }
      }
      return closest;
    };

    TargetTracking.prototype.evaluate = function(t) {
      var delta, diff, distance, enemyPosition, entity, object, position;
      delta = t - this.prevTime;
      this.prevTime = t;
      if (!this.closest) {
        this.closest = this.findClosetEnemy();
        if (this.closest) {
          this.emit('closestEnemy', this.closest);
        }
        return;
      }
      entity = this.getEntity();
      object = entity.transform.object;
      position = object.position.clone().applyMatrix4(object.matrixWorld);
      enemyPosition = this.closest.transform.position;
      diff = enemyPosition.clone().sub(position);
      distance = diff.lengthSq();
      if (entity.enemyDistance !== distance) {
        entity.enemyDistance = this.prevDistance - distance;
        this.prevDistance = distance;
        this.emit('changeEnemyDistance');
      }
      if (distance > this.maxRadius) {
        this.closest = null;
        this.emit('closestEnemy', null);
      }
    };

    return TargetTracking;

  })(Behavior);
});
