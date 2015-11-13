define ['three', './behavior', '../../services/pathfinding', '../path'], (THREE, Behavior, PathFindingService, Path) ->

  class MoveBehavior extends Behavior
    constructor: (param) ->
      param = param or {}

      @acceleration = param.acceleration or new THREE.Vector3(0, -150, 0)
      @velocity = param.velocity or 100
      @halfAccel = new THREE.Vector3()
      @scaledVelocity = new THREE.Vector3()
      @angularVelocity = 3.0
      @prevTime = 0
      @axis = new THREE.Vector3(0, 1, 0)
      @epsilon = 0.0000005
      super param

    start: ->

      super

    getDirection: (object, target) ->
      direction = new THREE.Vector3(1, 0, 0)
      axis = new THREE.Vector3(0, 1, 0)
      direction.applyEuler object.rotation
      direction.normalize()

      pos = object.position.clone()
      targ = target.clone()
      targ.sub(pos).normalize()
      angleCos = direction.clone().dot(targ)
      angleCos = 1 if angleCos > 1
      angle = Math.acos angleCos
      sign = if axis.dot(direction.cross(targ)) < 0 then -1 else 1
      angle * sign



    stepRotate: (angle, delta) ->
      object = @getEntity().transform.object
      sign = if angle > 0 then 1 else -1
      step = @angularVelocity * delta * sign
      if Math.abs(step) > Math.abs(angle)
        step = angle

      object.rotateOnAxis @axis, step

    isEquial: (a, b, e) ->
      Math.abs(a - b) <= e

    getNextPoint: (position, target) ->
      point =
        x: 0
        z: 0

      xSign = position.x - target.x
      xSign = xSign / Math.abs(xSign)
      point.x = position.x + @scaledVelocity.x
      xSign2 = point.x - target.x
      xSign2 = xSign2 / Math.abs(xSign2)
      if xSign isnt xSign2
        point.x = target.x

      zSign = position.z - target.z
      zSign = zSign / Math.abs(zSign)
      point.z = position.z + @scaledVelocity.z
      zSign2 = point.z - target.z
      zSign2 = zSign2 / Math.abs(zSign2)
      if zSign isnt zSign2
        point.z = target.z

      point

    isWalkable: (point) ->
      pfs = PathFindingService._instance
      path = @getEntity().getFirstComponentByType(Path)
      return true if not path #if not Path component in Entity, we suggest that the point is walkable

      gridPoint = pfs.worldToGrid(point.x, point.z)
      if path.blockedPoint.x == gridPoint.x and path.blockedPoint.y == gridPoint.y
        return true

      if pfs.isWalkableAt(point.x, point.z)
        pfs.setWalkableAt gridPoint.x, gridPoint.y, false
        pfs.setWalkableAt path.blockedPoint.x, path.blockedPoint.y, true
        path.blockedPoint = gridPoint
        return true
      else
        return false


    stepForward: (position, target, delta) ->
      object = @getEntity().transform.object
      direction = new THREE.Vector3(1, 0, 0)
      direction.applyEuler object.rotation

      @halfAccel = direction.multiplyScalar(@velocity * delta * 0.5)

      @scaledVelocity.copy(@halfAccel).multiplyScalar delta
      #position = @getEntity().transform.position
      point = @getNextPoint position, target
      if @isWalkable point
        position.x = point.x
        position.z = point.z
        true
      else
        @delay = Math.floor(Math.random() * 2)
        false


    evaluate: (t) ->
      if @delay > 0
        @delay -= 1
        @prevTime = t
        return

      delta = t - @prevTime
      @prevTime = t

      object = @getEntity().transform.object
      position = object.position
      target = @getEntity().currentTarget
      if not target
        return
      target.y = position.y
      length = position.clone().sub(target).length()
      if not @isEquial(length, 0, 0.001)
        angle = @getDirection object, target
        if not @isEquial(angle, 0, 0.01)
          @stepRotate angle, delta
        if not position.equals target
          result = @stepForward position, target, delta
          if not result
            path = @getEntity().getFirstComponentByType(Path)
            path.findPath()




      if @onlyOnce
        @stop()

    @SPEED: 3.5