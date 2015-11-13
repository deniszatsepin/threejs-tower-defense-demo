define(function() {
  var Mouse;
  return Mouse = (function() {
    function Mouse() {
      if (Mouse._instance) {
        throw new Exception('Mouse already exists');
      }
      this.state = {
        x: Mouse.NO_POSITION,
        y: Mouse.NO_POSITION,
        buttons: {
          left: false,
          middle: false,
          right: false
        },
        scroll: 0
      };
      Mouse._instance = this;
    }

    Mouse.prototype.onMouseMove = function(event) {
      this.state.x = event.elementX;
      return this.state.y = event.elementY;
    };

    Mouse.prototype.onMouseDown = function(event) {
      this.state.x = event.elementX;
      this.state.y = event.elementY;
      return this.state.buttons.left = true;
    };

    Mouse.prototype.onMouseUp = function(event) {
      this.state.x = event.elementX;
      this.state.y = event.elementY;
      return this.state.buttons.left = false;
    };

    Mouse.prototype.onMouseClick = function(event) {
      this.state.x = event.elementX;
      this.state.y = event.elementY;
      return this.state.buttons.left = false;
    };

    Mouse.prototype.onMouseDoubleClick = function(event) {
      this.state.x = event.elementX;
      this.state.y = event.elementY;
      return this.state.buttons.left = false;
    };

    Mouse.prototype.onMouseScroll = function(event, delta) {
      return this.state.scroll = 0;
    };

    Mouse.prototype.getState = function() {
      return this.state;
    };

    Mouse._instance = null;

    Mouse.NO_POSITION = Number.MIN_VALUE;

    return Mouse;

  })();
});
