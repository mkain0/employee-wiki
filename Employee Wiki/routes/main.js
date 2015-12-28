var app = module.parent.exports.app;
var Employees = require('../models/employees.js')

app.get('/list', function(req, res){
    var msg = req.flash('message'); // Read the flash message
    Employees.find({}, function(err, docs){
        // res.render('list', { title: 'List', employees: docs});
        res.render('list', { title: 'List', persons: docs, flashmsg: msg}); // Pass Flash Message to the view
    });
});

app.get('/employees/new', function(req, res){
    req.flash('message', 'You have successfully created your Employee'); // Save the flash message
    res.render('new', { title: 'New'});
});

app.post('/employees/new', function(req, res){
    console.log(req.body);
   var e = new Employees({ firtsName: req.body.firtsName, 
   	lastName: req.body.lastName, email: req.body.email, 
   	password: req.body.password });
   e.save(function(err, doc){
          if(!err){
            res.redirect('/list');
       } else {
           res.end(err);    
       }    
   });
 });

app.get('/employees/delete/:id', function(req, res){
    Employees.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.redirect('/list');
        } else {
            res.end(err);    
        }    
    });
});

app.get('/employees/edit/:id', function(req, res){
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Edit', employee: doc});
        } else {
            res.end(err);    
        }    
    });
});

app.post('/employees/edit/:id', function(req, res){
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            doc.firtsName = req.body.firtsName; 
            doc.lastName = req.body.lastName;
            doc.email = req.body.email;
            doc.save(function(err, doc){
                if(!err){
                    res.redirect('/list');
                } else {
                    res.end(err);    
                }    
            }); 
        } else {
            res.end(err);    
        }    
    });
});