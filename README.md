# URL Shortener Microservice.

## User Stories:
1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
3. When I visit that shortened URL, it will redirect me to my original link.

## Additional Info:
Presently, do not save the URLs entered in any database.
When the heroku dyno sleeps, any shortened URLs are lost.

## Additional Note:
Still learning... be gentle.

## Using:
* NodeJS
* EJS
* Express
