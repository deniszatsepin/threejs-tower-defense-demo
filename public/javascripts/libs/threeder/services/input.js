define(['../input/mouse', '../input/keyboard'], function(Mouse, Keyboard) {
  var Input;
  return Input = (function() {
    function Input() {
      if (Input._instance) {
        throw new Error('Input singleton already exists');
      }
    }

    Input.prototype.initialize = function() {
      this.mouse = new Mouse();
      this.keyboard = new Keyboard();
      return Input._instance = this;
    };

    Input.prototype.terminate = function() {};

    Input.prototype.update = function() {};

    Input._instance = null;

    return Input;

  })();
});
