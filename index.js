var express= require("express");
var app= express();
var passport= require("passport");
var LocalStrategy= require("passport-local");
var socket= require("socket.io");
var User= require("./models/user");
var Chat= require("./models/chat");
var bodyParser=require("body-parser");
var mongoose= require("mongoose");
var flash= require("connect-flash");
var methodOverride= require("method-override");
// const users = require("../../dynamic-price-master/utils/users");



mongoose.connect("mongodb://localhost/chat_demo");
var server= app.listen(4000, function(){
        console.log("server is running on 4000");
})
//static file
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret:" kapil is the person which is going to a amazing personality!",
	resave: false,
	saveUninitialize: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(function(req, res, next){
// 	res.locals.currentUser= req.user;
// 	res.locals.error= req.flash("error");
// 	res.locals.success= req.flash("success");
// 	//console.log(req.user);
// 	next();
// });



//handling routes
app.get("/",function(req,res){
        res.render("login")
});
app.post("/login",passport.authenticate("local",
	{
		successRedirect: "/temp",
		failureRedirect: "/"
	}), function(req, res){
	
});
app.get("/temp",function(req,res){
        res.redirect("/"+req.user._id+"/chat");
});
app.get("/register",function(req,res){
        res.render("register.ejs");
});
app.post("/register",function(req,res){
        var newUser= new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			return res.redirect("/register");
		}
		// req.flash("success", "Welcome to Yelpcamp "+user.username);
		passport.authenticate("local")(req, res, function(){
			res.redirect("/"+req.user._id+"/chat");
		});
		
	});
});
app.get("/:id/chat",function(req,res){
       // console.log(req.user._id)
        User.findById(req.params.id,function(err,user){
                if(err){
                        console.log(err);
        }else{
               // console.log(user.username);
                res.render("chat",{user: JSON.stringify(user), username:user.username});
             //  res.send('chat forum')
        }
        });
       
});
//socket setup
var io= socket(server);

io.on('connection', function(socket){
        console.log("new connection is made ", socket.id)
        // var url =window.location.href;
        // var idx = url.indexOf("4000/");
        // var idx2 = url.indexOf("/chat");
        // var hash = idx != -1 ? url.substring(idx+5, idx2) : "";
        // upload();
        socket.on('chat',function(data){
             //   console.log("kamli===========")
              //  console.log(data.id);
                // var newChat= new Chat({username: data.name});
               User.findById(data.id,function(err,user){
                       if(err){
                               console.log("something is happened!!")
                       }else{
                                var newchat={username:"kapil",chat:data.message}        
                                Chat.create(newchat,function(err,newchat){
                                        if(err){
                                                console.log("something is happened!!");

                                        }else{
                                                user.chat.push(newchat);
                                                user.save();
                                                io.sockets.emit('chat',data);
                                        }
                                });
                       }
                       /// console.log(user);
                       
               });
                // Chat.find({username:data.name},function(err,user){
                //         console.log(user)
                //         if(user==null){
                //                 console.log("NULL");
                //                 var newChat= new Chat({username: data.name});
                //                 var temp={
                //                         username:"Bot",
                //                         chat:data.message
                //                 }
                //                 newChat.chat.push(temp);
                //                 newChat.save();
                //         }else{
                //                 console.log(user)
                //                 var temp={
                //                         username:"Bot",
                //                         chat:data.message
                //                 }
                //                 // user.chat.push(temp);
                //                 // user.save();
                //                 // console.log(user);
                //         }
                        
                // });
                
        });


});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

// function upload(){
        
// }