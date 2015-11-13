define(['./core/game', './core/entity', './core/component', './components/scene_component', './components/visual', './components/cameras/camera', './components/lights/directional_light', './components/behaviors/rotate_behavior', './components/behaviors/move_behavior', './components/behaviors/target_tracking', './components/behaviors/gun_behavior', './components/behaviors/missile_behavior', './components/picker', './components/path', './components/particles/sparks', './services/graphics/graphics_service', './services/graphics/three_graphics_service', './services/pathfinding', './helpers/loader'], function(Game, Entity, Component, SceneComponent, Visual, Camera, DirectionalLight, RotateBehavior, MoveBehavior, TargetTrackingBehavior, GunBehavior, MissileBehavior, Picker, PathComponent, Sparks, Graphics, ThreeGraphicsService, PathFinding, Loader) {
  var Threeder;
  Threeder = {
    REVISION: '0.0.1',
    Game: Game,
    Entity: Entity,
    Component: Component,
    Visual: Visual,
    Graphics: Graphics,
    SceneComponent: SceneComponent,
    Camera: Camera,
    ThreeGraphicsService: ThreeGraphicsService,
    DirectionalLight: DirectionalLight,
    RotateBehavior: RotateBehavior,
    MoveBehavior: MoveBehavior,
    TargetTrackingBehavior: TargetTrackingBehavior,
    GunBehavior: GunBehavior,
    MissileBehavior: MissileBehavior,
    Picker: Picker,
    Sparks: Sparks,
    Loader: Loader,
    PathFinding: PathFinding,
    PathComponent: PathComponent
  };
  window.Threeder = Threeder;
  return Threeder;
});
