define ['three', 'threeder/threeder'], (THREE, Threeder) ->

  class Rocket extends Threeder.Entity
    constructor: (param) ->
      param = param or {}
      param.name = param.name or 'Rocket' + Rocket.number++
      super param
      @initPosition = param.initPosition or new THREE.Vector3()
      @initRotation = param.initRotation or new THREE.Quaternion()

      visual = new Threeder.Visual
        geometry: new THREE.BoxGeometry .3, .05, .05
        material: new THREE.MeshPhongMaterial color: 0xaaff11

      @addComponent visual
      @addTag('Rocket');

      rotator = new Threeder.RotateBehavior autoStart: true
      #@addComponent rotator

      @missileBehavior = new Threeder.MissileBehavior()
      @addComponent @missileBehavior
      @missileBehavior.on 'target', ((e) ->
        @transform.visible = false
        if @notarget
          @missileBehavior.setTargetEntity null
          @notarget = false
        else
          @emit 'target', @
      ).bind @

    setTarget: (entity) ->
      @target = entity
      if @target
        @notarget = false
        @missileBehavior.setTargetEntity entity
      else
        @notarget = true

    setPosition: (matrix) ->
      @transform.position.copy @initPosition
      @transform.object.quaternion.copy @initRotation
      @transform.object.updateMatrix()
      @transform.object.applyMatrix matrix

    fire: ->
      @transform.visible = true
      @missileBehavior.start()

    @number: 0