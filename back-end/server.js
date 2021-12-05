const express = require('express');
const bodyParser = require("body-parser");
var cors = require('cors');


const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const mongoose = require('mongoose');

// Create a scheme for scores
const ScoreSchema = new mongoose.Schema({
  user: String,
  score: {type: Number, default: 0},
  avatar: String
});
  
const Score = mongoose.model('Score', ScoreSchema);


// connect to the database
mongoose.connect('mongodb://localhost:27017/scores', {
  useNewUrlParser: true
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

//Creates a new score in our high scores
app.post('/api/scores', function(req, res, next) {
    let score = new Score(req.body)
    score.save((err, score) => {
        if(err) return next(err);
        res.json(score)
    })
})

// Get a list of all of the high scores
app.get('/api/scores', function(req, res, next) {
    Score.find(function(err, scores){
      if(err){ return next(err); }
      res.json(scores);
    });
  });

app.delete('/api/scores/:id', async (req, res) => {
  try {
    let score = await Score.deleteOne({_id: req.params.id});
    res.send(score);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/scores/:id', async (req, res) => {
  try {
    let score = await Score.findOne({_id: req.params.id});
    score.user = req.body.user;
    score.score = req.body.score;
    score.save()
    res.send(score)
  } catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
