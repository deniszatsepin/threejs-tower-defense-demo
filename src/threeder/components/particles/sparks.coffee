define ['three', 'sparks', '../scene_component'], (THREE, SPARKS, SceneComponent) ->
	textureSize = 128
	#TODO: create textures pool
	class Sparks extends SceneComponent
    constructor: (param) ->
      param = param or {}
      super
      @autoStart = param.autoStart or false
      @_maxParticles = param.maxParticles or 100
      @_texture = param.texture or @_buildDefaultTexture
      @counter = param.counter or console.assert(false, 'param.counter does not specified')

      @_vertexIndexPool =
        __pools: []
        get: () ->
          if (@__pools.length > 0)
            return @__pools.pop()
          else
            console.assert(false, 'Pool run out')
            return null
        add: (v) ->
          @__pools.push v

      @geometry = new THREE.Geometry()
      @vertices = @geometry.vertices
      for i in [0..@_maxParticles]
        particle = new THREE.Vector3 Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY
        @vertices.push particle
        @_vertexIndexPool.add i

      @_attributes =
		    size:
          type: 'f'
          value: []
		    aColor:
          type: 'c'
          value: []

      @_uniforms	=
		    texture:
          type: "t"
          texture: @_texture
		    color:
          type: "c"
          value: new THREE.Color(0xffffff)
		    sizeRatio:
          type: "f"
          value: @_computeSizeRatio()

      @sizes = @_attributes.size.value
      @colors = @_attributes.aColor.value
      @vertices.forEach ((v, idx) ->
        @sizes[idx] = 99
        @colors[idx] = new THREE.Color 0
      ).bind @

      @material = new THREE.ShaderMaterial
        uniforms: @_uniforms
        attributes: @_attributes
        vertexShader: @_vertexShader
        fragmentShader: @_fragmentShader

        blending: THREE.AdditiveBlending
        depthWrite: false
        transparent: true

      @object = new THREE.PointCloud @geometry, @material
      @object.sortParticles = true

      @emitter = new SPARKS.Emitter @counter
      @emitter.addInitializer(new SPARKS.Target(null, @_setTargetParticle.bind(@)))
      @emitter.addCallback "created"	, @onParticleCreated.bind(@)
      @emitter.addCallback "dead"	, @onParticleDead.bind(@)
      @emitter.addCallback "loopUpdated", @onLoopUpdated.bind(@)


    _componentCategory: 'particles'

    _setTargetParticle: () ->
      vertexIdx = @_vertexIndexPool.get()
      target =
        vertexIdx: vertexIdx
        size: ((value) ->
          if value isnt undefined
            @sizes[vertexIdx] = value
          @sizes[vertexIdx]
        ).bind @
        color: ((value) ->
          if value isnt undefined
            @colors[vertexIdx] = value
          @colors[vertexIdx]
        ).bind @

    onParticleCreated: (particle) ->
      vertexIdx = particle.target.vertexIdx
      @vertices[vertexIdx] = particle.position
      null

    onParticleDead: (particle) ->
      vertexIdx	= particle.target.vertexIdx
      @colors[vertexIdx].setHex 0
      @vertices[vertexIdx].set Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY
      @_vertexIndexPool.add vertexIdx
      null

    onLoopUpdated: ->
      @object.geometry.verticesNeedUpdate = true

    destroy: ->
      if @emitter.isRunning()
        @emitter.stop()

    addInitializer: (initializer) ->
      if @emitter
        @emitter.addInitializer initializer

    addAction: (action) ->
      if @emitter
        @emitter.addAction action

    realize: ->
      super
      if @autoStart
        @emitter.start()

    stop: ->
      @emitter.stop()
      for vertex in @vertices
        vertex.set(Infinity, Infinity, Infinity)
        @geometry.verticesNeedUpdate = true

    start: ->
      @emitter.start()

    _buildDefaultTexture: do(textureSize) ->
      size = size or 128
      canvas = document.createElement 'canvas'
      context = canvas.getContext '2d'
      canvas.width = canvas.height = size

      gradient	= context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
      gradient.addColorStop 0, 'rgba(255,255,255,1)'
      gradient.addColorStop 0.2, 'rgba(255,255,255,1)'
      gradient.addColorStop 0.4, 'rgba(128,128,128,1)'
      gradient.addColorStop 1, 'rgba(0,0,0,1)'

      context.beginPath()
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false)
      context.closePath()
      context.fillStyle	= gradient
      context.fill()

      texture	= new THREE.Texture canvas
      texture.needsUpdate = true

      texture

    _computeSizeRatio: () ->
      window.innerHeight / 1024

    _vertexShader: """
        attribute	float	size;
        attribute	vec4	aColor;

        uniform	float	sizeRatio;

        varying	vec4	vColor;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize	= size * sizeRatio * ( 150.0 / length( mvPosition.xyz ) );
          gl_Position	= projectionMatrix * mvPosition;

          vColor		= aColor;
        }
      """
    _fragmentShader: """
      uniform vec3		color;
      uniform sampler2D	texture;

      varying vec4		vColor;

      void main() {
        vec4 outColor	= texture2D( texture, gl_PointCoord );
        gl_FragColor	= outColor * vec4( color * vColor.xyz, 1.0 );
	    }
      """
