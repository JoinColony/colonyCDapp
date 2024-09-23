// When developing locally, it is useful to ensure we are only seeing notifications from our
// current locally running environment. Since we don't want to create a new project in Magicbell
// each time one of us runs our environment locally, we need to tag our local notifications with
// a random key generated when we run `npm run dev`. This key will then be stored in our .env file
// and passed over to the .env file in the block ingestor inside docker.

const { exec } = require('node:child_process');

const LOCAL_KEY = Math.floor(100000000 + Math.random() * 900000000);

const fullCmd = `sed -i '' 's/MAGICBELL_DEV_KEY=.*/MAGICBELL_DEV_KEY=${LOCAL_KEY}/g' .env`;

exec(fullCmd, (error, stdout, stderr) => {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.error(stderr);
  }
});
