This micro service does anything from numerical calculation to symbolic math parsing. Most of the operations are based on Newton API (https://github.com/aunyks/newton-api).

How does it work?
Send a GET request to newton with a url-encoded math expression and your preferred operation.
Get back a JSON response with your problem solved.

How to run the app
open file in VSCode and run "npm i" on the console to download the modules
on the console, run "nodemon index.js"
go to http://localhost:3000 to try the app
