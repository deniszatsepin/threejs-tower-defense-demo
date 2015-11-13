define ['../input/mouse', '../input/keyboard'], (Mouse, Keyboard) ->

  class Input
    constructor: ->
      if Input._instance
        throw new Error('Input singleton already exists')

    initialize: ->
      @mouse = new Mouse()
      @keyboard = new Keyboard()
      Input._instance = @

    terminate: ->

    update: ->

    @_instance: null