define ['three', 'threeder/threeder', 'threeder/rocket'], (THREE, Threeder, Rocket) ->

  class MissileSystem extends Threeder.Entity
    constructor: (param) ->
      param = param or {}
      param.name = param.name or 'MissleSystem' + MissileSystem.number++
      super param

      @game = Threeder.Game._instance

      visual = new Threeder.Visual
        geometry: new THREE.BoxGeometry .8, .8, .8
        material: new THREE.MeshPhongMaterial color: 0xcccccc

      @addComponent visual
      @addTag('Rockets');

      picker = new Threeder.Picker()
      picker.on 'click', ((event) ->
        console.log('MissileSystem click: ', event)
      ).bind(@)

      @addComponent picker

      rotator = new Threeder.RotateBehavior autoStart: true

      #@addComponent rotator

      posX = 15
      posZ = Math.floor(Math.random() * 20)
      pfs = Threeder.PathFinding._instance
      start = pfs.gridToWorld(posX, posZ)
      @transform.position.x = start.x;
      @transform.position.z = start.y;
      @transform.position.y = .02;

      pathComponent = new Threeder.PathComponent()
      @addComponent pathComponent

      #TOWER
      tower = @tower = new Threeder.Entity
        name: 'MissleTower' + (MissileSystem.number - 1)
      tower.addComponent new Threeder.Visual
        geometry: new THREE.BoxGeometry .7, .7, .7
        material: new THREE.MeshPhongMaterial color: 0xaaaaaa
      tower.transform.position.y = .8 * .5 + .7 * .5
      #tower.transform.rotation.z = Math.PI * .2
      tracking = new Threeder.TargetTrackingBehavior
        autoStart: true
        maxRadius: 10
        minRadius: 5
      tracking.on 'closestEnemy', ((enemy) ->
        tower.currentEnemy = enemy
        for rocket in @rockets
          rocket.setTarget enemy
          if not enemy
            continue
          @startRocket rocket

        null
      ).bind @

      rocketLouncher = @rocketLouncher = new Threeder.Entity
        name: 'RocketLouncher' + (MissileSystem.number - 1)
      rocketLouncher.addComponent new Threeder.Visual
        geometry: new THREE.BoxGeometry 1.5, .3, .6
        material: new THREE.MeshPhongMaterial color: 0xff5555
      rocketLouncher.transform.position.y = tower.transform.position.y + 0.35 + 0.15

      tower.enemyDistance = 0
      zAxis = new THREE.Vector3(0, 0, 1)
      tracking.on 'changeEnemyDistance', ((enemy) ->
        angle = tower.enemyDistance * 5 * 0.01
        step = if angle * 0.2 > 1 then 1 else angle * 0.2
        angle = Math.PI * 0.25 * step
        #axis = zAxis.clone().applyQuaternion tower.transform.quaternion
        #axis.normalize()
        #q = new THREE.Quaternion()
        #q.setFromAxisAngle axis, angle
        console.log rocketLouncher.transform.rotation.z, angle
        rocketLouncher.transform.object.rotateOnAxis zAxis, -angle
      ).bind @


      tower.addComponent tracking

      towerRotator = new Threeder.RotateBehavior
        autoStart: true
        method: 'target'

      tower.addComponent towerRotator
      tower.addChild rocketLouncher

      #ROCKETS
      num = 5
      rockets = @rockets = ((num) ->
        rockets = []
        for i in [0..num - 1]
          z = i * 0.1 - 0.25
          rocket = new Rocket
            initPosition: new THREE.Vector3(.72, 0, z)
          rocket.transform.visible = false
          rockets.push rocket
          rocket.on 'target', @startRocket.bind(@)
          @game.addEntity rocket
        rockets
      ).call @, num

      @addChild tower

    startRocket: (rocket) ->
      rocket.setPosition @rocketLouncher.transform.object.matrixWorld
      rocket.fire()

    @number: 0