define ['three', './scene_component'], (THREE, SceneComponent) ->

  class Visual extends SceneComponent
    constructor: (param) ->
      param = param or {}
      super param

      if param.object
        @object = param.object
        @geometry = @object.geometry
        @material = @object.material
      else
        @geometry = param.geometry
        @material = param.material


    _componentCategory: 'visuals'

    realize: ->
      super

      if not @object and @geometry and @material
        @object = new THREE.Mesh @geometry, @material
        @object.ignorePick = false;
        @addToScene()