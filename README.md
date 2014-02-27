# Tomatoes Together

A site for doing work together.

To hack on the project, first install NodeJS and clone the project and cd into the directory do:

    npm install

Then do:

    brunch watch

The coffeescript files will be automatically compiled when changed.  Due to a bug in something, if you are using Vim, add this to your .vimrc:

    set nowritebackup

This project makes use of [Node.js](http://nodejs.org/), [Socket.io](http://socket.io/), [Brunch.io](http://brunch.io/), [Knockout.js](http://knockoutjs.com/)

## Currently Needed Features and Such

* Show currently connected users!
* Don't allow multiple people to have the same username - add an underscore somehow if that name is taken
* Start discarding message history after a certain point (ChillyFlashER)

	Now it only does it on the server, not the client. Should it also do it on the client?

* Rate limit messages (JordanFitz?)
* Unit tests! LOTS of unit tests.
* The app/main.coffee file is kind of a mess
* Show the chat during a tomato, just don't allow chatting? (ChillyFlashER)

	Should you be allowed to chat if you haven't joined the tomato?

* This README needs expanded, explain better how to set up the project, add windows/mac/linux instructions
* Some sort of build automation like Jake?
* The top header on the page could be nicened up
* /node_modules should be removed from the repo, as well as /public

If you make a contribution, send me a pull request and add yourself to app/assets/humans.txt!
