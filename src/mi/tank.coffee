define ['three', 'threeder/threeder'], (THREE, Threeder) ->

  class Tank extends Threeder.Entity
    constructor: (param) ->
      param = param or {}
      super param

      visual = new Threeder.Visual
        geometry: new THREE.BoxGeometry .6, .4, .6
        material: new THREE.MeshPhongMaterial color: 0xcccccc

      @addComponent visual
      @addTag('Enemy');

      picker = new Threeder.Picker()
      picker.on 'click', ((event) ->
        console.log('Tank click: ', event)
        Threeder.SELECTED = @ #TODO: it should be selectble behavior
      ).bind(@)

      @addComponent picker

      rotator = new Threeder.RotateBehavior autoStart: true
      mover = new Threeder.MoveBehavior autoStart: true

      #@addComponent rotator
      @addComponent mover

      posX = 0
      posZ = Math.floor(Math.random() * 20)
      pfs = Threeder.PathFinding._instance
      start = pfs.gridToWorld(posX, posZ)
      @transform.position.x = start.x;
      @transform.position.z = start.y;
      @transform.position.y = .02;

      pathComponent = new Threeder.PathComponent()
      pathComponent.on 'nextTarget', ((target) ->
        @currentTarget = new THREE.Vector3(target.x, 0, target.y)
      ).bind(@)
      @addComponent pathComponent
      target = pfs.gridToWorld 25, 5
      pathComponent.setTarget target.x, target.y
