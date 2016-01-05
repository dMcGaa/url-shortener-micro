var express = require('express');
var app = express();

var makeShortUrl = {
  originalUrl: null,
  shortUrl: null
};

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
  console.log("not main");

  var str = request.url;
  str = str.slice(1+("new/").length);
  if ((str.match(/http+/))) { //(http:\/\/)(.+)(\.+)/)
    makeShortUrl.originalUrl = str;
    console.log(makeShortUrl);
    response.render('pages/shortener')
  }
});

app.get('/*', function(request, response) {  //shortened link already made
  console.log("--Refreshed--")
  console.log("not main");

  var str = request.url;
  str = str.slice(1);
  if ((str.match(/http+/))) { //(http:\/\/)(.+)(\.+)/)
    makeShortUrl.originalUrl = str;
    console.log(makeShortUrl);
    response.render('pages/shortener')
  }
});

// app.get('/*', function(request, response) {
//   //console.log(request.baseUrl);
//   //console.log(request.url);
//   var str = request.url;
//   str = str.slice(1);
//   if((str.match(/http+/)) && (typeof(request.baseUrl) == "string")){  //(http:\/\/)(.+)(\.+)/)
//     makeShortUrl = str;
//     console.log("Type: " + typeof(request.baseUrl));
//     //console.log(request);
//     console.log("Express query: " + JSON.stringify(request.query));
//     console.log(request.baseUrl + " " + request.url);
//     console.log(makeShortUrl);
//     console.log(request.params);
//   }

//   response.render('pages/index')
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});