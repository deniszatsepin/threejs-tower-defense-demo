var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['ee', '../components/transform'], function(EventEmitter, Transform) {

  /**
    * Main object in engine. All in Threeder should be entities. For example lights, player, enemies.
    *
    * h3 Examples:
    *   class Player extends Entity
    *
    * @class  Entity
    * @param  {Object}  entity config
   */
  var Entity;
  return Entity = (function(_super) {
    __extends(Entity, _super);

    function Entity(param) {
      param = param || {};
      this._id = Entity.nextId++;

      /**
        * @name {Array.<Component>}
        * @private
       */
      this._components = [];

      /**
        * @name {Array.<Entity>}
        * @private
       */
      this._children = [];

      /**
        * @type {Entity}
        * @private
       */
      this._parent = null;
      this.name = param.name || 'entity' + this._id;
      this._tags = [];
      this._realized = false;
      if (param.autoCreateTransform !== false) {
        this.addComponent(new Transform(param));
      }
    }

    Entity.prototype.getId = function() {
      return this._id;
    };

    Entity.prototype.isOrphan = function() {
      return !this._parent;
    };

    Entity.prototype.setParent = function(parent) {
      return this._parent = parent;
    };

    Entity.prototype.addChild = function(child) {
      if (!child) {
        throw new Error('Cannot add a null child');
      }
      if (!child.isOrphan()) {
        throw new Error('Entity is already attached to something');
      }
      if (this._children.indexOf(child) === -1) {
        this._children.push(child);
        child._parent = this;
        if (this._realized && !child._realized) {
          return child.realize();
        }
      } else {
        return typeof console.warn === "function" ? console.warn('[Threeder] Entity ', child, ' already attached to ', this) : void 0;
      }
    };

    Entity.prototype.removeChild = function(child) {
      var idx;
      idx = this._children.indexOf(child);
      if (idx >= 0) {
        this._children.splice(idx, 1);
        child.removeAllComponents();
        return child._parent = null;
      }
    };

    Entity.prototype.getChildByIndex = function(index) {
      if (index >= this._children.length) {
        return null;
      } else {
        return this._children[index];
      }
    };

    Entity.prototype.addComponent = function(component) {
      var proto, t;
      if (!component) {
        throw new Error('Cannot add a null component');
      }
      if (component.isAttached()) {
        throw new Error('Component is already attached to an Entity');
      }
      proto = Object.getPrototypeOf(component);
      if (proto._componentProperty) {
        if (this[proto._componentProperty]) {
          t = proto._componentPropertyType;
          console.warn('Entity already has a ' + t + ' component');
          return;
        }
        this[proto._componentProperty] = component;
      }
      if (proto._componentCategory) {
        if (!this[proto._componentCategory]) {
          this[proto._componentCategory] = [];
        }
        this[proto._componentCategory].push(component);
      }
      if (this._components.indexOf(component) === -1) {
        this._components.push(component);
        component.attach(this);
      } else {
        if (typeof console.warn === "function") {
          console.warn('[Threeder] Component ', component, ' already attached to ', this);
        }
      }
      if (this._realized && !component._realized) {
        return component.realize();
      }
    };

    Entity.prototype.removeComponent = function(component) {
      var cat, i, idx, proto;
      if (!component) {
        return;
      }
      idx = this._components.indexOf(component);
      if (idx >= 0) {
        if (typeof component.removeFromScene === "function") {
          component.removeFromScene();
        }
        this._components.splice(idx, 1);
        this._components[idx].detach();
      }
      proto = Object.getPrototypeOf(component);
      if (proto._componentProperty) {
        this[proto._componentProperty] = null;
      }
      if (proto._componentCategory) {
        if (this[proto._componentCategory]) {
          cat = this[proto._componentCategory];
          i = cat.indexOf(component);
          if (i >= 0) {
            return cat.splice(i, 1);
          }
        }
      }
    };

    Entity.prototype.removeAllComponents = function() {
      var component, _i, _len, _ref;
      _ref = this._components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        if (typeof component.removeFromScene === "function") {
          component.removeFromScene();
        }
        component.detach();
      }
      return this._components = [];
    };

    Entity.prototype.getFirstComponentByType = function(type) {
      var component, _i, _len, _ref;
      _ref = this._components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        if (component instanceof type) {
          return component;
        }
      }
      return null;
    };

    Entity.prototype.getComponentsByType = function(type) {
      var component, components, _i, _len, _ref;
      components = [];
      _ref = this._components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        if (component instanceof type) {
          components.push(component);
        }
      }
      return components;
    };

    Entity.prototype.addTag = function(tag) {
      if (this._tags.indexOf(tag < 0)) {
        return this._tags.push(tag);
      } else {
        return console.warn('Already tagged: ', tag);
      }
    };

    Entity.prototype.removeTag = function(tag) {
      var idx;
      idx = this._tags.indexOf(tag);
      if (idx >= 0) {
        return this._tags.splice(idx, 1);
      }
    };

    Entity.prototype.isTagged = function(tag) {
      if (this._tags.indexOf(tag) >= 0) {
        return true;
      } else {
        return false;
      }
    };

    Entity.prototype.update = function(delta) {
      var child, component, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this._components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        if (typeof component.update === "function") {
          component.update(delta);
        }
      }
      _ref1 = this._children;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        child = _ref1[_j];
        if (typeof child.update === "function") {
          child.update(delta);
        }
      }
      return null;
    };

    Entity.prototype.realize = function() {
      this._realizeComponents();
      this._realizeChildren();
      return this._realized = true;
    };

    Entity.prototype._realizeComponents = function() {
      var component, _i, _len, _ref;
      _ref = this._components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        component.realize();
      }
      return null;
    };

    Entity.prototype._realizeChildren = function() {
      var child, _i, _len, _ref;
      _ref = this._children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.realize();
      }
      return null;
    };

    Entity.prototype.traverse = function(cb) {
      var child, _i, _len, _ref, _results;
      cb(this);
      _ref = this._children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.traverse(cb));
      }
      return _results;
    };

    Entity.prototype.findCallback = function(n, query, found) {
      var component, components, match, _i, _len, _results;
      if (typeof query === 'string') {
        if (n.name === query) {
          return found.push(n);
        }
      } else if (query instanceof RegExp) {
        match = n.name.match(query);
        if (match && match.length) {
          return found.push(n);
        }
      } else if (query instanceof Function) {
        if (n instanceof query) {
          return found.push(n);
        } else {
          components = n.getComponents(query);
          _results = [];
          for (_i = 0, _len = components.length; _i < _len; _i++) {
            component = components[_i];
            _results.push(found.push(component));
          }
          return _results;
        }
      }
    };

    Entity.prototype.findQueryCallback = function(n, query, found) {
      var add, key, value;
      add = true;
      for (key in query) {
        value = query[key];
        if (n[key] !== value) {
          add = false;
          break;
        }
      }
      if (add) {
        return found.push(n);
      }
    };

    Entity.prototype.findNode = function(str) {
      var found;
      found = [];
      this.traverse((function(e) {
        return this.findCallback(e, str, found);
      }).bind(this));
      return found[0];
    };

    Entity.prototype.findNodes = function(str) {
      var found;
      found = [];
      this.traverse((function(e) {
        return this.findCallback(e, str, found);
      }).bind(this));
      return found;
    };

    Entity.prototype.findByQuery = function(query) {
      var found;
      found = [];
      this.traverse((function(e) {
        return this.findQueryCallback(e, query, found);
      }).bind(this));
      return found;
    };

    Entity.prototype.map = function(query, callback) {
      var found, item, _i, _len, _results;
      found = this.findNodes(query);
      _results = [];
      for (_i = 0, _len = found.length; _i < _len; _i++) {
        item = found[_i];
        _results.push(callback(item));
      }
      return _results;
    };

    Entity.nextId = 0;

    return Entity;

  })(EventEmitter);
});
