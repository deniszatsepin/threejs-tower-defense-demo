var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', 'sparks', '../scene_component'], function(THREE, SPARKS, SceneComponent) {
  var Sparks, textureSize;
  textureSize = 128;
  return Sparks = (function(_super) {
    __extends(Sparks, _super);

    function Sparks(param) {
      var i, particle, _i, _ref;
      param = param || {};
      Sparks.__super__.constructor.apply(this, arguments);
      this.autoStart = param.autoStart || false;
      this._maxParticles = param.maxParticles || 100;
      this._texture = param.texture || this._buildDefaultTexture;
      this.counter = param.counter || console.assert(false, 'param.counter does not specified');
      this._vertexIndexPool = {
        __pools: [],
        get: function() {
          if (this.__pools.length > 0) {
            return this.__pools.pop();
          } else {
            console.assert(false, 'Pool run out');
            return null;
          }
        },
        add: function(v) {
          return this.__pools.push(v);
        }
      };
      this.geometry = new THREE.Geometry();
      this.vertices = this.geometry.vertices;
      for (i = _i = 0, _ref = this._maxParticles; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        particle = new THREE.Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        this.vertices.push(particle);
        this._vertexIndexPool.add(i);
      }
      this._attributes = {
        size: {
          type: 'f',
          value: []
        },
        aColor: {
          type: 'c',
          value: []
        }
      };
      this._uniforms = {
        texture: {
          type: "t",
          texture: this._texture
        },
        color: {
          type: "c",
          value: new THREE.Color(0xffffff)
        },
        sizeRatio: {
          type: "f",
          value: this._computeSizeRatio()
        }
      };
      this.sizes = this._attributes.size.value;
      this.colors = this._attributes.aColor.value;
      this.vertices.forEach((function(v, idx) {
        this.sizes[idx] = 99;
        return this.colors[idx] = new THREE.Color(0);
      }).bind(this));
      this.material = new THREE.ShaderMaterial({
        uniforms: this._uniforms,
        attributes: this._attributes,
        vertexShader: this._vertexShader,
        fragmentShader: this._fragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
      });
      this.object = new THREE.PointCloud(this.geometry, this.material);
      this.object.sortParticles = true;
      this.emitter = new SPARKS.Emitter(this.counter);
      this.emitter.addInitializer(new SPARKS.Target(null, this._setTargetParticle.bind(this)));
      this.emitter.addCallback("created", this.onParticleCreated.bind(this));
      this.emitter.addCallback("dead", this.onParticleDead.bind(this));
      this.emitter.addCallback("loopUpdated", this.onLoopUpdated.bind(this));
    }

    Sparks.prototype._componentCategory = 'particles';

    Sparks.prototype._setTargetParticle = function() {
      var target, vertexIdx;
      vertexIdx = this._vertexIndexPool.get();
      return target = {
        vertexIdx: vertexIdx,
        size: (function(value) {
          if (value !== void 0) {
            this.sizes[vertexIdx] = value;
          }
          return this.sizes[vertexIdx];
        }).bind(this),
        color: (function(value) {
          if (value !== void 0) {
            this.colors[vertexIdx] = value;
          }
          return this.colors[vertexIdx];
        }).bind(this)
      };
    };

    Sparks.prototype.onParticleCreated = function(particle) {
      var vertexIdx;
      vertexIdx = particle.target.vertexIdx;
      this.vertices[vertexIdx] = particle.position;
      return null;
    };

    Sparks.prototype.onParticleDead = function(particle) {
      var vertexIdx;
      vertexIdx = particle.target.vertexIdx;
      this.colors[vertexIdx].setHex(0);
      this.vertices[vertexIdx].set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
      this._vertexIndexPool.add(vertexIdx);
      return null;
    };

    Sparks.prototype.onLoopUpdated = function() {
      return this.object.geometry.verticesNeedUpdate = true;
    };

    Sparks.prototype.destroy = function() {
      if (this.emitter.isRunning()) {
        return this.emitter.stop();
      }
    };

    Sparks.prototype.addInitializer = function(initializer) {
      if (this.emitter) {
        return this.emitter.addInitializer(initializer);
      }
    };

    Sparks.prototype.addAction = function(action) {
      if (this.emitter) {
        return this.emitter.addAction(action);
      }
    };

    Sparks.prototype.realize = function() {
      Sparks.__super__.realize.apply(this, arguments);
      if (this.autoStart) {
        return this.emitter.start();
      }
    };

    Sparks.prototype.stop = function() {
      var vertex, _i, _len, _ref, _results;
      this.emitter.stop();
      _ref = this.vertices;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vertex = _ref[_i];
        vertex.set(Infinity, Infinity, Infinity);
        _results.push(this.geometry.verticesNeedUpdate = true);
      }
      return _results;
    };

    Sparks.prototype.start = function() {
      return this.emitter.start();
    };

    Sparks.prototype._buildDefaultTexture = (function(textureSize) {
      var canvas, context, gradient, size, texture;
      size = size || 128;
      canvas = document.createElement('canvas');
      context = canvas.getContext('2d');
      canvas.width = canvas.height = size;
      gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(128,128,128,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,1)');
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false);
      context.closePath();
      context.fillStyle = gradient;
      context.fill();
      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    })(textureSize);

    Sparks.prototype._computeSizeRatio = function() {
      return window.innerHeight / 1024;
    };

    Sparks.prototype._vertexShader = "attribute	float	size;\nattribute	vec4	aColor;\n\nuniform	float	sizeRatio;\n\nvarying	vec4	vColor;\n\nvoid main() {\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  gl_PointSize	= size * sizeRatio * ( 150.0 / length( mvPosition.xyz ) );\n  gl_Position	= projectionMatrix * mvPosition;\n\n  vColor		= aColor;\n}";

    Sparks.prototype._fragmentShader = "      uniform vec3		color;\n      uniform sampler2D	texture;\n\n      varying vec4		vColor;\n\n      void main() {\n        vec4 outColor	= texture2D( texture, gl_PointCoord );\n        gl_FragColor	= outColor * vec4( color * vColor.xyz, 1.0 );\n}";

    return Sparks;

  })(SceneComponent);
});
