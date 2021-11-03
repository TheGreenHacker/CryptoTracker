# CryptoTracker
Webpage that tracks the current prices, updated every minute, in US dollars of Bitcoin and Ethereum from two exchanges, Coinbase and Gemini, using their public REST API's. 

### Build
This application was built using Node JS, EJS, Bootstrap, and CSS. So no compilation is necessary.

### Run
To run locally:
$ node app.js 

For deploying on Heroku, as I've done, follow these instructions (assumes you have Heroku installed and are logged in):
$ git clone https://github.com/TheGreenHacker/CryptoTracker
$ cd CryptoTracker
$ heroku create
$ git push heroku main
$ heroku open

The live link is: https://stark-crag-36910.herokuapp.com/

### Questionnaire
1. I did not make any suboptimal choices or take any shortcuts for my implementation.
2. The frontend might have been overdesigned a bit. I wanted to be as creative as I could to style the UI and perhaps went a little overboard with creating a color contrast in each section of the page. The design could have been simplified by using the same shade of purple for the background color and same shade of golden yellow for the text color but I wanted to explore my options.
3. Currently, my application is running on only one dyno, a Heroku lightweigh container that runs the command in Procfile to start the application. To scale my solution to 100 users/seconnd traffic, I can migrate my app to a professional dyno and from there, scale it to execute more dynos, using a command like $ heroku ps:scale web=100.
4. If I had more time, I would build the frontend using React once I've had enough time to master the fundamentals of this library. I would also deploy this application on AWS. 
