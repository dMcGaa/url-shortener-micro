var express = require('express');
var app = express();

var makeShortUrl = {
  originalUrl: null,
  shortUrl: null
};

var shortenedUrls = {}; //object to store shortened URL objects
createDefaultLinks();
var baseShortUrl = "https://glacial-headland-3584.herokuapp.com/";

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
  str = str.slice(1 + ("new/").length);
  if ((str.match(/http:+/))) { //(http:\/\/)(.+)(\.+)/)
    var link = checkForUniqueURL(str);
    if (link !== null) {
      console.log("URL previously shortened")
      makeShortUrl.originalUrl = shortenedUrls[link].originalUrl;
      makeShortUrl.shortUrl = shortenedUrls[link].shortUrl;
      response.render('pages/shortener')
    }
    else {
      var sUrl = createShortURL();
      console.log("short: " + sUrl);
      makeShortUrl.originalUrl = str;
      makeShortUrl.shortUrl = baseShortUrl + sUrl;
      //shortenedUrls[sUrl] = makeShortUrl; //will copy object by reference, meaning a new url will replace all other ones generated
      createNewLink(str, sUrl);//send immutable string to create new object
      // shortenedUrls[sUrl].originalUrl = str;
      // shortenedUrls[sUrl].shortUrl = baseShortUrl + sUrl;
      console.log(makeShortUrl);
      response.render('pages/shortener')
    }
  }
  else {
    response.render('pages/index')
  }
});

app.get('/*', function(request, response) { //shortened link already made
  console.log("--Refreshed--")
    //console.log("not main");

  var str = request.url;
  str = str.slice(1);
  //console.log(str)
  //if shortened URL has been made, redirect
  if (str in shortenedUrls) {
    makeShortUrl = shortenedUrls[str];
    console.log("Redirect " + JSON.stringify(makeShortUrl));
    //response.redirect(makeShortUrl.originalUrl);
    response.render('pages/shortener');
  }
  else {
    response.render('pages/index')
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function createDefaultLinks() {
  var myObj = {
    originalUrl: "http://dmcgaa.com",
    shortUrl: "https://glacial-headland-3584.herokuapp.com/1"
  }
  shortenedUrls["1"] = myObj;
}

function createNewLink(origUrl, sUrl) {
  var myObj = {
    originalUrl: origUrl,
    shortUrl: baseShortUrl + sUrl
  }
  shortenedUrls[sUrl] = myObj;
}


function checkForUniqueURL(urlToCheck) {
  for (var link in shortenedUrls) {
    //console.log(link);
    console.log(shortenedUrls[link].originalUrl); //cannot do ".link.originalUrl" and cannot do "[link][originalUrl]"
    if (shortenedUrls[link].originalUrl == urlToCheck) {
      return link;
    }
  }
  return null;
}

function createShortURL() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  var text = "";

  for (var i = 0; i < 3; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  for (var link in shortenedUrls) {
    if (text == link) {
      text = createShortURL();
    }
  }
  return text;

}
