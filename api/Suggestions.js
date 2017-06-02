import MongoConnection from './config/MongoConnection.js';
import * as UsersTools from './UsersTools.js';

const getSearchOBJ = (gender, lookingFor, currentUser) => {
  const searchOBJ = {
    $and: [
      { blockedBy: { $ne: currentUser } },
      { blocked: { $ne: currentUser } },
      { gender: { $in: lookingFor } },
      { lookingFor: gender },
    ],
  };
  return (searchOBJ);
};

const get = async (req, res) => {
  const { currentUser } = req.decoded;

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });
  const searchOBJ = getSearchOBJ(
    user.gender,
    user.lookingFor,
    currentUser,
  );
  const cursor = usersCollection.find(searchOBJ);
  let users = await cursor.toArray();
  UsersTools.addScore(users, user);
  UsersTools.addUsefullData(users, user);
  users = users.filter(current => current.distance < 100);
  users.sort((userA, userB) => -userA.score - -userB.score);
  users = UsersTools.filterData(users);
  users = users.slice(0, 10);
  const resObj = { success: true, message: 'Search successfull.', users };
  return res.json(resObj).end();
};

export { get };
