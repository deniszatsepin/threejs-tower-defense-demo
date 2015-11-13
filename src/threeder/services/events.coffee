define () ->

  class EventService
    constructor: ->
      if EventService._instance
        throw new Error('EventService singleton already exists')

    initialize: ->

    terminate: ->

    update: ->
      EventService._eventsPending = true
      while EventService._eventsPending
        EventService._eventsPending = false
        #TODO: I don't like next line
        Threeder.Game._instance.updateEntities()
      true

    @_eventsPending: false
    @_instance: null