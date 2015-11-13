define ['ee'], (EventEmitter) ->

  class Component extends EventEmitter
    constructor: ->
      super
      @_entity = null;
      @_realized = false

    isAttached: ->
      !!@_entity

    attach: (entity) ->
      @_entity = entity

    detach: ->
      @_entity = null

    getEntity: ->
      @_entity

    realize: ->
      @_realized = true

    update: ->