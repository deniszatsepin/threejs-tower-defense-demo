define ['three', '../core/component', '../helpers/pick_manager'], (THREE, Component, PickManager) ->

  class Picker extends Component
    constructor: (param) ->
      param = param or {}
      @overCursor = param.overCursor
      @enabled = if param.enabled != undefined then param.enabled else true

    _componentCategory: 'pickers'

    realize: () ->
      super
      @lastHitPoint = new THREE.Vector3()
      @lastHitNormal = new THREE.Vector3()
      @lastHitFace = new THREE.Face3()

    update: ->

    toModelSpace: (vec) ->
      modelMat = new THREE.Matrix4()
      modelMat.getInverse @_entity.transform.object.matrixWorld
      vec.applyMatrix4 modelMat

    onMouseOver: (event) ->
      @emit 'mouseover', event

    onMouseOut: (event) ->
      @emit 'mouseout', event

    onMouseMove: (event) ->
      mouseOverEntity = PickManager.entityFromMouse event

      if @_entity == PickManager.clickedEntity or @_entity == mouseOverEntity
        @lastHitPoint.copy event.point if event.point
        @lastHitNormal.copy event.normal if event.normal
        @lastHitFace = event.face if event.face

        @emit 'mousemove', event if event.point

      true

    onMouseDown: (event) ->
      @lastHitPoint.copy event.point
      @lastHitNormal.copy event.normal if event.normal
      @lastHitFace = event.face if event.face
      @emit 'mousedown', event

    onMouseUp: (event) ->
      mouseOverEntity = PickManager.entityFromMouse event
      if mouseOverEntity isnt @._entity
        event.point = @lastHitPoint
        event.normal = @lastHitNormal
        event.face = @lastHitFace

      @emit 'mouseout', event

    onMouseClick: (event) ->
      @lastHitPoint.copy event.point
      @lastHitNormal.copy event.normal if event.normal
      @lastHitFace = event.face if event.face

      @emit 'click', event

    onMouseDoubleClick: (event) ->
      @lastHitPoint.copy event.point
      @lastHitNormal.copy event.normal if event.normal
      @lastHitFace = event.face if event.face

      @emit 'dblclick', event

    onMouseScroll: (event) ->
      @emit 'mousescroll', event

    onTouchMove: (event) ->
      @emit 'touchmove', event

    onTouchStart: (event) ->
      @emit 'touchstart', event

    onTouchEnd: (event) ->
      @emit 'touchend', event



    onMouseDown: (event) ->
