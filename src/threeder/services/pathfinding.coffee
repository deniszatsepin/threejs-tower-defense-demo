define ['pathfinding/lib/pathfinding-browser'], (PF) ->

  class PathFindingService
    constructor: (param) ->
      if PathFindingService._instance
        throw new Error('Tween singleton already exists')
      @finder = new PF.AStarFinder
        allowDiagonal: true
        dontCrossCorners: true


    initialize: ->
      PathFindingService._instance = @

    terminate: ->

    update: ->

    setGrid: (x, y) ->
      @x = x
      @y = y
      @grid = new PF.Grid x, y

    setMatrix: (matrix, quite) ->
      @matrix = matrix
      if not quite
        @y = @matrix.length
        @x = @matrix[0].length
        @grid = new PF.Grid @x, @y, @matrix

    getGrid: ->
      @grid.clone()

    worldToGrid: (wx, wy) ->
      xSign = if wx >= 0 then 1 else -1
      ySign = if wy >= 0 then 1 else -1

      x: Math.round(Math.abs(wx) + .5) * xSign + @x * 0.5 - if xSign > 0 then 1 else 0
      y: Math.round(Math.abs(wy) + .5) * ySign + @y * 0.5 - if ySign > 0 then 1 else 0

    gridToWorld: (x, y) ->
      x: (-@x * 0.5) + x + 0.01 + 0.5
      y: (-@y * 0.5) + y + 0.01 + 0.5


    setBlocked: (wx, wy) ->
      point = @worldToGrid wx, wy
      @setWalkableAt point.x, point.y, false

    setFree: (wx, wy) ->
      point = @worldToGrid wx, wy
      @setWalkableAt point.x, point.y, true

    setWalkableAt: (x, y, w) ->
      @grid.setWalkableAt x, y, w

    isWalkableAt: (wx, wy) ->
      point = @worldToGrid wx, wy
      @grid.isWalkableAt point.x, point.y

    find: (x1, y1, x2, y2) ->
      @last = @finder.findPath x1, y1, x2, y2, @grid.clone()


    @_instance: null