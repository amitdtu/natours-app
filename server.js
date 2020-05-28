const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  // sync code error handler
  console.log(err.name, err.message);
  console.error('UNCAUGHT EXCEPTION');
  // 0: success and 1: uncause exception
  process.exit(1);
});

// eslint-disable-next-line import/newline-after-import
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DATABASE CONNECTED SUCCESSFULLY'));

// const newTour = new Tour({
//   name: 'Jaipur',
// });

// newTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('Error :', err));

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.error('UNHANDLED REJECTION');
  server.close(() => {
    // 0: success and 1: uncause exception
    process.exit(1);
  });
});
