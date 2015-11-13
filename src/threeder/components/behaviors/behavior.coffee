define ['../../core/component', '../../services/time'], (Component, Time) ->

  class Behavior extends Component
    constructor: (param) ->
      param = param or {}
      @startTime = 0
      @running = false
      @loop = if param.loop? then param.loop else false
      @autoStart = if param.autoStart? then param.autoStart else false

      super param

    _componentCategory: 'behaviors'

    realize: ->
      super
      @start() if @autoStart

    start: ->
      @startTime = Time._instance.currentTime
      @running = true

    stop: ->
      @startTime = 0
      @running = false


    toggle: ->
      if @running
        @stop()
      else
        @start()

    update: ->
      if @running
        now = Time._instance.currentTime
        elapsedTime = (now - @startTime) / 1000

        @evaluate elapsedTime

    evaluate: (t) ->
      if (Behavior.WARN_ON_ABSTRACT)
        console.warn 'Abstract Begaviour.evaluate called'

    @WARN_ON_ABSTRACT: true