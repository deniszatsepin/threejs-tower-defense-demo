define [
  'three',
  './graphics_service',
  '../../core/game',
  '../../helpers/pick_manager',
  '../../components/cameras/camera',
  '../../input/mouse'],
(THREE, Graphics, Game, PickManager, Camera, Mouse) ->

  window = @
  document = window.document

  class ThreeGraphicsService extends Graphics
    constructor: (param) ->
      super

    initialize: (param) ->
      @initPageElements param
      @initScene param
      @initRenderer param
      @initMouse()
      @initKeyboard()
      @initEnviron()

    initPageElements: (param) ->
      if param.container
        @container = param.container
      else
        @container = document.createElement 'div'
        document.body.appendChild @container

    initScene: (param) ->
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(
        45
        @container.offsetWidth / @container.offsetHeight
        Camera.DEFAULT_NEAR
        Camera.DEFAULT_FAR
      )
      camera.position.copy Camera.DEFAULT_POSITION

      scene.add camera

      @scene = scene
      @camera = camera

    initRenderer: (param) ->
      antialias = if param.antialias isnt undefined then param.antialias else true
      alpha = if param.alpha isnt undefined then param.alpha else true

      renderer = new THREE.WebGLRenderer
        antialias: antialias
        alpha: alpha

      renderer.sortObjects = false
      renderer.setSize @container.offsetWidth, @container.offsetHeight

      if param and param.backgroundColor
        renderer.domElement.style.backgroundColor = param.backgroundColor
        renderer.domElement.setAttribute 'z-index', -1

      @container.appendChild renderer.domElement

      projector = new THREE.Projector()

      @renderer = renderer
      @projector = projector

      @lastFrameTime = 0

      undefined

    _initHandlers: (element, handlers) ->
      for event, handler of handlers
        element.addEventListener event, handler.bind(@), false
      true

    initMouse: ->
      canvas = @renderer.domElement
      handlers =
        mousemove:  @onCanvasMouseMove
        mousedown:  @onCanvasMouseDown
        mouseup:    @onCanvasMouseUp
        click:      @onCanvasMouseClick
        dblclick:   @onCanvasMouseDoubleClick
        mousewheel: @onCanvasMouseScroll
        DOMMouseScroll: @onCanvasMouseScroll
        touchstart: @onCanvasTouchStart
        touchmove:  @onCanvasTouchMove
        touchend:   @onCanvasTouchEnd

      @_initHandlers canvas, handlers
      true

    initKeyboard: ->
      canvas = @renderer.domElement
      handlers =
        keydown:  @onKeyDown
        keyup:    @onKeyUp
        keypress: @onKeyPress

      @_initHandlers canvas, handlers

      canvas.setAttribute('tabindex', 99999);

    initEnviron: ->
      handlers =
        resize: @onWindowResize
      @_initHandlers(window, handlers)

    getTopVisible: (intersects) ->
      intersected = null

      for intersect in intersects
        if intersect.object.visible and not intersect.object.ignorePick
          intersected = intersect
          break

      if not intersected
        result =
          object: null
          point: null
          normal: null
      else
        @findObjectFromIntersected intersected.object, intersected.point, intersected.face


    objectFromMouse: (event) ->
      eltx = event.elementX
      elty = event.elementY

      vpx = ( eltx / @container.offsetWidth ) * 2 - 1;
      vpy = - ( elty / @container.offsetHeight ) * 2 + 1;

      vector = new THREE.Vector3(vpx, vpy, 1)

      @projector.unprojectVector vector, @camera

      raycaster = new THREE.Raycaster(@camera.position, vector.sub(@camera.position).normalize())
      intersects = raycaster.intersectObjects @scene.children, true

      @getTopVisible intersects

    objectFromRay: (hierarchy, origin, direction, near, far) ->
      raycaster = new THREE.Raycaster(origin, direction, near, far)

      objects = null
      if hierarchy
        objects = hierarchy.transform.object.children
      else
        objects = @scene.children

      intersects = raycaster.intersectObjects objects, true

      @getTopVisible intersects


    findObjectFromIntersected: (object, point, face) ->
      if object.data
        hitPointWorld = point.clone()
        modelMat = new THREE.Matrix4()
        modelMat.getInverse object.matrixWorld
        point.applyMatrix4 modelMat
        normal = if face then face.normal else null
        result =
          object: object.data
          point: point
          hitPointWorld: hitPointWorld
          face: face
          normal: normal
      else if object.parent
        @findObjectFromIntersected object.parent, point, face
      else
        result =
          object: null
          point: null
          face: null
          normal: null

    nodeFromMouse: (event) ->
      console.warn '[Threeder] function dosn\'t implemented'

    getObjectIntersection: (x, y, object) ->
      vpx = ( eltx / @container.offsetWidth ) * 2 - 1;
      vpy = ( elty / @container.offsetHeight ) * 2 + 1;

      vector = new THREE.Vector3(vpx, vpy, 0.5)

      @projector.unprojectVector vector, @camera

      pos = new THREE.Vector3()
      pos = pos.applyMatrix4 @camera.matrixWorld

      raycaster = new THREE.Raycaster(pos, vector.sub(pos).normalize())
      intersects = raycaster.intersectObject object, true

      if intersects.length
        intersection = intersects[0]
        modelMat = new THREE.Matrix4()
        modelMat.getInverse intersection.object.matrixWorld
        intersection.point.applyMatrix4 modelMat
        intersection
      else
        null


    calcElementOffset: (offset) ->
      offset.left = @renderer.domElement.offsetLeft
      offset.top = @renderer.domElement.offsetTop

      parent = @renderer.domElement.offsetParent

      while parent
        offset.left += parent.offsetLeft
        offset.top += parent.offsetTop
        parent = parent.offsetParent

    onCanvasMouseMove: (event) ->
      event.preventDefault()
      offset = {}
      @calcElementOffset offset

      eltx = event.pageX - offset.left
      elty = event.pageY - offset.top

      evt =
        type: event.type
        pageX: event.pageX
        pageY: event.pageY
        elementX: eltx
        elementY: elty
        button: event.button
        altKey: event.altKey
        ctrlKey: event.ctrlKey
        shiftKey: event.shiftKey

      Mouse._instance.onMouseMove evt

      if PickManager
        PickManager.handleMouseMove evt

      Threeder.Game.handleMouseMove evt

    onCanvasMouseDown: (event) ->
      console.warn 'Method dosnt realize'

    onCanvasMouseUp: (event) ->
      console.warn 'Method dosnt realize'

    onCanvasMouseClick: (event) ->
      event.preventDefault()
      offset = {}
      @calcElementOffset offset
      eltx = event.pageX - offset.left
      elty = event.pageY - offset.top
      evt =
        type: event.type
        pageX: event.pageX
        pageY: event.pageY
        elementX: eltx
        elementY: elty
        button: event.button
        altKey: event.altKey
        ctrlKey: event.ctrlKey
        shiftKey: event.shiftKey
      Mouse._instance.onMouseClick evt
      if PickManager
        PickManager.handleMouseClick evt
      Threeder.Game.handleMouseClick evt

    onCanvasMouseDoubleClick: (event) ->
      console.warn 'Method dosnt realize'

    onCanvasMouseScroll: (event) ->
      console.warn 'Method dosnt realize'

    translateTouch: (event) ->
      console.warn 'Method dosnt realize'

    onCanvasTouchStart: (event) ->
      console.warn 'Method dosnt realize'

    onCanvasTouchMove: (event) ->
      console.warn 'Method dosnt realize'

    onCanvasTouchEnd: (event) ->
      console.warn 'Method dosnt realize'

    onKeyDown: (event) ->
      console.warn 'Method dosnt realize'

    onKeyUp: (event) ->
      console.warn 'Method dosnt realize'

    onKeyPress: (event) ->
      console.warn 'Method dosnt realize'

    onWindowResize: (event) ->
      console.warn 'Method dosnt realize'

    setCursor: (cursor) ->
      if not cursor
        cursor = @savedCursor
      @container.style.cursor = cursor

    update: () ->
      if @sparksContainer
        @sparksContainer.update()

      @renderer.setClearColor 0xaaaaaa, 1
      @renderer.autoClearColor = true
      @renderer.render @scene, @camera

      frameTime = Date.now()
      deltat = (frameTime - @lastFrameTime) / 1000
      @frameRate = 1 / deltat

      @lastFrameTime = frameTime

    enableShadows: (enable) ->
      @renderer.shadowMapEnabled = enable
      @renderer.shadowMapSoft = enable
      @renderer.shadowMapCullFace = false