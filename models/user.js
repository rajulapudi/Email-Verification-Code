const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	fname: {
		type: String,
		required: true,
		maxlength: 50
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		default: false
	},
	token: {
		type: String
	}
});

module.exports = mongoose.model('Users', UserSchema, 'users_collection');
