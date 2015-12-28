var Employee = require('../models/employees');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Employee');

var e = new Employee({ firtsName: "Juan", lastName: "Perez", 
	email: "jperez@gmail.com", password: "123456" });
e.save(function(err, doc){
    console.log(err, doc);    
});


