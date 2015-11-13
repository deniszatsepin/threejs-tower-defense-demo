var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', 'threeder/threeder', 'threeder/rocket'], function(THREE, Threeder, Rocket) {
  var MissileSystem;
  return MissileSystem = (function(_super) {
    __extends(MissileSystem, _super);

    function MissileSystem(param) {
      var num, pathComponent, pfs, picker, posX, posZ, rocketLouncher, rockets, rotator, start, tower, towerRotator, tracking, visual, zAxis;
      param = param || {};
      param.name = param.name || 'MissleSystem' + MissileSystem.number++;
      MissileSystem.__super__.constructor.call(this, param);
      this.game = Threeder.Game._instance;
      visual = new Threeder.Visual({
        geometry: new THREE.BoxGeometry(.8, .8, .8),
        material: new THREE.MeshPhongMaterial({
          color: 0xcccccc
        })
      });
      this.addComponent(visual);
      this.addTag('Rockets');
      picker = new Threeder.Picker();
      picker.on('click', (function(event) {
        return console.log('MissileSystem click: ', event);
      }).bind(this));
      this.addComponent(picker);
      rotator = new Threeder.RotateBehavior({
        autoStart: true
      });
      posX = 15;
      posZ = Math.floor(Math.random() * 20);
      pfs = Threeder.PathFinding._instance;
      start = pfs.gridToWorld(posX, posZ);
      this.transform.position.x = start.x;
      this.transform.position.z = start.y;
      this.transform.position.y = .02;
      pathComponent = new Threeder.PathComponent();
      this.addComponent(pathComponent);
      tower = this.tower = new Threeder.Entity({
        name: 'MissleTower' + (MissileSystem.number - 1)
      });
      tower.addComponent(new Threeder.Visual({
        geometry: new THREE.BoxGeometry(.7, .7, .7),
        material: new THREE.MeshPhongMaterial({
          color: 0xaaaaaa
        })
      }));
      tower.transform.position.y = .8 * .5 + .7 * .5;
      tracking = new Threeder.TargetTrackingBehavior({
        autoStart: true,
        maxRadius: 10,
        minRadius: 5
      });
      tracking.on('closestEnemy', (function(enemy) {
        var rocket, _i, _len, _ref;
        tower.currentEnemy = enemy;
        _ref = this.rockets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rocket = _ref[_i];
          rocket.setTarget(enemy);
          if (!enemy) {
            continue;
          }
          this.startRocket(rocket);
        }
        return null;
      }).bind(this));
      rocketLouncher = this.rocketLouncher = new Threeder.Entity({
        name: 'RocketLouncher' + (MissileSystem.number - 1)
      });
      rocketLouncher.addComponent(new Threeder.Visual({
        geometry: new THREE.BoxGeometry(1.5, .3, .6),
        material: new THREE.MeshPhongMaterial({
          color: 0xff5555
        })
      }));
      rocketLouncher.transform.position.y = tower.transform.position.y + 0.35 + 0.15;
      tower.enemyDistance = 0;
      zAxis = new THREE.Vector3(0, 0, 1);
      tracking.on('changeEnemyDistance', (function(enemy) {
        var angle, step;
        angle = tower.enemyDistance * 5 * 0.01;
        step = angle * 0.2 > 1 ? 1 : angle * 0.2;
        angle = Math.PI * 0.25 * step;
        console.log(rocketLouncher.transform.rotation.z, angle);
        return rocketLouncher.transform.object.rotateOnAxis(zAxis, -angle);
      }).bind(this));
      tower.addComponent(tracking);
      towerRotator = new Threeder.RotateBehavior({
        autoStart: true,
        method: 'target'
      });
      tower.addComponent(towerRotator);
      tower.addChild(rocketLouncher);
      num = 5;
      rockets = this.rockets = (function(num) {
        var i, rocket, z, _i, _ref;
        rockets = [];
        for (i = _i = 0, _ref = num - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          z = i * 0.1 - 0.25;
          rocket = new Rocket({
            initPosition: new THREE.Vector3(.72, 0, z)
          });
          rocket.transform.visible = false;
          rockets.push(rocket);
          rocket.on('target', this.startRocket.bind(this));
          this.game.addEntity(rocket);
        }
        return rockets;
      }).call(this, num);
      this.addChild(tower);
    }

    MissileSystem.prototype.startRocket = function(rocket) {
      rocket.setPosition(this.rocketLouncher.transform.object.matrixWorld);
      return rocket.fire();
    };

    MissileSystem.number = 0;

    return MissileSystem;

  })(Threeder.Entity);
});
