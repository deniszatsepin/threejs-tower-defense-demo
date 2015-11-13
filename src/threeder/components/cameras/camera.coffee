define ['three', '../scene_component'], (THREE, SceneComponent) ->

  class Camera extends SceneComponent
    constructor: (param) ->


    @DEFAULT_POSITION = new THREE.Vector3(0, 0, 10)
    @DEFAULT_NEAR = 1
    @DEFAULT_FAR = 10000;
