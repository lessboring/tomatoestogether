class Engine
    constructor: ->
        @dispatcher = {}

    addHandlers: (handlers) ->
        for name, fn of handlers
            @dispatcher[name] = fn

    dispatch: (event) ->
