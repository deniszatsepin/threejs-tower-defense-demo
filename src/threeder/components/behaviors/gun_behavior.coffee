define ['./behavior', 'three'], (Behavior, THREE) ->

  class GunBehavior extends Behavior
    constructor: (param) ->
      param = param or {}
      super param
      @maxRadius = param.maxRadius or 3
      @ray = new THREE.Raycaster(new THREE.Vector3, new THREE.Vector3, 0, Infinity)
      @shooting = false

    realize: ->
      super
      @geo = new THREE.Geometry();
      @geo.vertices.push(new THREE.Vector3(), new THREE.Vector3(5, 0.2, 5))
      material = new THREE.LineBasicMaterial
        color: 0x55ff55
      @line = new THREE.Line @geo, material
      entity = @getEntity()
      parent = do(entity) ->
        p = entity._parent
        if p
          return arguments.callee.call(@, p)
        else
          entity
      if parent
        scene = parent.transform.object.parent
        scene.add @line


    evaluate: (t) ->
      entity = @getEntity()
      currentEnemy = entity.currentEnemy
      if not currentEnemy
        if @shooting
          @shooting = false
          @emit 'shootStop'
        return

      threeObject = entity.transform.object
      direction = new THREE.Vector3(1, 0, 0)
      direction.applyEuler threeObject.rotation
      direction.normalize()
      pos = threeObject.position.clone()
      pos.applyMatrix4 threeObject.matrixWorld
      pos.y = .03


      @ray.set(pos, direction)

      targets = @ray.intersectObject currentEnemy._components[1].object
      ray = @ray.ray
      @geo.vertices[0].copy(ray.origin)
      dir = new THREE.Vector3(3, 0, 0)
      dir.applyEuler threeObject.rotation
      dir.add ray.origin
      @geo.vertices[1].copy(dir)
      @geo.verticesNeedUpdate = true
      console.log targets.length
      if targets and targets.length
        if not @shooting
          @shooting = true
          @emit 'shootStart'
      else
        if @shooting
          @shooting = false
          @emit 'shootStop'
      null




