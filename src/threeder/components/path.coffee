define ['three', '../core/component', '../services/pathfinding'], (THREE, Component, PathFinding) ->

  class Path extends Component
    constructor: (param) ->
      param = param or {}
      @target = if param.target then @setTarget(param.target.x, param.target.y) else null
      @current = 0

    _componentCategory: 'path'

    realize: ->
      entity = @_entity
      position = entity.transform.position
      pfs = PathFinding._instance
      if pfs.isWalkableAt(position.x, position.z)
        @blockedPoint = pfs.worldToGrid position.x, position.z
        pfs.setWalkableAt @blockedPoint.x, @blockedPoint.y, false
        super

    isEquial: (a, b, e) ->
      Math.abs(a - b) <= e

    update: ->
      if not @_realized
        @realize()
        return

      return if not @target
      if not @path and @target
        @findPath()
        return

      currentTarget = @getCurrentTarget()
      return if not currentTarget
      ct = new THREE.Vector2(currentTarget.x, currentTarget.y)

      position = @_entity.transform.position
      p = new THREE.Vector2(position.x, position.z)
      length = ct.sub(p).length()
      if length < 0.001
        @current += 1
        if @path.length <= @current
          @path = null
          @target = null
        else
          @emit 'nextTarget', @getCurrentTarget()

    setTarget: (x, y) ->
      pathFinding = PathFinding._instance
      point = pathFinding.worldToGrid x, y
      @target = point
      @findPath()

    getCurrentTarget: ->
      pathFinding = PathFinding._instance
      point = @path[@current]
      wPoint = pathFinding.gridToWorld point[0], point[1]

    findPath: ->
      entity = @_entity
      position = entity.transform.position
      pathFinding = PathFinding._instance
      curPos = pathFinding.worldToGrid position.x, position.z
      @path = pathFinding.find curPos.x, curPos.y, @target.x, @target.y
      @current = 1
      @emit 'nextTarget', @getCurrentTarget()