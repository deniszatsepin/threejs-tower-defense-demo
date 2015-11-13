define ['./behavior', '../../core/game', '../../services/time'], (Behavior, Game, Time) ->

  class TargetTracking extends Behavior
    constructor: (param) ->
      param = param or {}
      super param
      @maxRadius = param.maxRadius or 3
      @maxRadius *= @maxRadius
      @game = Game._instance
      @closest = null
      @prevDistance = 0

    start: ->
      super

    findClosetEnemy: ->
      enemies = @game.findEntitiesByTag('Enemy')
      length = enemies.length
      return null if not length

      entity = @getEntity()
      threeObject = entity.transform.object
      position = threeObject.position.clone()
      if !entity.isOrphan()
        position.applyMatrix4 threeObject.matrixWorld
      maxDistance = Infinity
      closest = null
      for enemy in enemies
        diff = enemy.transform.position.clone().sub position
        curDistance = diff.lengthSq()
        if curDistance <= @maxRadius and curDistance < maxDistance
          maxDistance = curDistance
          closest = enemy
      closest

    evaluate: (t) ->
      delta = t - @prevTime
      @prevTime = t

      if not @closest
        @closest = @findClosetEnemy()
        if @closest
          @emit 'closestEnemy', @closest
        return

      entity = @getEntity()
      object = entity.transform.object
      position = object.position.clone().applyMatrix4 object.matrixWorld
      enemyPosition = @closest.transform.position
      diff = enemyPosition.clone().sub position
      distance = diff.lengthSq()
      if entity.enemyDistance isnt distance
        entity.enemyDistance = @prevDistance - distance
        @prevDistance = distance
        @emit 'changeEnemyDistance'

      if distance > @maxRadius
        @closest = null
        @emit 'closestEnemy', null
        return











