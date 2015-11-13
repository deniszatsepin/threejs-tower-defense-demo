var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./behavior', 'three'], function(Behavior, THREE) {
  var GunBehavior;
  return GunBehavior = (function(_super) {
    __extends(GunBehavior, _super);

    function GunBehavior(param) {
      param = param || {};
      GunBehavior.__super__.constructor.call(this, param);
      this.maxRadius = param.maxRadius || 3;
      this.ray = new THREE.Raycaster(new THREE.Vector3, new THREE.Vector3, 0, Infinity);
      this.shooting = false;
    }

    GunBehavior.prototype.realize = function() {
      var entity, material, parent, scene;
      GunBehavior.__super__.realize.apply(this, arguments);
      this.geo = new THREE.Geometry();
      this.geo.vertices.push(new THREE.Vector3(), new THREE.Vector3(5, 0.2, 5));
      material = new THREE.LineBasicMaterial({
        color: 0x55ff55
      });
      this.line = new THREE.Line(this.geo, material);
      entity = this.getEntity();
      parent = (function(entity) {
        var p;
        p = entity._parent;
        if (p) {
          return arguments.callee.call(this, p);
        } else {
          return entity;
        }
      })(entity);
      if (parent) {
        scene = parent.transform.object.parent;
        return scene.add(this.line);
      }
    };

    GunBehavior.prototype.evaluate = function(t) {
      var currentEnemy, dir, direction, entity, pos, ray, targets, threeObject;
      entity = this.getEntity();
      currentEnemy = entity.currentEnemy;
      if (!currentEnemy) {
        if (this.shooting) {
          this.shooting = false;
          this.emit('shootStop');
        }
        return;
      }
      threeObject = entity.transform.object;
      direction = new THREE.Vector3(1, 0, 0);
      direction.applyEuler(threeObject.rotation);
      direction.normalize();
      pos = threeObject.position.clone();
      pos.applyMatrix4(threeObject.matrixWorld);
      pos.y = .03;
      this.ray.set(pos, direction);
      targets = this.ray.intersectObject(currentEnemy._components[1].object);
      ray = this.ray.ray;
      this.geo.vertices[0].copy(ray.origin);
      dir = new THREE.Vector3(3, 0, 0);
      dir.applyEuler(threeObject.rotation);
      dir.add(ray.origin);
      this.geo.vertices[1].copy(dir);
      this.geo.verticesNeedUpdate = true;
      console.log(targets.length);
      if (targets && targets.length) {
        if (!this.shooting) {
          this.shooting = true;
          this.emit('shootStart');
        }
      } else {
        if (this.shooting) {
          this.shooting = false;
          this.emit('shootStop');
        }
      }
      return null;
    };

    return GunBehavior;

  })(Behavior);
});
