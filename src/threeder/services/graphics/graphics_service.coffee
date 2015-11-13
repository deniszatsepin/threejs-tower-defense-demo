define () ->

  class Graphics
    constructor: ->
      if Graphics._instance
        throw new Error 'Graphics singleton already exists'
      Graphics._instance = @

    @_instance = null