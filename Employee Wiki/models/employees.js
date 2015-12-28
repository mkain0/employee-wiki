var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
    firtsName: String,
	lastName: String,
    email: String,
    password: String
});

var employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = employeeModel;