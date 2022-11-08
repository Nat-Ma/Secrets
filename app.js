require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

  userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

  const User = new mongoose.model('User', userSchema);

  app.post('/register', async(req, res) => {
    try {
      console.log(req.body)
      const user = new User({ email: req.body.username, password: req.body.password });
      await user.save();
      res.render('secrets');
    } catch(e) {
      res.send(e);
    }
  })

  app.post('/login', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({ email: username });
    if (foundUser) {
      if (foundUser.password === password) {
        res.render('secrets');
      } else {
        res.render('login');
      }
    }
  })
}

app.get('/', async (req, res) => {
  try {
    res.render('home')
  } catch (e) {
    res.send(e);
  }
})

app.get('/login', async (req, res) => {
  try {
    res.render('login')
  } catch (e) {
    res.send(e);
  }
})

app.get('/register', async (req, res) => {
  try {
    res.render('register')
  } catch (e) {
    res.send(e);
  }
})

app.get('/secrets', async (req, res) => {
  try {
    res.render('secrets')
  } catch (e) {
    res.send(e);
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
