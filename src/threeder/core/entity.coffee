define ['ee', '../components/transform'], (EventEmitter, Transform) ->
  ###*
    * Main object in engine. All in Threeder should be entities. For example lights, player, enemies.
    *
    * h3 Examples:
    *   class Player extends Entity
    *
    * @class  Entity
    * @param  {Object}  entity config
  ###
  class Entity extends EventEmitter
    constructor: (param) ->
      param = param or {}

      @_id = Entity.nextId++

      ###*
        * @name {Array.<Component>}
        * @private
      ###
      @_components = []

      ###*
        * @name {Array.<Entity>}
        * @private
      ###
      @_children = []

      ###*
        * @type {Entity}
        * @private
      ###
      @_parent = null

      @name = param.name or 'entity' + @_id

      @_tags = []

      @_realized = false

      if param.autoCreateTransform != false
        @addComponent(new Transform(param))

    getId: ->
      @_id

    isOrphan: ->
      return !@_parent

    setParent: (parent) ->
      @_parent = parent

    addChild: (child) ->
      throw new Error 'Cannot add a null child' if not child
      throw new Error 'Entity is already attached to something' if not child.isOrphan()

      if @_children.indexOf(child) == -1
        @_children.push child
        child._parent = @
        child.realize() if @_realized and not child._realized
      else
        console.warn?('[Threeder] Entity ', child, ' already attached to ', @)

    removeChild: (child) ->
      idx = @_children.indexOf child
      if idx >= 0
        @_children.splice idx, 1
        child.removeAllComponents()
        child._parent = null

    getChildByIndex: (index) ->
      if index >= @_children.length
        null
      else
        @_children[index]

    addComponent: (component) ->
      throw new Error 'Cannot add a null component' if not component
      throw new Error 'Component is already attached to an Entity' if component.isAttached()
      proto = Object.getPrototypeOf component

      if proto._componentProperty
        if @[proto._componentProperty]
          t = proto._componentPropertyType
          console.warn 'Entity already has a ' + t + ' component'
          return
        @[proto._componentProperty] = component

      if proto._componentCategory
        if not @[proto._componentCategory]
          @[proto._componentCategory] = []
        @[proto._componentCategory].push component

      if @_components.indexOf(component) == -1
        @_components.push component
        component.attach(@)
      else
        console.warn?('[Threeder] Component ', component, ' already attached to ', @)

      component.realize() if @_realized and not component._realized

    removeComponent: (component) ->
      return if not component

      idx = @_components.indexOf component
      if idx >= 0
        component.removeFromScene?()
        @_components.splice idx, 1
        @_components[idx].detach()


      proto = Object.getPrototypeOf component

      if proto._componentProperty
        @[proto._componentProperty] = null

      if proto._componentCategory
        if @[proto._componentCategory]
          cat = @[proto._componentCategory]
          i = cat.indexOf component
          cat.splice(i, 1) if i >= 0

    removeAllComponents: ->
      for component in @_components
        component.removeFromScene?()
        component.detach()

      @_components = []
      #TODO: we should remove links to components from @[componentProperty] and @[componentCategory]

    getFirstComponentByType: (type) ->
      for component in @_components
        if component instanceof type
          return component
      null

    getComponentsByType: (type) ->
      components = []
      for component in @_components
        if component instanceof type
          components.push component
      components

    addTag: (tag) ->
      if @_tags.indexOf tag < 0
        @_tags.push tag
      else
        console.warn 'Already tagged: ', tag

    removeTag: (tag) ->
      idx = @_tags.indexOf tag
      if idx >= 0
        @_tags.splice idx, 1

    isTagged: (tag) ->
      if @_tags.indexOf(tag) >= 0
        true
      else
        false

    update: (delta) ->
      for component in @_components
        component.update?(delta)

      for child in @_children
        child.update?(delta)

      null

    realize: ->
      @_realizeComponents()
      @_realizeChildren()
      @_realized = true

    _realizeComponents: ->
      for component in @_components
        component.realize()
      null

    _realizeChildren: ->
      for child in @_children
        child.realize()
      null

    traverse: (cb) ->
      cb @
      for child in @_children
        child.traverse cb

    findCallback: (n, query, found) ->
      if typeof query == 'string'
        if n.name == query
          found.push n

      else if query instanceof RegExp
        match = n.name.match query
        if match and match.length
          found.push n

      else if query instanceof Function
        if n instanceof query
          found.push n
        else
          components = n.getComponents query
          for component in components
            found.push component

    findQueryCallback: (n, query, found) ->
      add = true
      for key, value of query
        if n[key] isnt value
          add = false
          break

      if add
        found.push n

    findNode: (str) ->
      found = []
      @traverse ((e) ->
        @findCallback e, str, found
      ).bind @
      found[0]

    findNodes: (str) ->
      found = []
      @traverse ((e) ->
        @findCallback e, str, found
      ).bind @
      found

    findByQuery: (query) ->
      found = []
      @traverse ((e) ->
        @findQueryCallback e, query, found
      ).bind @
      found

    map: (query, callback) ->
      found = @findNodes query

      for item in found
        callback item



    @nextId: 0