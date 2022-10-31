import express from 'express';
import path from 'path';

const app = express();

app.use('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, './voyager.html'));
});

app.listen(4567);

// eslint-disable-next-line no-console
console.log('GraphQL Voyager started at http://localhost:4567');
