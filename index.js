var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    expressSanitizer= require("express-sanitizer"),
    mongoose       = require("mongoose"),
    Campground     = require("./models/campground"),
    Post           = require("./models/blog"),      
    SeeDB          = require("./seed"),
    Comment        = require("./models/comment"),
    methodOverride = require("method-override")
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    passportLocalMongoose= require("passport-local-mongoose"),
    expressSession    = require("express-session"),
    User             = require("./models/User"),
    campgroundRoutes = require("./routes/campground"),
    blogRoutes       = require("./routes/blogs"),
    authRoutes       = require("./routes/auth"),
    flash            = require("connect-flash"),
    User            =  require("./models/User");
mongoose.connect('mongodb://localhost/BlitzHubV7', {useNewUrlParser: true}); 
//mongoose.connect(process.env.databaseURL,{useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex : true});
   
//mongoose.connect('mongodb://localhost/BlitzHubV7', {useNewUrlParser: true}); 
//mongodb+srv://Snowlag:ankitasha@cluster0-iyi5r.mongodb.net/test?retryWrites=true&w=majority
//Complete the pending Conection----------------------
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
//-------------------------------------------------------------------------------------------------
//--------------------App Config----------------------------------------------------------------------------
app.use(require("express-session")({
    secret: "Ankit Joshi is Snowlag",
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(methodOverride("_method")); //Method override structure
app.set("view engine","ejs");//----------Set view engine to ejs file-------------------------------
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentuser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success= req.flash("success");
    next();
})


app.use(authRoutes);
app.use(blogRoutes);
app.use(campgroundRoutes);
//Run Seed js file to remove all preexisting data from database
//SeeDB();
//---------------------------------------------------------------------------
//------------Routes-------------------------------------------------------
//------------Root page-----------------------------------------------
app.get("/",function(req,res){
  res.render("home");
});


//----------------------------------------------------------------
//----------------------Assign Port number for local host---------------------------------

app.listen(3000,function(){
  console.log("Server started");
});

/*
app.listen(process.env.PORT,process.env.IP,function(){
  console.log("Server has started")
});
*/