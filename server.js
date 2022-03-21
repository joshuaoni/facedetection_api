const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }

    // port : 5432,
    // user : 'crhexybuivwcde',
    // password : '993be299cd5a24a6818a6086bfb3dbc54f430c5e5ff0c72b11b031ab6dd2eb22',
    // database : 'd3qbrd2ejuq5j',
  }
});

const app = express();

app.use(express.json());
app.use(cors());


// Sign In
app.post('/', signin.handleSignin(db, bcrypt))
// Sign Up
app.post('/signup', (req, res) => {signup.handleSignup(req, res, db, bcrypt)})
// Update Entries
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
// Clarifai Api Call
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})



app.listen(process.env.PORT || 3000, ()=>{
    console.log(`app running on port ${process.env.PORT}`)
})
