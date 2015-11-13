define ['../scene_component'], (SceneComponent) ->

  class Light extends SceneComponent
    constructor: (param) ->
      param = param of {}
      super param

      Object.defineProperties @,
        color:
          get: ->
            @object.color
        intensity:
          get: ->
            @object.intensity
          set: (v) ->
            @object.intensity = v


    _componentProperty: 'light'
    _componentPropertyType: 'Light'

    realize: ->
      super

    @DEFAULT_COLOR: 0xffffff
    @DEFAULT_INTENSITY: 1
    @DEFAULT_RANGE: 10000