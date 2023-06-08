//Modules Import
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressSession = require("express-session");

// Models Import
const adminmodel = require("./models/admin")

//Controllers Import
const adminController=require('./controllers/admin')
const homeController=require("./controllers/home")
const recordController=require("./controllers/record")

//Import from .env
const { DB_NAME, WEB_PORT, MONGODB_URI } = process.env;


/*
 Connect to Database
 */
mongoose
  .connect(MONGODB_URI, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });

  const app = express();

  app.use(expressSession({ secret: 'crisnic', cookie: { expires: new Date(253402300000000) } }))

  app.use(bodyParser.urlencoded({extended: true}));
  
  app.use(bodyParser.json())
  
  app.set('view engine', 'ejs');

  
  // Use in all API requests
  app.use("*", async (req, res, next) => {
    global.admin = false;
    if (req.session.userID && !global.admin) {
      const admin = await adminmodel.findById(req.session.userID);
      if(admin)
      global.admin = admin;
    }
    next();
  })

  //Home Screen
  app.get("/", homeController.list);

  //List by Car Make (Home Screen)
  app.get("/findbycarmake/:carmake", recordController.listbycarmake);

  //Get all Records (Browse Records Screen)
  app.get("/viewrecords", recordController.list);

  // Add a record (Browse Records Screen)
  app.get("/addarecord", (req, res) => {
    res.render("pages/add-record", { errors: {} });
  });
  
  app.post("/addarecord", recordController.create);

  // Delete by Id (Browse Records Screen)
  app.get("/viewrecords/delete/:id", recordController.delete)

  // Update a record (Browse Records Screen)
  app.get("/updatearecord/:id",  recordController.edit);
  app.post("/updatearecord/:id", recordController.update);

  //Register an Admin (Nav Bar)
  app.get("/register", (req, res) => {
    res.render('pages/register')
  });
app.post("/register", adminController.create);

// Login Admin (Nav Bar)
app.get("/login", (req, res) => {
  res.render('pages/login')
});
app.post("/login", adminController.login);

// Logout Admin (Nav Bar)
app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.admin = false;
  res.redirect('/');
})

app.listen(WEB_PORT, () => {
  console.log(
    `App listening at http://localhost:${WEB_PORT}`  );
});
