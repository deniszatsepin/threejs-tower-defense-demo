define(function() {
  var Keyboard;
  return Keyboard = (function() {
    function Keyboard() {
      if (Keyboard._instance) {
        throw new Exception('Keyboard already exists');
      }
      Keyboard._instance = this;
    }

    Keyboard.prototype.onKeyDown = function() {};

    Keyboard.prototype.onKeyUp = function() {};

    Keyboard.prototype.onKeyPress = function() {};

    Keyboard._instance = null;

    Keyboard.KEY_LEFT = 37;

    Keyboard.KEY_UP = 38;

    Keyboard.KEY_RIGHT = 39;

    Keyboard.KEY_DOWN = 40;

    return Keyboard;

  })();
});
