const express = require('express');


// EXPRESS CONFIGURATION
const app = express();

// ESTABLISH PORT - Set up for either an environment (like Heroku) deployment or locals server port
const PORT = process.env.PORT || 8080;

// MIDDLEWARE - Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); //To read CSS file


// ROUTERS
require('./routes/api.js')(app);
require('./routes/html.js')(app);



// LISTENER - starts our server
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});