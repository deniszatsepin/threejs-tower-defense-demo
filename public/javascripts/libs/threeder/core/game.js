define(['../services/services', '../services/graphics/graphics_service', '../helpers/pick_manager'], function(Services, Graphics, PickManager) {
  var Game;
  return Game = (function() {
    function Game(param) {
      if (Game._instance) {
        throw new Error('Game singleton already exists');
      }
      Game._instance = this;
      this.initialize(param);
    }

    Game.prototype.initialize = function(param) {
      param = param || {};
      this.running = false;
      this.tabstop = param.tabstop;
      this._services = [];
      this._entities = [];
      this.addService('time');
      this.addService('input');
      this.addOptionalServices();
      this.addService('tween');
      this.addService('events');
      this.addService('graphics');
      this.addService('pathfinding');
      return this.initServices(param);
    };

    Game.prototype.addService = function(serviceName) {
      var service;
      service = Services.create(serviceName);
      return this._services.push(service);
    };

    Game.prototype.addOptionalServices = function() {};

    Game.prototype.initServices = function(param) {
      var service, _i, _len, _ref;
      _ref = this._services;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        service = _ref[_i];
        service.initialize(param);
      }
      return true;
    };

    Game.prototype.focus = function() {
      return Graphics._instance.focus();
    };

    Game.prototype.run = function() {
      this.realizeEntities();
      this.lastFrameTime = Date.now();
      this.running = true;
      return this.runloop(0);
    };

    Game.prototype.runloop = function(time) {
      var deltat, now;
      now = Date.now();
      deltat = now - this.lastFrameTime;
      if (deltat >= Game.minFrameTime) {
        this.updateServices();
        this.lastFrameTime = now;
      }
      TWEEN.update(time);
      return requestAnimationFrame(this.runloop.bind(this));
    };

    Game.prototype.updateServices = function() {
      var service, _i, _len, _ref, _results;
      _ref = this._services;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        service = _ref[_i];
        _results.push(service.update());
      }
      return _results;
    };

    Game.prototype.updateEntities = function() {
      var entity, _i, _len, _ref, _results;
      _ref = this._entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        _results.push(entity.update());
      }
      return _results;
    };

    Game.prototype.addEntity = function(entity) {
      this._entities.push(entity);
      if (this.running) {
        return entity.realize();
      }
    };

    Game.prototype.removeEntity = function(entity) {
      var idx;
      idx = this._entities.indexOf(entity);
      if (idx !== -1) {
        return this._entities.splice(idx, 1);
      }
    };

    Game.prototype.realizeEntities = function() {
      var entity, _i, _len, _ref, _results;
      _ref = this._entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        _results.push(entity.realize());
      }
      return _results;
    };

    Game.prototype.traverse = function(cb) {
      var entity, _i, _len, _ref;
      _ref = this._entities;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        cb(entity);
      }
      return null;
    };

    Game.prototype.findTagsCallback = function(e, query, found) {
      if (e.isTagged(query)) {
        found.push(e);
      }
      return null;
    };

    Game.prototype.findEntitiesByTag = function(tag) {
      var found;
      found = [];
      this.traverse((function(e) {
        return this.findTagsCallback(e, tag, found);
      }).bind(this));
      return found;
    };

    Game.prototype.onMouseMove = function(event) {
      if (this.mouseDelegate && this.mouseDelegate.onMouseMove) {
        return this.mouseDelegate.onMouseMove(event);
      }
    };

    Game.prototype.onMouseClick = function(event) {
      if (this.mouseDelegate && this.mouseDelegate.onMouseClick) {
        return this.mouseDelegate.onMouseClick(event);
      }
    };

    Game._instance = null;

    Game.curEntityId = 0;

    Game.minFrameTime = 1;

    Game.handleMouseMove = function(event) {
      if (PickManager && PickManager.clickedObject) {
        return;
      }
      if (this._instance.onMouseMove) {
        return this._instance.onMouseMove(event);
      }
    };

    Game.handleMouseClick = function(event) {
      if (PickManager && PickManager.clickedObject) {
        return;
      }
      if (this._instance.onMouseClick) {
        return this._instance.onMouseClick(event);
      }
    };

    return Game;

  })();
});
