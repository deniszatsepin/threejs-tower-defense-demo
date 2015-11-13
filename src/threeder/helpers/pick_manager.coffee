define ['../services/graphics/graphics_service'], (Graphics) ->

  PickManager =
    handleMouseMove: (event) ->
      if @clickedObject
        pickers = @clickedObject.pickers
        for picker in pickers
          if picker.enabled and picker.onMouseMove
            picker.onMouseMove event
      else
        oldObj = @overObject
        @overObject = @objectFromMouse event

        if oldObj isnt @overObject
          if oldObj
            Graphics._instance.setCursor null
            event.type = 'mouseout'
            for picker in oldObj.pickers
              if picker.enabled and picker.onMouseOut
                picker.onMouseOut event
          if @overObject
            event.type = 'mouseout'
            for picker in @overObject.pickers
              if picker.enabled and picker.overCursor
                Graphics.instace.setCursor picker.overCursor

              if picker.enabled and picker.onMouseOver
                picker.onMouseOver event

        if @overObject
          for picker in @overObject.pickers
            if picker.enabled and picker.moveWithoutCapture and picker.onMouseMove
              event.type = 'mousemove'
              picker.onMouseMove event

    handleMouseDown: (event) ->
      @clickedObject = @objectFromMouse event

      if @clickedObject
        for picker in @clickedObject.pickers
          if picker.enabled and picker.onMouseDown
            picker.onMouseDown event

    handleMouseUp: (event) ->
      if @clickedObject
        overobject = @objectFromMouse event

        for picker in @clickedObject.pickers
          if picker.enabled and picker.onMouseUp
            picker.onMouseUp event

            if overobject is @clickedObject
              event.type = 'click'
              picker.onMouseClick event

      @clickedObject = null


    handleMouseClick: (event) ->
      @clickedObject = @objectFromMouse event
      if @clickedObject
        for picker in @clickedObject.pickers
          if picker.enabled and picker.onMouseClick
            picker.onMouseClick event
      @clickedObject = null

    handleMouseDoubleClick: (event) ->

      @clickedObject = @objectFromMouse event

      if @clickedObject
        for picker in @clickedObject.pickers
          if picker.enabled and picker.onMouseDoubleClick
            picker.onMouseDoubleClick event

      @clickedObject = null

    handleMouseScroll: (event) ->

      if @overObject
        for picker in @overObject.pickers
          if picker.enabled and picker.onMouseScroll
            picker.onMouseScroll event

    #TODO: realize touch event handlers here!


    objectFromMouse: (event) ->
      intersected = Graphics._instance.objectFromMouse event

      if intersected.object
        event.face = intersected.face
        event.normal = intersected.normal
        event.point = intersected.point
        event.object = intersected.object

        if intersected.object._entity.pickers
          for picker in intersected.object._entity.pickers
            if picker.enabled
              return intersected.object._entity
        return @findObjectPicker event, intersected.hitPointWorld, intersected.object.object
      else
        return null

    findObjectPicker: (event, hitPointWorld, object) ->
      while object
        if object.data and object.data._entity.pickers
          for picker in object.data._entity.pickers
            if picker.enabled
              modelMat = new THREE.Matrix4()
              modelMat = getInverse object.matrixWorld
              event.point = hitPointWorld.clone()
              event.point.applyMatrix4 modelMat
              return object.data._entity
        object = object.parent
      null

    clickedObject: null
    overObject: null
