module.exports =
    saveCompletedTomato: (tomato) ->
        storage = JSON.parse(localStorage.getItem('tomatoestogether'))
        if not storage.tomatoes?
            storage.tomatoes = []

        storage.tomatoes.append(tomato)

        localStorage.setItem(JSON.stringify(storage))
