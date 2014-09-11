var mongoose =  require('mongoose');
var bcrypt = require('bcryptjs');

// var todoSchema = new mongoose.Schema({
// 	text: String,
// 	importance: Number
// });

var userSchema = new mongoose.Schema({
	email: {type: String, unique: true, lowercase: true},
	password: {type: String, select: false},
	displayName: String,
	todos: [{
		text: String,
		importance: Number
	}]
});

userSchema.pre('save', function (next) {
	var user = this;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(user.password, salt, function (err, hash) {
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function (password, done) {
	bcrypt.compare(password,this.password,function (err, isMatch) {
		done(err, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);