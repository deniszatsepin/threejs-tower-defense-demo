var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', './behavior', '../../services/pathfinding', '../path'], function(THREE, Behavior, PathFindingService, Path) {
  var MoveBehavior;
  return MoveBehavior = (function(_super) {
    __extends(MoveBehavior, _super);

    function MoveBehavior(param) {
      param = param || {};
      this.acceleration = param.acceleration || new THREE.Vector3(0, -150, 0);
      this.velocity = param.velocity || 100;
      this.halfAccel = new THREE.Vector3();
      this.scaledVelocity = new THREE.Vector3();
      this.angularVelocity = 3.0;
      this.prevTime = 0;
      this.axis = new THREE.Vector3(0, 1, 0);
      this.epsilon = 0.0000005;
      MoveBehavior.__super__.constructor.call(this, param);
    }

    MoveBehavior.prototype.start = function() {
      return MoveBehavior.__super__.start.apply(this, arguments);
    };

    MoveBehavior.prototype.getDirection = function(object, target) {
      var angle, angleCos, axis, direction, pos, sign, targ;
      direction = new THREE.Vector3(1, 0, 0);
      axis = new THREE.Vector3(0, 1, 0);
      direction.applyEuler(object.rotation);
      direction.normalize();
      pos = object.position.clone();
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

    MoveBehavior.prototype.stepRotate = function(angle, delta) {
      var object, sign, step;
      object = this.getEntity().transform.object;
      sign = angle > 0 ? 1 : -1;
      step = this.angularVelocity * delta * sign;
      if (Math.abs(step) > Math.abs(angle)) {
        step = angle;
      }
      return object.rotateOnAxis(this.axis, step);
    };

    MoveBehavior.prototype.isEquial = function(a, b, e) {
      return Math.abs(a - b) <= e;
    };

    MoveBehavior.prototype.getNextPoint = function(position, target) {
      var point, xSign, xSign2, zSign, zSign2;
      point = {
        x: 0,
        z: 0
      };
      xSign = position.x - target.x;
      xSign = xSign / Math.abs(xSign);
      point.x = position.x + this.scaledVelocity.x;
      xSign2 = point.x - target.x;
      xSign2 = xSign2 / Math.abs(xSign2);
      if (xSign !== xSign2) {
        point.x = target.x;
      }
      zSign = position.z - target.z;
      zSign = zSign / Math.abs(zSign);
      point.z = position.z + this.scaledVelocity.z;
      zSign2 = point.z - target.z;
      zSign2 = zSign2 / Math.abs(zSign2);
      if (zSign !== zSign2) {
        point.z = target.z;
      }
      return point;
    };

    MoveBehavior.prototype.isWalkable = function(point) {
      var gridPoint, path, pfs;
      pfs = PathFindingService._instance;
      path = this.getEntity().getFirstComponentByType(Path);
      if (!path) {
        return true;
      }
      gridPoint = pfs.worldToGrid(point.x, point.z);
      if (path.blockedPoint.x === gridPoint.x && path.blockedPoint.y === gridPoint.y) {
        return true;
      }
      if (pfs.isWalkableAt(point.x, point.z)) {
        pfs.setWalkableAt(gridPoint.x, gridPoint.y, false);
        pfs.setWalkableAt(path.blockedPoint.x, path.blockedPoint.y, true);
        path.blockedPoint = gridPoint;
        return true;
      } else {
        return false;
      }
    };

    MoveBehavior.prototype.stepForward = function(position, target, delta) {
      var direction, object, point;
      object = this.getEntity().transform.object;
      direction = new THREE.Vector3(1, 0, 0);
      direction.applyEuler(object.rotation);
      this.halfAccel = direction.multiplyScalar(this.velocity * delta * 0.5);
      this.scaledVelocity.copy(this.halfAccel).multiplyScalar(delta);
      point = this.getNextPoint(position, target);
      if (this.isWalkable(point)) {
        position.x = point.x;
        position.z = point.z;
        return true;
      } else {
        this.delay = Math.floor(Math.random() * 2);
        return false;
      }
    };

    MoveBehavior.prototype.evaluate = function(t) {
      var angle, delta, length, object, path, position, result, target;
      if (this.delay > 0) {
        this.delay -= 1;
        this.prevTime = t;
        return;
      }
      delta = t - this.prevTime;
      this.prevTime = t;
      object = this.getEntity().transform.object;
      position = object.position;
      target = this.getEntity().currentTarget;
      if (!target) {
        return;
      }
      target.y = position.y;
      length = position.clone().sub(target).length();
      if (!this.isEquial(length, 0, 0.001)) {
        angle = this.getDirection(object, target);
        if (!this.isEquial(angle, 0, 0.01)) {
          this.stepRotate(angle, delta);
        }
        if (!position.equals(target)) {
          result = this.stepForward(position, target, delta);
          if (!result) {
            path = this.getEntity().getFirstComponentByType(Path);
            path.findPath();
          }
        }
      }
      if (this.onlyOnce) {
        return this.stop();
      }
    };

    MoveBehavior.SPEED = 3.5;

    return MoveBehavior;

  })(Behavior);
});
