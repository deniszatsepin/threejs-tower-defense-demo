define ['../services/services', '../services/graphics/graphics_service', '../helpers/pick_manager'], (Services, Graphics, PickManager) ->

  class Game
    constructor: (param) ->
      if Game._instance
        throw new Error('Game singleton already exists')
      Game._instance = @
      @initialize param

    initialize: (param) ->
      param = param or {}

      @running = false
      @tabstop = param.tabstop

      @_services = []
      @_entities = []

      @addService 'time'
      @addService 'input'

      @addOptionalServices()

      @addService 'tween'
      @addService 'events'
      @addService 'graphics'
      @addService 'pathfinding'

      @initServices param

    addService: (serviceName) ->
      service = Services.create serviceName
      @_services.push service

    addOptionalServices: ->

    initServices: (param) ->
      for service in @_services
        service.initialize param
      true

    focus: ->
      #TODO: it is something bad. I should remove this later
      Graphics._instance.focus()

    run: ->
      @realizeEntities()
      @lastFrameTime = Date.now()
      @running = true
      @runloop(0)

    runloop: (time) ->
      now = Date.now()
      deltat = now - @lastFrameTime
      if deltat >= Game.minFrameTime
        @updateServices()
        @lastFrameTime = now
      TWEEN.update time

      requestAnimationFrame @runloop.bind(@)

    updateServices: ->
      for service in @_services
        service.update()

    updateEntities: ->
      for entity in @_entities
        entity.update()

    addEntity: (entity) ->
      @_entities.push entity
      if @running
        entity.realize()

    removeEntity: (entity) ->
      idx = @_entities.indexOf entity
      if idx isnt -1
        @_entities.splice idx, 1

    realizeEntities: () ->
      for entity in @_entities
        entity.realize()

    traverse: (cb) ->
      for entity in @_entities
        cb entity
      null

    findTagsCallback: (e, query, found) ->
      if e.isTagged(query)
        found.push e
      null

    findEntitiesByTag: (tag) ->
      found = []
      @traverse ((e) ->
        @findTagsCallback e, tag, found
      ).bind @
      found

    onMouseMove: (event) ->
      if @mouseDelegate and @mouseDelegate.onMouseMove
        @mouseDelegate.onMouseMove event

    onMouseClick: (event) ->
      if @mouseDelegate and @mouseDelegate.onMouseClick
        @mouseDelegate.onMouseClick event
    # Static

    @_instance: null
    @curEntityId: 0
    @minFrameTime: 1

    @handleMouseMove: (event) ->
      if PickManager and PickManager.clickedObject
        return
      if @_instance.onMouseMove
        @_instance.onMouseMove event

    @handleMouseClick: (event) ->
      if PickManager and PickManager.clickedObject
        return
      if @_instance.onMouseClick
        @_instance.onMouseClick event
