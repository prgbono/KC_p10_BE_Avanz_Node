require('dotenv').config();

const { connectMongoose, mongoose, Ad, User } = require('./../models');

async function initDB() {
  try {
    console.log('Initializing DB...');

    //TODO; Refactor init collections
    // await initAds();
    // await initUsers();

    // Delete db
    await Ad.deleteMany();
    await User.deleteMany();
    console.log(`       ...Ads and Users collections deleted`);

    // Read mock data from json files
    const adsFromJson = require('./anuncios.json');
    const usersFromJson = require('./users.json');
    console.log(`       ...Ads and Users data read from json file`);

    // Populate db
    await Ad.insertMany(adsFromJson.anuncios);
    const usersHashed = await getUsersHashed(usersFromJson.users);
    await User.insertMany(usersHashed);
    console.log(`       ...new data added to db`);

    // Close db
    mongoose.connection.close();
  } catch (error) {
    console.log(
      'It has been some error while the DB init script, err: ',
      error,
    );
  }
}

function getUsersHashed(users) {
  return Promise.all(
    users.map(async (user) => {
      return { ...user, pass: await User.hashPass(user.pass) };
    }),
  );
}

initDB().catch((err) => console.error('Error initializing the database!', err));
