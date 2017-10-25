const MongoConnection = require('../MongoConnection');
const UsersTools = require('./UsersTools');

const get = async (req, res) => {
  const { currentUser } = req.decoded;
  const { start } = req.query;

  // get current user from db
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });
  const { interestedPeople = [] } = user;

  // define number of results per requests
  const toSkip = !start ? 0 : parseInt(start, 10);
  const numberPerRequest = 2;
  const nextStart = toSkip + numberPerRequest;

  // get users from db
  const cursor = usersCollection.find({ login: { $in: interestedPeople } })
                                .skip(toSkip).limit(numberPerRequest);
  let users = await cursor.toArray();

  // format users' data
  UsersTools.addUsefullData(users, user);
  users = UsersTools.filterData(users);

  // format server response
  const resObj = { error: '', users };
  if (interestedPeople.length > nextStart) {
    resObj.nextHref = `/myprofile/likes?start=${nextStart}`;
  }

  // send response and end request
  return res.send(resObj);
};

module.exports = { get };
