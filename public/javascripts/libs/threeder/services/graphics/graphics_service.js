define(function() {
  var Graphics;
  return Graphics = (function() {
    function Graphics() {
      if (Graphics._instance) {
        throw new Error('Graphics singleton already exists');
      }
      Graphics._instance = this;
    }

    Graphics._instance = null;

    return Graphics;

  })();
});
