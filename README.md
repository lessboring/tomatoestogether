# Tomatoes Together

A site for doing work together.

To hack on the project, first install NodeJS. Then you'll want to clone the project like so: 
    
    git clone https://github.com/dcolgan/tomatoestogether.git

Then you'll want to cd into the project directory and run this command to install the node modules:

    npm install

#### Automatic Compilation

To automatically compile the main coffeescript files use: 

    brunch watch

To automatically compile and run the project use this command in the base directory: 

    nodemon server.coffee

#### Using with Vim

Due to an unknown bug with Vim and auto compilation, add this to your .vimrc:

    set nowritebackup

#### Contributing

You can contribute to this project by first cloning the main repository. Once you've made changes or added features, you'll want to fork the project on github, then commit and push the project to your fork. After pushing, you'll want to submit a pull request to the main project.

#### Additional information

This project makes use of [Node.js](http://nodejs.org/), [Socket.io](http://socket.io/), [Brunch.io](http://brunch.io/), and [Knockout.js](http://knockoutjs.com/)

## Planned features (you can help to add these)

* Show currently connected users!
* Don't allow multiple people to have the same username - add an underscore somehow if that name is taken
* ✔ Start discarding message history after a certain point (ChillyFlashER)

	Now it only does it on the server, not the client. Should it also do it on the client?

* ✔ Rate limit messages (JordanFitz)
* Unit tests! LOTS of unit tests.
* The app/main.coffee file is kind of a mess
* ✔ Show the chat during a tomato, just don't allow chatting? (ChillyFlashER)

	Should you be allowed to chat if you haven't joined the tomato?

* This README needs expanded, explain better how to set up the project, add windows/mac/linux instructions
* Some sort of build automation like Jake?
* The top header on the page could be nicened up
* /node_modules should be removed from the repo, as well as /public

If you make a contribution, send me a pull request and add yourself to app/assets/humans.txt!