define () ->

  class Time
    constructor: ->
      if Time._instance
        throw new Error('Time singleton already exists')

    initialize: ->
      @currentTime = Date.now()
      Time._instance = @

    terminate: ->

    update: ->
      @currentTime = Date.now()

    @_instance: null