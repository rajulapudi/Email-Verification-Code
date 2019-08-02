const mongoose = require('mongoose');


module.exports = mongoose.connect(
	'mongodb://localhost:27017/emailVerify',
	{
		useNewUrlParser: true,
		useCreateIndex: true
	},
	err => {
		if (!err) {
			console.log('MongoDB Connection Succeeded at default PORT:27017.');
		} else {
			console.log('Error in DB connection: ' + err);
		}
	}
);
