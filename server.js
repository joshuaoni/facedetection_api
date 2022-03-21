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
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'psql',
      database : 'facedetection'
    }
});

const app = express();

app.use(express.json());
app.use(cors());


// Sign In
// app.post('/', signin.handleSignin(db, bcrypt))
app.post('/', (req,res)=>{res.send('it is working')})
// Sign Up
app.post('/signup', (req, res) => {signup.handleSignup(req, res, db, bcrypt)})
// Update Entries
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
// Clarifai Api Call
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})



app.listen(process.env.PORT || 3000, ()=>{
    console.log(`app running on port ${process.env.PORT}`)
})
