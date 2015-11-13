define(['three', 'gltfLoader', 'colladaLoader', 'tween', 'sparks', 'threexSparks','threeder/threeder', 'threeder/tank', 'threeder/missile_system', 'threeder/rocket', './plane'],
	function(THREE, glTFLoader, ColladaLoader, TWEEN, SPARKS, THREEx, Threeder, Tank, MissileSystem, Rocket, PlaneGenerator) {
    var Game = {
      init: function() {
        console.log('Game inited');
        var container = document.getElementById('container');
        this.app = new Threeder.Game({container: container});
        var tankButton = document.getElementById('add-tank');
        if (tankButton) {
          tankButton.addEventListener('click', function(event) {
            var tank = new Tank();
            tank.addComponent(this.initSparks({
              autoStart: true,
              position: new THREE.Vector3(.3,.2, 0)
            }));
            this.app.addEntity(tank);
          }.bind(this), false);
        }
        var missileButton = document.getElementById('add-missile');
        if (missileButton) {
          missileButton.addEventListener('click', function(event) {
            var missileSystem = new MissileSystem();
            this.app.addEntity(missileSystem);
          }.bind(this), false);
        }
        var rocketButton = document.getElementById('start-rocket');
        if (rocketButton) {
          rocketButton.addEventListener('click', function(event) {
            this.rockets.forEach(function(rocket) {
              var missileBehavior = rocket.getFirstComponentByType(Threeder.MissileBehavior);
              if (missileBehavior) {
                if (!this.rocketStarted) {
                  //pos = this.target.transform.position.clone();
                  //missileBehavior.setTargetV(pos);
                  missileBehavior.start();
                  this.rocketStarted = true;
                } else {
                  missileBehavior.toggle();
                }
              }
            }.bind(this));

          }.bind(this), false);
        }
      },

      initSparks: function(param) {
        param = param || {};
        var position = param.position || new THREE.Vector3(0.3, 0, 0);
        param.maxParticles = 50;
        param.counter = new SPARKS.SteadyCounter(300);
        var sparks = new Threeder.Sparks(param);

        var initColorSize = function () {
          this.initialize = function (emitter, particle) {
            particle.target.color().setHSL(0.1, 0.5, 0.4);
            var size = particle.target.vertexIdx % 2 ? 1 : .2;
            particle.target.size(size);
          };
        };

        sparks.addInitializer(new initColorSize());
        sparks.addInitializer(new SPARKS.Position(new SPARKS.PointZone(position)));
        sparks.addInitializer(new SPARKS.Lifetime(0, 0.2));
        sparks.addInitializer(new SPARKS.Velocity(new SPARKS.PointZone(new THREE.Vector3(2, 0, 0))));

        sparks.addAction(new SPARKS.Age());
        sparks.addAction(new SPARKS.Move());
        sparks.addAction(new SPARKS.RandomDrift(10, 0, 0));
        sparks.addAction(new SPARKS.Accelerate(20, 0, 0));
        return sparks;
      },


      start: function() {
        var app = this.app;

        var light = new Threeder.Entity();
        light.addComponent(new Threeder.DirectionalLight({
          color: 0xffffff,
          intensity: 1.0,
          direction: new THREE.Vector3(0, -1, -1)
        }));

        var pathFindingService = Threeder.PathFinding._instance;
        var plane = new Threeder.Entity({name: 'Plane'});
        var planeVisuals = PlaneGenerator(30, 20);
        pathFindingService.setGrid(30, 20);
        for (var h = 0, hLen = planeVisuals.length; h < hLen; h += 1) {
          for (var w = 0, wLen = planeVisuals[h].length; w < wLen; w += 1) {
            var tile = new Threeder.Entity({name:'Tile[' + h + ',' + w + ']'});
            var vis = planeVisuals[h][w];
            vis.material.transparent = true;
            vis.material.opacity = 0.2;
            var planeVisual = new Threeder.Visual({
              geometry: vis.geometry,
                material: vis.material
            });
            tile.addComponent(planeVisual);

            tile.transform.position.x = (-wLen * 0.5) + w + 0.01 + 0.5;
            tile.transform.position.y = (-hLen * 0.5) + h + 0.01 + 0.5;
            tile.transform.position.z = 0.01;

            plane.addChild(tile);
            var picker = new Threeder.Picker();
            picker.on('mouseover', function(event) {
              var out = event.object? event.object._entity.name : event;
              //event.object.material.opacity = .1;
              //console.log('Event[over]: ', out);
            });
            picker.on('mouseout', function(event) {
              var out = event.object? event.object._entity.name : event;
              //event.object.material.opacity = .0;
              //console.log('Event[out]: ', out);
            });
            picker.on('click', function(event) {
              if (event.object && event.object.position) {
                var object = event.object._entity.transform.object;
                var pos = object.position.clone();
                var target = pos.clone().set(pos.x, pos.z, -pos.y);
                var entity = Threeder.SELECTED;
                if (entity) {
                  var path = entity.getFirstComponentByType(Threeder.PathComponent);
                  if (path) {
                    path.setTarget(target.x, target.z);
                  }
                }
              }
            });
            tile.addComponent(picker);
          }
        }

        var texture = THREE.ImageUtils.loadTexture('./models/tourel/mars.png', null, function() {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(2, 2);
          var bumpTexture = THREE.ImageUtils.loadTexture('./models/tourel/mars_normal.png', null, function() {
            bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
            bumpTexture.repeat.set(2, 2);
            var planeVis = new Threeder.Visual({
              material: new THREE.MeshPhongMaterial({color: 0xffff55, map: texture, normalMap: bumpTexture}),
                geometry: new THREE.PlaneGeometry(40, 20)
            });

            plane.addComponent(planeVis);
            plane.transform.rotation.x = -Math.PI * 0.5;



            app.addEntity(plane);

          });

        });


        app.addEntity(light);

        var camera = Threeder.Graphics._instance.camera;
        camera.position.set(0, 20, 20);
        //camera.rotation.x = -Math.PI / 3;
        camera.lookAt(new THREE.Vector3(0,0,0));

        var loader = new Threeder.Loader();
        loader.on('loaded', function(result) {
          var tourel = result.scene;
          tourel.transform.scale.set(0.5, 0.5, 0.5);
          tourel.transform.position.set(-5 + 0.5, 0.0, -5 + 0.5);
          //tourel.transform.rotation.x = Math.PI;
          var towerRotator = new Threeder.RotateBehavior({
            autoStart: true,
              method: 'target'
          });
          var tower = tourel.findNode('Tower');
          var tracking = new Threeder.TargetTrackingBehavior({autoStart: true});
          tracking.on('closestEnemy', function(enemy) {
            tower.currentEnemy = enemy;
          });
          tower.addComponent(tracking);
          tower.addComponent(towerRotator);

          var gunBehavior = new Threeder.GunBehavior({autoStart: true});
          gunBehavior.on('shootStart', function() {
            console.log('shootStart');
            var sparks = tower.getComponentsByType(Threeder.Sparks);
            if (sparks.length) {
              sparks[0].start();
            }
          });
          gunBehavior.on('shootStop', function() {
            console.log('shootStop');
            var sparks = tower.getComponentsByType(Threeder.Sparks);
            if (sparks.length) {
              sparks[0].stop();
            }
          });
          tower.addComponent(gunBehavior);


          tower.addComponent(this.initSparks({
            position: new THREE.Vector3(1.5, 0.7, 0)
          }));

          var gun = tower.findNode('Gun');
          var gunRotator = new Threeder.RotateBehavior({
            axis: new THREE.Vector3(1, 0, 0)
          });
          gun.addComponent(gunRotator);
          var pathComponent = new Threeder.PathComponent();
          pathComponent.on('nextTarget', function(target) {
            this.currentTarget = new THREE.Vector3(target.x, 0, target.y);
          }.bind(tourel));
          tourel.addComponent(pathComponent);
          app.addEntity(tourel);
        }.bind(this));
        //loader.loadModel('/models/tourel/tourel.gltf');

	      /*
	      this.rockets = (function(app, num){
		      var rockets = [];
		      for (var i = 0; i < num; i += 1) {
			      var rocket = new Rocket();
			      app.addEntity(rocket);
			      rockets.push(rocket);
		      }
		      return rockets;
	      })(app, 50);
	      */
        var target = this.target = new Threeder.Entity();
        var tVisual = new Threeder.Visual({
          geometry: new THREE.BoxGeometry(.9, .9, .9),
          material: new THREE.MeshPhongMaterial({color: 0x55ffaa})
        });
        target.addComponent(tVisual);
        target.transform.position.set(7.5, 0.1, Math.floor(Math.random() * 19) + 0.5 - 10);
        app.addEntity(target);

        app.run();
        console.log('Game started');
      }
    };

    return Game;
  });
