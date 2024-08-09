const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');


const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/employee', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log("body", req.body);
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).send('User created');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.status(200).send('Login successfull');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

app.get('/run-python', (req, res) => {
    console.log("python")
    const pythonProcess = spawn('python', ['main.py']);
  
    pythonProcess.stdout.on('data', (data) => {
      res.send(data.toString());
    });
  
    // pythonProcess.stderr.on('data', (data) => {
    //   res.status(500).send(data.toString());
    // });
  });

app.listen(5000, () => {
    console.log('Server running on port 5000');
});