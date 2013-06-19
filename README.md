cheatsheet.js
=============

Cheat sheet rendering library

Usage:
------

The cheat sheet is rendered from a JSON object that contains sections, each
section contains line items. The steps for rendering the cheat sheet is:
  
  * Create a cheat sheet from the config
     `var sheet = new CheatSheet(config);`

  * Call the render method to render the cheat sheet in an element
  	 `sheet.render(element);`

The default stylesheet can be found in (templates/default.css)[templates/default.css]


Developing:
-----------

  * `npm install` will install the toolchain which is gruntjs
  * `grunt watch` should be run in the terminal to have tests run as files are saved
  * `grunt` will perform all the actions and build the test sheets
  