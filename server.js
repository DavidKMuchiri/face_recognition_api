const express = require('express');
const bcrypt = require('bcrypt-nodejs'); 
const knex = require('knex');
const cors = require('cors');

// The below imports are imported differently since I wanted you to learn how files are imported in node
// and used. So no criteria is used.
const register = require('./controllers/register');
const handleSignin = require('./controllers/signin').handleSignin;
const image = require('./controllers/image')
const handleProfile = require('./controllers/profile').handleProfile;



const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'davidmcall',
      database : 'face_recognition'
    }
  });

const app = express();

// Never forget this middleware as it will really stress you.
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>{
    return res.send("<h1>Server is running</h1>");
})

app.get('/profile/:id', (req, res) =>{
    handleProfile(req, res, db);
})


// The below signin endpoint first runs automatically the function handleSignin when the server code is being compiled.
// When it runs, it returns another another function with (req, res) as the parameters as you can see in 
// ./controllers.signin.js.
// Now when the front-end calls /signin, req and res arguments are passed automatically to function that was 
// returned initially. That function now runs and completes the signin process.
 
app.post('/signin', handleSignin(db, bcrypt));
    
app.post('/register', (req, res) =>{
    register.handleRegister(req, res, db, bcrypt);
})

app.post('/imageurl', (req, res) =>{
    image.handleApiCall(req, res);
})

app.put('/image', (req, res) => {
    image.imageHandler(req, res, db);
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3100, ()=>{
    console.log("Server running on port 3100");
})

