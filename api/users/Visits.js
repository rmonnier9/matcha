import MongoConnection from '../config/MongoConnection';
import * as UsersTools from './UsersTools.js';

const get = async (req, res) => {
  const { currentUser } = req.decoded;
  const { start } = req.query;

  // get current user from db
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });
  const { visitedBy = [] } = user;

  // define number of results per requests
  const toSkip = !start ? 0 : parseInt(start, 10);
  const numberPerRequest = 2;
  const nextStart = toSkip + numberPerRequest;

  // get users from db
  const cursor = usersCollection.find({ login: { $in: visitedBy } })
                                .skip(toSkip).limit(numberPerRequest);
  let users = await cursor.toArray();

  // format users' data
  UsersTools.addUsefullData(users, user);
  users = UsersTools.filterData(users);

  // format server response
  const resObj = { error: '', users };
  if (visitedBy.length > nextStart) {
    resObj.nextHref = `/myprofile/visits?start=${nextStart}`;
  }

  // send response and end request
  return res.send(resObj);
};

export { get };
