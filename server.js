require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParse = require('body-parser');
const dns = require('dns');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
// Basic Configuration
const port = process.env.PORT || 3000;
process.env.MONGO_URI=//ADD HERE URL TO MONGODB DATABASE
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let parseUrl = bodyParse.urlencoded({extended:false});
//Conection
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true});
//schema
let urlSchema = new mongoose.Schema({
  urlComplete: String,
  i: Number
});

//MODEL
let Url = new mongoose.model('Url',urlSchema);

let c; 
function cargar(){
Url.countDocuments({},(err,count) =>{
  console.log(count);
  c = count;
})
}
if(c === undefined) cargar();
//shorturl verification
app.post('/api/shorturl',parseUrl,(req,res) =>{
  let i =1;
  console.log(i+c);
  let array = [];
  if(req.body['url'] === undefined){
    array.push('error');
  }
  else{
  array.push(req.body['url'].substring(0,req.body['url'].indexOf(':')),req.body['url'].substring(req.body['url'].indexOf('/')+2));
  }
  if(array[0] !== 'https' && array[0] !== 'http'){
    res.send({error: 'invalid url' });
  }
  else{
    let u = new Url({urlComplete: req.body['url'],i:i+c});
    u.save();
    c++;
  let body = dns.lookup(array[1],(err,address,family) =>{
    res.send({ original_url : u.urlComplete, short_url : u.i});
  });
  }
});
app.get('/api/shorturl/:shorturl',(req,res) =>{
  console.log(req.params,req.body);
  let n = parseInt(req.params.shorturl);
  Url.findOne({i: n})
  .then(found =>{
      res.redirect(found.urlComplete);
    })
    .catch(err =>{
      return console.error(err);
    })
  });


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
