var express = require('express');
var app = express();

var makeShortUrl = {
  originalUrl: null,
  shortUrl: null
};

var shortenedUrls = {};  //object to store shortened URL objects
createDefaultLinks();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Give Views/Layouts direct access to data.
app.use(function(req, res, next) {
  res.locals.makeShortUrl = makeShortUrl;
  next();
});


app.get('/', function(request, response) {
  console.log("main");
  response.render('pages/index')
});

app.get('/new/*', function(request, response) {
  console.log("--Refreshed--")
  console.log("new");

  var str = request.url;
  str = str.slice(1+("new/").length);
  if ((str.match(/http:+/))) { //(http:\/\/)(.+)(\.+)/)
    makeShortUrl.originalUrl = str;
    console.log(makeShortUrl);
    response.render('pages/shortener')
  }
  else{
    response.render('pages/index')
  }
});

app.get('/*', function(request, response) {  //shortened link already made
  console.log("--Refreshed--")
  //console.log("not main");

  var str = request.url;
  str = str.slice(1);
  //console.log(str)
  //if shortened URL has been made, redirect
  if (str in shortenedUrls) { //(http:\/\/)(.+)(\.+)/)
    makeShortUrl = shortenedUrls[str];
    console.log("Redirect " + JSON.stringify(makeShortUrl));
    response.redirect(makeShortUrl.originalUrl);
    //response.render('pages/shortener');
  }
  else{
    response.render('pages/index')
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function createDefaultLinks(){
  var myObj = {
    originalUrl: "http://dmcgaa.com",
    shortUrl: "https://glacial-headland-3584.herokuapp.com/1"
  }
  shortenedUrls["1"] = myObj;
}