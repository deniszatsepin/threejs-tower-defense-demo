define(function() {
  var EventService;
  return EventService = (function() {
    function EventService() {
      if (EventService._instance) {
        throw new Error('EventService singleton already exists');
      }
    }

    EventService.prototype.initialize = function() {};

    EventService.prototype.terminate = function() {};

    EventService.prototype.update = function() {
      EventService._eventsPending = true;
      while (EventService._eventsPending) {
        EventService._eventsPending = false;
        Threeder.Game._instance.updateEntities();
      }
      return true;
    };

    EventService._eventsPending = false;

    EventService._instance = null;

    return EventService;

  })();
});
