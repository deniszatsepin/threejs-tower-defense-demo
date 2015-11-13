define () ->

  class TweenService
    constructor: ->
      if TweenService._instance
        throw new Error('Tween singleton already exists')

    initialize: ->
      TweenService._instance = @

    terminate: ->

    update: ->
      if window.TWEEN
        TWEEN.update()

    @_instance: null