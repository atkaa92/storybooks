const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const keys = require('./config/keys');

//load models
require('./models/User');

//passport config
require('./config/passport')(passport);

//load routes
const auth = require('./routes/auth');
const index = require('./routes/index');

//map global promise
mongoose.Promise = global.Promise;

//mongoose connect
mongoose.connect(keys.mongoURI)
				.then( () => console.log('MongoDb connected'))
				.catch(err => console.log(err))

//init app
const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

//set view engine
app.set('view engine', 'handlebars');

//cookie parser middleware
app.use(cookieParser())

//session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set globals
app.use((req, res, next) => {
	res.locals.user = req.user || null ;
	next();
})

//use routes
app.use('/auth', auth);
app.use('/', index);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
})