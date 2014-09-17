var mongoose =  require('mongoose');
var bcrypt = require('bcryptjs');

//importance used to list todos 
//by how important they are to do
//with 0 being the least.

var userSchema = new mongoose.Schema({
	email: {type: String, unique: true, lowercase: true},
	password: {type: String, select: false},
	displayName: String,
	todos: [{
		text: String,
		upvotes: Number
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

userSchema.methods.incrementUpvotes = function (todo) {
	this.upvotes += 1;
	this.save(todo);
};

module.exports = mongoose.model('User', userSchema);