class TomatoManager
    constructor: ->
        @tomatoes = {}

    get: (id) ->
        @tomatoes[id]

    all: ->
        tomato for id, tomato in @tomatoes



class Tomato
    constructor: (@id=null, @task='', @finished=null) ->
        @objects = new TomatoManager()


class UserManager
    me: ->


class User
    constructor: (@id=null, @username='guest', @color='000000') ->

    tomatoes: ->
        TomatoManager.fetch()


class Session
    constructor: (@user=null) ->
