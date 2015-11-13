define(function() {
  var Time;
  return Time = (function() {
    function Time() {
      if (Time._instance) {
        throw new Error('Time singleton already exists');
      }
    }

    Time.prototype.initialize = function() {
      this.currentTime = Date.now();
      return Time._instance = this;
    };

    Time.prototype.terminate = function() {};

    Time.prototype.update = function() {
      return this.currentTime = Date.now();
    };

    Time._instance = null;

    return Time;

  })();
});
