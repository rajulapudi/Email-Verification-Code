const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const logger = require('morgan');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');

const db = require('./dbConnect');
const User = require('./models/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

let transporter = nodemailer.createTransport({
	host: 'mail.inaxfrsi.com',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: 'iam@inaxfrsi.com', // generated ethereal user
		pass: '.6ad7fgrtghrD7PYZzD' // generated ethereal password
	}
});

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/', (req, res) => {
	req.checkBody('fname', 'Invalid ...').notEmpty();
	req.checkBody('email', 'Invalid ...').isEmail();
	req.checkBody('password', 'Invalid ...').equals(req.body.password2);

	var errors = req.validationErrors();
	if (errors) {
		res.json(errors);
	} else {
		const token = randomString.generate();
		const user = new User(req.body);
		user.token = token;
		user.save();
		transporter
			.sendMail({
				from: '"Contact" <rayan3188@gmail.com>',
				to: req.body.email,
				subject: 'Pls Verify your Email',
				text: 'Pls Verify your Email',
				html: `<a href="http://localhost:3000/verify/${
					user.token
				}">Click to Verify</a>`
			})
			.then(info => {
				console.log('Message sent: %s', info.messageId);
			})
			.catch(err => {
				console.log(err);
			});
		res.render('register', { user });
	}
});
app.get('/verify/:token', (req, res) => {
	User.findOneAndUpdate(
		{ token: req.params.token },
		{ $set: { active: true } },
		(err, user) => {
			if (!user) {
				res.send('User not Found');
			} else {
				res.send('Registration successful');
			}
		}
	);
});

app.delete('/:id', (req, res) => {
	User.remove({ token: req.params.id }, err => {
		if (err) throw err;
		res.send('User removed successfully');
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
