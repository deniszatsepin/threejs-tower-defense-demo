var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['ee'], function(EventEmitter) {
  var Component;
  return Component = (function(_super) {
    __extends(Component, _super);

    function Component() {
      Component.__super__.constructor.apply(this, arguments);
      this._entity = null;
      this._realized = false;
    }

    Component.prototype.isAttached = function() {
      return !!this._entity;
    };

    Component.prototype.attach = function(entity) {
      return this._entity = entity;
    };

    Component.prototype.detach = function() {
      return this._entity = null;
    };

    Component.prototype.getEntity = function() {
      return this._entity;
    };

    Component.prototype.realize = function() {
      return this._realized = true;
    };

    Component.prototype.update = function() {};

    return Component;

  })(EventEmitter);
});
