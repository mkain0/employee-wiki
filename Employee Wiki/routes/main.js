var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var Employees = require('../models/employees.js');
var Admins = require('../models/admins.js');

var adminAuth = function(req, res, next){
    //authorize role
    if(typeof req.user != "undefined"){
        next();
    }else{
        //Not authorized redirect
        res.redirect('/');
    }
}

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.get('/login', function(req, res){
    res.render('login', { title: 'Login'});
});

app.post('/login', passport.authenticate('AdminLogin', 
    { successRedirect: '/panel/employees',
      failureRedirect: '/login',
      failureFlash: true }));

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/panel/employees', adminAuth, function(req, res){
    var msg = req.flash('message'); // Read the flash message
    Employees.find({}, function(err, docs){
        // res.render('list', { title: 'List', employees: docs});
        res.render('list', { title: 'Employee List', employees: docs, flashmsg: msg}); // Pass Flash Message to the view
    });
});

app.get('/panel/employees/new', adminAuth, function(req, res){
    req.flash('message', 'You have successfully created your Employee'); // Save the flash message
    res.render('new', { title: 'New Employee'});
});

app.post('/panel/employees/new', function(req, res){
   console.log(req.body);
   var e = new Employees({ firtsName: req.body.firtsName, 
   lastName: req.body.lastName, email: req.body.email, 
   password: req.body.password });
   e.save(function(err, doc){
          if(!err){
            res.redirect('/panel/employees');
       } else {
           res.end(err);    
       }    
   });
 });

app.get('/panel/employees/delete/:id', adminAuth, function(req, res){
    req.flash('message', 'You have successfully deleted your Employee'); // Save the flash message
    Employees.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.redirect('/panel/employees');
        } else {
            res.end(err);    
        }    
    });
});

app.get('/panel/employees/edit/:id', adminAuth, function(req, res){
    req.flash('message', 'You have successfully edited your Employee'); // Save the flash message
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Edit Employee', employee: doc});
        } else {
            res.end(err);    
        }    
    });
});

app.post('/panel/employees/edit/:id', function(req, res){
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            doc.firtsName = req.body.firtsName; 
            doc.lastName = req.body.lastName;
            doc.email = req.body.email;
            doc.save(function(err, doc){
                if(!err){
                    res.redirect('/panel/employees');
                } else {
                    res.end(err);    
                }    
            }); 
        } else {
            res.end(err);    
        }    
    });
});

app.get('/panel/employees/search/:keyword', function(req, res){
    Employees.find({ $or: [ { firtsName: new RegExp(".*"+req.params.keyword+".*", 'gi') }, 
        { lastName: new RegExp(".*"+req.params.keyword+".*", 'gi') } ] }) // Global search, ignore case
        .select('-password')
        .exec( function(err, docs){
           res.json(docs); 
    });
    
});