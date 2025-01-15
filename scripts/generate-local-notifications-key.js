// When developing locally, it is useful to ensure we are only seeing notifications from our
// current locally running environment. Since we don't want to create a new project in Magicbell
// each time one of us runs our environment locally, we need to tag our local notifications with
// a random key generated when we run `npm run dev`. This key will then be stored in our .env file
// and passed over to the .env file in the block ingestor inside docker.

var fs = require('fs');

const LOCAL_KEY = process.env.npm_config_notifications
  ? Math.floor(100000000 + Math.random() * 900000000)
  : 'OFF';

fs.readFile('.env', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(
    /MAGICBELL_DEV_KEY=.*\n/g,
    `MAGICBELL_DEV_KEY=${LOCAL_KEY}\n`,
  );

  fs.writeFile('.env', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
