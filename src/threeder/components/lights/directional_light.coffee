define ['three', './light', '../../services/graphics/graphics_service'], (THREE, Light, Graphics) ->

  class DirectionalLight extends Light
    constructor: (param) ->
      param = param or {}

      @scaleDir = new THREE.Vector3()
      @castShadows = if param.castShadows? then param.castShadows else DirectionalLight.DEFAULT_CAST_SHADOWS

      super param

      if param.object
        @object = param.object
        @direction = param.object.position.clone().normalize().negate()
        @targetPos = param.object.target.position.clone()
        @shadowDarkness = param.object.shadowDarkness
      else
        @direction = param.direction || new THREE.Vector3(0, 0, -1)
        @object = new THREE.DirectionalLight param.color, param.intensity, 0
        @targetPos = new THREE.Vector3()
        @shadowDarkness = if param.shadowDarkness? then param.shadowDarkness else DirectionalLight.DEFAULT_SHADOW_DARKNESS

    realize: ->
      super

    update: ->
      @position.copy(@direction).normalize().negate()
      worldmat = @object.parent.matrixWorld
      @position.applyMatrix4 worldmat
      @scaleDir.copy @direction
      @scaleDir.multiplyScalar Light.DEFAULT_RANGE
      @targetPos.copy @position
      @targetPos.add @scaleDir
      @object.target.position.copy @targetPos

      @updateShadows()

      super

    updateShadows: ->
      if @castShadows
        @object.castShadow = true
        @object.shadowCameraNear = 1
        @object.shadowCameraFar = Light.DEFAULT_RANGE
        @object.shadowCameraFov = 90

        @object.shadowBias = 0.0001
        @object.shadowDarkness = @shadowDarkness

        @object.shadowMapWidth = 1024
        @object.shadowMapHeight = 1024

        Graphics._instance.enableShadows true


    @DEFAULT_CAST_SHADOWS: false
    @DEFAULT_SHADOW_DARKNESS: 0.3