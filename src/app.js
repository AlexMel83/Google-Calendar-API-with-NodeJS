const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res)=>res.render('index.html'));

app.post('/', (req,res)=>res.render('events.html'));

app.listen(3000, ()=>console.log('server on port 3000'));