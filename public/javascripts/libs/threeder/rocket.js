var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', 'threeder/threeder'], function(THREE, Threeder) {
  var Rocket;
  return Rocket = (function(_super) {
    __extends(Rocket, _super);

    function Rocket(param) {
      var rotator, visual;
      param = param || {};
      param.name = param.name || 'Rocket' + Rocket.number++;
      Rocket.__super__.constructor.call(this, param);
      this.initPosition = param.initPosition || new THREE.Vector3();
      this.initRotation = param.initRotation || new THREE.Quaternion();
      visual = new Threeder.Visual({
        geometry: new THREE.BoxGeometry(.3, .05, .05),
        material: new THREE.MeshPhongMaterial({
          color: 0xaaff11
        })
      });
      this.addComponent(visual);
      this.addTag('Rocket');
      rotator = new Threeder.RotateBehavior({
        autoStart: true
      });
      this.missileBehavior = new Threeder.MissileBehavior();
      this.addComponent(this.missileBehavior);
      this.missileBehavior.on('target', (function(e) {
        this.transform.visible = false;
        if (this.notarget) {
          this.missileBehavior.setTargetEntity(null);
          return this.notarget = false;
        } else {
          return this.emit('target', this);
        }
      }).bind(this));
    }

    Rocket.prototype.setTarget = function(entity) {
      this.target = entity;
      if (this.target) {
        this.notarget = false;
        return this.missileBehavior.setTargetEntity(entity);
      } else {
        return this.notarget = true;
      }
    };

    Rocket.prototype.setPosition = function(matrix) {
      this.transform.position.copy(this.initPosition);
      this.transform.object.quaternion.copy(this.initRotation);
      this.transform.object.updateMatrix();
      return this.transform.object.applyMatrix(matrix);
    };

    Rocket.prototype.fire = function() {
      this.transform.visible = true;
      return this.missileBehavior.start();
    };

    Rocket.number = 0;

    return Rocket;

  })(Threeder.Entity);
});
