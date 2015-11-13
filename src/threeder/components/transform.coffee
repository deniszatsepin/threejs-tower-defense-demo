define ['three', '../services/graphics/graphics_service', './scene_component'], (THREE, Graphics, SceneComponent) ->

  class Transform extends SceneComponent
    constructor: (param) ->
      param = param or {}
      super param

      if param.object
        @object = param.object
      else
        @object = new THREE.Object3D()


    _componentProperty: 'transform'
    _componentPropertyType: 'Transform'

    addToScene: ->
      scene = if @layer then @layer.scene else Graphics._instance.scene
      if @_entity
        parent = if @_entity._parent and @_entity._parent.transform then @_entity._parent.transform.object else scene
        if parent
          parent.add @object
          @object.data = @
        else
          console.warn 'Transform add 1'
      else
        console.warn 'Transform add 2'

    removeFromScene: ->
      scene = if @layer then @layer.scene else Graphics._instance.scene
      if @_entity
        parent = if @_entity._parent and @_entity._parent.transform then @_entity._parent.transform.object else scene
        if parent
          @object.data = null
          parent.remove @object
        else
          console.warn 'Transform remove 1'
      else
        console.warn 'Transform remove 2'
