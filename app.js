const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const keys = require('./config/keys');
const methodOverride = require('method-override')
const { truncate, stripTags, formatDate, select, editIcon } = require('./helpers/hbs');

//load models
require('./models/User');
require('./models/Story');

//passport config
require('./config/passport')(passport);

//load routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//map global promise
mongoose.Promise = global.Promise;

//mongoose connect
mongoose.connect(keys.mongoURI)
	.then(() => console.log('MongoDb connected'))
	.catch(err => console.log(err))

//init app
const app = express();

//parse middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//override middleware
app.use(methodOverride('_method'));

//handlebars middleware
app.engine('handlebars', exphbs({
	helpers: {
		truncate: truncate,
		stripTags: stripTags,
		formatDate: formatDate,
		select: select,
		editIcon: editIcon
	},
	defaultLayout: 'main'
}));

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
	res.locals.user = req.user || null;
	next();
})

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//use routes
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
})