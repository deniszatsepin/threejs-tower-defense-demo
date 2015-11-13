var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['three', 'threeder/threeder'], function(THREE, Threeder) {
  var Tank;
  return Tank = (function(_super) {
    __extends(Tank, _super);

    function Tank(param) {
      var mover, pathComponent, pfs, picker, posX, posZ, rotator, start, target, visual;
      param = param || {};
      Tank.__super__.constructor.call(this, param);
      visual = new Threeder.Visual({
        geometry: new THREE.BoxGeometry(.6, .4, .6),
        material: new THREE.MeshPhongMaterial({
          color: 0xcccccc
        })
      });
      this.addComponent(visual);
      this.addTag('Enemy');
      picker = new Threeder.Picker();
      picker.on('click', (function(event) {
        console.log('Tank click: ', event);
        return Threeder.SELECTED = this;
      }).bind(this));
      this.addComponent(picker);
      rotator = new Threeder.RotateBehavior({
        autoStart: true
      });
      mover = new Threeder.MoveBehavior({
        autoStart: true
      });
      this.addComponent(mover);
      posX = 0;
      posZ = Math.floor(Math.random() * 20);
      pfs = Threeder.PathFinding._instance;
      start = pfs.gridToWorld(posX, posZ);
      this.transform.position.x = start.x;
      this.transform.position.z = start.y;
      this.transform.position.y = .02;
      pathComponent = new Threeder.PathComponent();
      pathComponent.on('nextTarget', (function(target) {
        return this.currentTarget = new THREE.Vector3(target.x, 0, target.y);
      }).bind(this));
      this.addComponent(pathComponent);
      target = pfs.gridToWorld(25, 5);
      pathComponent.setTarget(target.x, target.y);
    }

    return Tank;

  })(Threeder.Entity);
});
