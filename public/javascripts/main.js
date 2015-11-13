
requirejs.config({
    baseUrl: 'javascripts/libs',
    shim: {
        'three': {exports: 'THREE'},
        'ee': {exports: 'EventEmitter'},
        'tween': {exports: 'TWEEN'},
        'sparks': {exports: 'SPARKS'},
        'threexSparks': {exports: 'THREEx'}
    },
    paths: {
        app: '../app',
        three: 'threejs/build/three',
	    gltfLoader: 'gltf/glTFLoader',
        colladaLoader: 'threejs/ColladaLoader',
        ee: 'eventemitter2/lib/eventemitter2',
        tween: 'tweenjs/build/tween.min',
        sparks: 'sparksjs/Sparks',
        threexSparks: 'threex/threex.sparks'
    }
});


requirejs(['app/game'], function(Game) {
    Game.init();
    Game.start();
});