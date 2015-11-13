define () ->

  class Mouse
    constructor: () ->
      if Mouse._instance
        throw new Exception 'Mouse already exists'

      @state =
        x: Mouse.NO_POSITION
        y: Mouse.NO_POSITION
        buttons:
          left: false
          middle: false
          right: false
        scroll: 0

      Mouse._instance = @

    onMouseMove: (event) ->
      @state.x = event.elementX
      @state.y = event.elementY

    onMouseDown: (event) ->
      @state.x = event.elementX
      @state.y = event.elementY
      @state.buttons.left = true

    onMouseUp: (event) ->
      @state.x = event.elementX
      @state.y = event.elementY
      @state.buttons.left = false

    onMouseClick: (event) ->
      @state.x = event.elementX
      @state.y = event.elementY
      @state.buttons.left = false

    onMouseDoubleClick: (event) ->
      @state.x = event.elementX
      @state.y = event.elementY
      @state.buttons.left = false

    onMouseScroll: (event, delta) ->
      @state.scroll = 0

    getState: ->
      @state

    @_instance = null
    @NO_POSITION = Number.MIN_VALUE