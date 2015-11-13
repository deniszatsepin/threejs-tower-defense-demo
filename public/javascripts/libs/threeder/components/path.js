var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', '../core/component', '../services/pathfinding'], function(THREE, Component, PathFinding) {
  var Path;
  return Path = (function(_super) {
    __extends(Path, _super);

    function Path(param) {
      param = param || {};
      this.target = param.target ? this.setTarget(param.target.x, param.target.y) : null;
      this.current = 0;
    }

    Path.prototype._componentCategory = 'path';

    Path.prototype.realize = function() {
      var entity, pfs, position;
      entity = this._entity;
      position = entity.transform.position;
      pfs = PathFinding._instance;
      if (pfs.isWalkableAt(position.x, position.z)) {
        this.blockedPoint = pfs.worldToGrid(position.x, position.z);
        pfs.setWalkableAt(this.blockedPoint.x, this.blockedPoint.y, false);
        return Path.__super__.realize.apply(this, arguments);
      }
    };

    Path.prototype.isEquial = function(a, b, e) {
      return Math.abs(a - b) <= e;
    };

    Path.prototype.update = function() {
      var ct, currentTarget, length, p, position;
      if (!this._realized) {
        this.realize();
        return;
      }
      if (!this.target) {
        return;
      }
      if (!this.path && this.target) {
        this.findPath();
        return;
      }
      currentTarget = this.getCurrentTarget();
      if (!currentTarget) {
        return;
      }
      ct = new THREE.Vector2(currentTarget.x, currentTarget.y);
      position = this._entity.transform.position;
      p = new THREE.Vector2(position.x, position.z);
      length = ct.sub(p).length();
      if (length < 0.001) {
        this.current += 1;
        if (this.path.length <= this.current) {
          this.path = null;
          return this.target = null;
        } else {
          return this.emit('nextTarget', this.getCurrentTarget());
        }
      }
    };

    Path.prototype.setTarget = function(x, y) {
      var pathFinding, point;
      pathFinding = PathFinding._instance;
      point = pathFinding.worldToGrid(x, y);
      this.target = point;
      return this.findPath();
    };

    Path.prototype.getCurrentTarget = function() {
      var pathFinding, point, wPoint;
      pathFinding = PathFinding._instance;
      point = this.path[this.current];
      return wPoint = pathFinding.gridToWorld(point[0], point[1]);
    };

    Path.prototype.findPath = function() {
      var curPos, entity, pathFinding, position;
      entity = this._entity;
      position = entity.transform.position;
      pathFinding = PathFinding._instance;
      curPos = pathFinding.worldToGrid(position.x, position.z);
      this.path = pathFinding.find(curPos.x, curPos.y, this.target.x, this.target.y);
      this.current = 1;
      return this.emit('nextTarget', this.getCurrentTarget());
    };

    return Path;

  })(Component);
});
