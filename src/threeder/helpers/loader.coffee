define ['three', 'ee', '../core/entity', '../core/component', '../components/visual', '../components/transform'], (THREE, EventEmitter, Entity, Component, Visual, Transform) ->

  class Loader extends EventEmitter
    constructor: ->
      super

    loadModel: (url, userData) ->
      splitUrl = url.split '.'
      len = splitUrl.length
      ext = if len then splitUrl[len - 1] else null
      return if not ext or not ext.length

      loaderClass = null
      callback = null
      switch ext.toUpperCase()
        when 'JS'
          loaderClass = THREE.JSONLoader
          callback = ((geometry, materials) ->
            @.handleModelLoaded url, userData, geometry, materials
          ).bind(@)

        when 'GLTF', 'JSON'
          loaderClass = THREE.glTFLoader
          callback = ((result) ->
            @.handleGLTFModelLoaded url, userData, result
          ).bind(@)

        when 'DAE'
          loaderClass = THREE.ColladaLoader
          callback = ((result) ->
            @.handleColladaModelLoaded url, userData, result
          ).bind(@)

      if loaderClass
        loader = new loaderClass()
        if loader and loader.options
          loader.options.convertUpAxis = true

        loader.load url, callback

    handleModelLoaded: (url, userData, geometry, materials) ->
      material = new THREE.MeshFaceMaterial materials
      mesh = new THREE.Mesh geometry, material

      entity = new Entity()
      visual = new Visual object: mesh
      entity.addComponent visual

      result =
        scene: entity
        cameras: []
        lights: []
        keyFrameAnimators: []
        userData: userData

      @emit 'loaded', result

    handleGLTFModelLoaded: (url, userData, result) ->
      if result.scene
	      result.scene.children = result.scene.children[0].children
	      convertedScene = @convertScene result.scene

      @emit 'loaded',
        scene:  convertedScene
        cameras: []
        lights: []
        keyFrameAnimators: []
        userData: userData

    convertScene: (scene) ->
      convert = (n) ->
        if n instanceof THREE.Mesh
          n.matrixAutoUpdate = true
          n.geometry.dynamic = true
          v = new Visual
            object: n
          v.name = n.name
          return v

        if n.children
          n.matrixAutoUpdate = true
          group = new Entity autoCreateTransform: false
          group.addComponent(new Transform(object: n))
          group.name = n.name
          for child in n.children
            convertedChild = convert child
            if convertedChild instanceof Entity
              group.addChild convertedChild
            else if convertedChild instanceof Component
              group.addComponent convertedChild
            else
              console.warn 'Undefined child'
          return group

      scene.updateMatrixWorld()
      convert scene

    handleColladaModelLoaded: (url, userData, result) ->
      if result.scene
	      convertedScene = @convertScene result.scene

      @emit 'loaded',
        scene:  convertedScene
        cameras: []
        lights: []
        keyFrameAnimators: []
        userData: userData
