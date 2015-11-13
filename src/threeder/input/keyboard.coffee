define () ->

  class Keyboard
    constructor: () ->
      if Keyboard._instance
        throw new Exception 'Keyboard already exists'
      Keyboard._instance = @

    onKeyDown: ->

    onKeyUp: ->

    onKeyPress: ->

    @_instance = null

    @KEY_LEFT:  37
    @KEY_UP:    38
    @KEY_RIGHT: 39
    @KEY_DOWN:  40