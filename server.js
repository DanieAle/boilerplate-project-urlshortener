require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParse = require('body-parser');
const dns = require('dns');
// Basic Configuration
const port = process.env.PORT || 3000;

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
//shorturl verification
app.post('/api/:shorturl?',parseUrl,(req,res) =>{
  let array = [];
  array.push(req.body.url.substring(0,req.body.url.indexOf(':')),req.body.url.substring(req.body.url.indexOf('/')+2));
  console.log(array);
  if(array[0] !== 'https' && array[0] !== 'http'){
    res.send({error: 'invalid ulr'});
  }
  else{
  let body = dns.lookup(array[1],(err,address,family) =>{
    res.send({ original_url : body.hostname, short_url : address.split('.')[1]});
  });
}
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
