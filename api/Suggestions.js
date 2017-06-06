import MongoConnection from './config/MongoConnection.js';
import * as UsersTools from './UsersTools.js';
import * as UserScore from './UserScore.js';

const getSearchOBJ = (gender, lookingFor, currentUser, loc) => {
  const { coordinates } = loc;
  const searchOBJ = {
    $and: [
      // { login: { $ne: currentUser } },
      // { blockedBy: { $ne: currentUser } },
      // { blocked: { $ne: currentUser } },
      // { gender: { $in: lookingFor } },
      // { lookingFor: gender },
      { loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates,
          },
          $maxDistance: 100 * 1000,
        },
      } },
    ],
  };
  return (searchOBJ);
};

const get = async (req, res) => {
  const { currentUser } = req.decoded;

  // get current user from db
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });

  // create search query for mongo
  const { gender, lookingFor = [], loc = { coordinates: [0, 0] } } = user;
  const searchOBJ = getSearchOBJ(
    gender,
    lookingFor,
    currentUser,
    loc,
  );

  // get users from db
  const cursor = usersCollection.find(searchOBJ);
  let users = await cursor.toArray();

  // format users' data
  UserScore.addScore(users, user);
  UsersTools.addUsefullData(users, user);
  users = users.filter(current => current.distance < 100);
  users.sort((userA, userB) => -userA.score - -userB.score);
  users = UsersTools.filterData(users);
  users = users.slice(0, 10);

  // format server response
  const resObj = { error: '', users };

  // send response and end request
  return res.json(resObj).end();
};

export { get };
