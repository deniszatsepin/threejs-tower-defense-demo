define [
  './time',
  './input',
  './tween',
  './events',
  './graphics/three_graphics_service',
  './pathfinding'],
(Time, Input, TweenService, EventService, ThreeGraphicsService, PathFindingService) ->

  class Services

    @_serviceMap:
      time:
        object: Time
      input:
        object: Input
      tween:
        object: TweenService
      events:
        object: EventService
      graphics:
        object: ThreeGraphicsService
      pathfinding:
        object: PathFindingService

    @_serviceInstances: {}

    @create: (serviceName) ->
      serviceType = Services._serviceMap[serviceName]

      if serviceType
        prop = serviceType.property

        if Services._serviceInstances[serviceName]
          throw new Error('Cannot create two ' + serviceName + ' service instaces')
        else
          if serviceType.object
            service = new serviceType.object
            Services._serviceInstances[serviceName] = service
            return service
          else
            throw new Error('No object type supplied for creating service ' + serviceName)

      else
        throw new Error('Unknown service: ' + serviceName)

    @registerService: (serviceName, object) ->
      if Services._serviceMap[serviceName]
        throw new Error('Service ' + serviceName + ' already registered')
      else
        Services._serviceMap[serviceName] = object: object
        true