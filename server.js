const mongoose = require('mongoose');
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

const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
