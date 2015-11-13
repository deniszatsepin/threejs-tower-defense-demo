define ['./behavior'], (Behavior) ->

  class RotateBehavior extends Behavior
    @ROTATIONS:
      simple: 'simpleRotation'
      target: 'onTargetRotation'

    constructor: (param) ->
      param = param or {}

      @axis = param.axis or new THREE.Vector3(0, 1, 0)
      @duration = param.duration or 1
      @velocity = param.velocity or Math.PI / 2 / @duration
      @startAngle = 0
      @angle = 0
      @prevDelta = 0

      rotation = param.method or 'simple'
      methodName = RotateBehavior.ROTATIONS[rotation] or RotateBehavior.ROTATIONS['simple']
      @evaluate = @[methodName]
      super param

    start: ->
      @angle = 0
      entity = @getEntity()
      object = entity.transform.object
      rotation = entity.transform.rotation
      angle = @axis.dot rotation
      object.rotateOnAxis @axis, angle % (Math.PI * 2)
      @startAngle = @axis.dot rotation

      super

    evaluate: ->

    simpleRotation: (t) ->
      time = t - @prevDelta
      @prevDelta = t

      @angle = @velocity * time

      object = @getEntity().transform.object
      object.rotateOnAxis @axis, @startAngle + @angle

      if @onlyOnce and @angle >= @twopi
        @stop()

    onTargetRotation: (t) ->
      delta = t - @prevDelta
      @prevDelta = t
      entity = @getEntity()
      currentEnemy = entity.currentEnemy
      return if not currentEnemy
      target = currentEnemy.transform.position
      object = entity.transform.object
      angle = @getDirection object, target
      if not @isEquial(angle, 0, 0.01)
        @stepRotate angle, delta


    getDirection: (object, target) ->
      direction = new THREE.Vector3(1, 0, 0)
      axis = new THREE.Vector3(0, 1, 0)
      direction.applyEuler object.rotation
      direction.normalize()

      pos = object.position.clone()
      pos.applyMatrix4 object.matrixWorld
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
      step = @velocity * delta * sign
      if Math.abs(step) > Math.abs(angle)
        step = angle
      axis = @axis.clone()
      rotate = object.quaternion.clone().inverse()
      axis.applyQuaternion rotate
      object.rotateOnAxis axis, step

    isEquial: (a, b, e) ->
      Math.abs(a - b) <= e


    twopi: Math.PI * 2
