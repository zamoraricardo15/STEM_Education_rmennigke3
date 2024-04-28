const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));
// Remove this line; it's not needed if you've configured the root static directory as shown in step 1
//app.use('/pages', express.static(path.join(__dirname, 'src', 'public', 'pages')));



mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

// Serve HTML files
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'pages', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'pages', 'login.html'));
});

// Serve other HTML files
const pages = [
  'biology_computing',
  'chemistry_engineering',
  'diversity_heritage',
  'energy_space_ethics',
  'enlightenment',
  'foundations',
  'stem_history',
  'technological_revolution'
];

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'pages', `${page}.html`));
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'pages', 'index.html'));
});
// Signup route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.redirect('/'); // Redirect to the root
  } catch (error) {
    res.status(500).send('Error registering new user.');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Find user by username
  const user = await User.findOne({ username });
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/');
  } else {
    res.status(401).send('Invalid credentials.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));