define ['./behavior', '../../core/game', 'three'], (Behavior, Game, THREE) ->

  #
  #
  #
  #
  class MissileBehavior extends Behavior
    constructor: (param) ->
      param = param or {}
      super param
      @startPosition = param.startPosition or null
      @targetPosition = param.targetPosition or new THREE.Vector3()
      @acceleration = param.acceleration or 0.3
      @velocity = param.velocity or new THREE.Vector3(1, 0, 0)
      @maxVelocity = param.maxVelocity or 0.3
      @velocityScalar = 0

      @prevDelta = 0
      @game = Game._instance

    realize: ->
      super
      if not @startPosition
        threeObject = @getEntity().transform.object
        @startPosition = threeObject.position.clone()
        @startRotation = threeObject.quaternion.clone()

    start: ->
      @enemy = @getEntity().target
      return if not @enemy or @running

      @prevDelta = 0
      @velocityScalar = 0

      super

    setTargetV: (target) ->
      @targetPosition.copy(target)

    setTarget: (x, y, z) ->
      @targetPosition.set x, y, z

    setTargetEntity: (enemy) ->
      @enemy = enemy

    evaluate: (t) ->
      delta = t - @prevDelta
      @prevDelta = t

      if not @enemy
        @stop()
        return

      entity = @getEntity()
      threeObject = entity.transform.object

      pos = threeObject.position.clone()
      if not entity.isOrphan()
        pos.applyMatrix4 threeObject.matrixWorld
      target = @enemy.transform.position
      localTarget = target.clone()
      threeObject.worldToLocal localTarget
      lengthSq = localTarget.lengthSq()
      position = threeObject.position
      if lengthSq < 0.05 or position.y < 0
        @stop()
        @emit 'target'
        return
      localTarget.normalize()
      qua = new THREE.Quaternion()
      qua.setFromUnitVectors @velocity, localTarget
      ang = Math.acos(@velocity.clone().dot localTarget)
      velocity = @velocity.clone().applyQuaternion threeObject.quaternion
      @velocityScalar += @acceleration * delta
      @velocityScalar = @maxVelocity if @velocityScalar > @maxVelocity
      position.add(velocity.multiplyScalar(@velocityScalar))

      if t > 0.5
        rez = threeObject.quaternion.clone().multiply qua
        if ang > 0
          frac = ang * @velocityScalar * 2
          frac = 1 if frac > 1
          threeObject.quaternion.slerp rez, frac

    worldToLocal: (v) ->
      transform = (entity, v) ->
        entity.transform.object.worldToLocal v
        if not entity.isOrphan()
          transform entity._parent, v
        null

      transform @getEntity(), v
      null

    localToWorld: ->
      objs = []
      transform = (entity) ->
        objs.push entity.transform.object
        if not entity.isOrphan()
          transform entity._parent
        null

      transform @getEntity()



      null
