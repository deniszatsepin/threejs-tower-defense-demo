define ['../core/component', '../services/graphics/graphics_service'], (Component, Graphics) ->

  class SceneComponent extends Component
    constructor: (param) ->
      param = param or {}
      super param

      Object.defineProperties @,
        position:
          get: ->
            @object.position

        rotation:
          get: ->
            @object.rotation

        scale:
          get: ->
            @object.scale

        quaternion:
          get: ->
            @object.quaternion

        up:
          get: ->
            @object.up
          set: (v) ->
            @object.up = v

        useQuaternion:
          get: ->
            @object.useQuaternion
          set: (v) ->
            @object.useQuaternion = v

        visible:
          get: ->
            @object.visible
          set: (v) ->
            @object.visible = v

        lookAt:
          value: (v) ->
            @object.lookAt v

        translateOnAxis:
          value: (a, d) ->
            @object.translateOnAxis a, d

        translateX:
          value: (d) ->
            @object.translateX d

        translateY:
          value: (d) ->
            @object.translateY d

        translateZ:
          value: (d) ->
            @object.translateZ d

      @layer = param.layer

    realize: ->
      if @object and not @object.data
        @addToScene()
      super

    update: ->
      super

    addToScene: ->
      scene = if @layer then @layer.scene else Graphics._instance.scene
      if @isAttached()
        if @_entity.transform.object != @object
          parent = if @_entity.transform then @_entity.transform.object else scene

          if parent
            if parent isnt @object.parent
              parent.add @object
            @object.data = @
          else
            console.warn 'Something has gone wrong add 1'
      else
        console.warn 'Something has gone wrong add 2'

    removeFromScene: ->
      scene = if @layer then @layer.scene else Graphics._instance.scene
      if @isAttached()
        parent = if @_entity.transform then @_entity.transform.object else scene

        if parent
          @object.data = null
          parent.remove @object
        else
          console.warn 'Something has gone wrong remove 1'

      else
        console.warn 'Something has gone wrong remove 2'

      @._realized = false
