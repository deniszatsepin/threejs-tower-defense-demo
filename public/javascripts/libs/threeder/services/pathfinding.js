define(['pathfinding/lib/pathfinding-browser'], function(PF) {
  var PathFindingService;
  return PathFindingService = (function() {
    function PathFindingService(param) {
      if (PathFindingService._instance) {
        throw new Error('Tween singleton already exists');
      }
      this.finder = new PF.AStarFinder({
        allowDiagonal: true,
        dontCrossCorners: true
      });
    }

    PathFindingService.prototype.initialize = function() {
      return PathFindingService._instance = this;
    };

    PathFindingService.prototype.terminate = function() {};

    PathFindingService.prototype.update = function() {};

    PathFindingService.prototype.setGrid = function(x, y) {
      this.x = x;
      this.y = y;
      return this.grid = new PF.Grid(x, y);
    };

    PathFindingService.prototype.setMatrix = function(matrix, quite) {
      this.matrix = matrix;
      if (!quite) {
        this.y = this.matrix.length;
        this.x = this.matrix[0].length;
        return this.grid = new PF.Grid(this.x, this.y, this.matrix);
      }
    };

    PathFindingService.prototype.getGrid = function() {
      return this.grid.clone();
    };

    PathFindingService.prototype.worldToGrid = function(wx, wy) {
      var xSign, ySign;
      xSign = wx >= 0 ? 1 : -1;
      ySign = wy >= 0 ? 1 : -1;
      return {
        x: Math.round(Math.abs(wx) + .5) * xSign + this.x * 0.5 - (xSign > 0 ? 1 : 0),
        y: Math.round(Math.abs(wy) + .5) * ySign + this.y * 0.5 - (ySign > 0 ? 1 : 0)
      };
    };

    PathFindingService.prototype.gridToWorld = function(x, y) {
      return {
        x: (-this.x * 0.5) + x + 0.01 + 0.5,
        y: (-this.y * 0.5) + y + 0.01 + 0.5
      };
    };

    PathFindingService.prototype.setBlocked = function(wx, wy) {
      var point;
      point = this.worldToGrid(wx, wy);
      return this.setWalkableAt(point.x, point.y, false);
    };

    PathFindingService.prototype.setFree = function(wx, wy) {
      var point;
      point = this.worldToGrid(wx, wy);
      return this.setWalkableAt(point.x, point.y, true);
    };

    PathFindingService.prototype.setWalkableAt = function(x, y, w) {
      return this.grid.setWalkableAt(x, y, w);
    };

    PathFindingService.prototype.isWalkableAt = function(wx, wy) {
      var point;
      point = this.worldToGrid(wx, wy);
      return this.grid.isWalkableAt(point.x, point.y);
    };

    PathFindingService.prototype.find = function(x1, y1, x2, y2) {
      return this.last = this.finder.findPath(x1, y1, x2, y2, this.grid.clone());
    };

    PathFindingService._instance = null;

    return PathFindingService;

  })();
});
