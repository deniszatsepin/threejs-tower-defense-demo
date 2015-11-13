define(function() {
  var TweenService;
  return TweenService = (function() {
    function TweenService() {
      if (TweenService._instance) {
        throw new Error('Tween singleton already exists');
      }
    }

    TweenService.prototype.initialize = function() {
      return TweenService._instance = this;
    };

    TweenService.prototype.terminate = function() {};

    TweenService.prototype.update = function() {
      if (window.TWEEN) {
        return TWEEN.update();
      }
    };

    TweenService._instance = null;

    return TweenService;

  })();
});
