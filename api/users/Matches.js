const MongoConnection = require('../MongoConnection');
const UsersTools = require('./UsersTools');

const getGeoNearObj = (loc) => {
  const { coordinates } = loc;
  const lng = coordinates[0];
  const lat = coordinates[1];

  return {
    near: { type: 'Point', coordinates: [lng, lat] },
    distanceField: 'distance',
    spherical: true,
  };
};

const getProjObj = tags => (
  {
    login: 1,
    pictures: 1,
    profilePicture: 1,
    firstname: 1,
    lastname: 1,
    distance: 1,
    birthDate: 1,
    tags: 1,
    popularity: {
      $divide: [
        { $multiply: [50, '$interestCounter'] },
        { $add: [1, '$visits'] },
      ],
    },
    tagsInCommon: {
      $size: { $filter: { input: '$tags', as: 'tag', cond: { $in: ['$$tag', tags] } } },
    },
  }
);

const get = async (req, res) => {
  const { currentUser } = req.decoded;
  const { query } = req;

  // get current user from db
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });
  const { matches = [] } = user;

  // add query params
  const geoNearObj = getGeoNearObj(user.loc);
  const projObj = getProjObj(user.tags);

  // define number of results per requests
  const toSkip = !query.start ? 0 : parseInt(query.start, 10);
  const numberPerRequest = 1;

  // get users from db
  const cursor = usersCollection.aggregate([
    { $geoNear: geoNearObj },
    { $match: { login: { $in: matches } } },
    { $project: projObj },
    { $sort: { distance: 1, login: 1 } },
    { $skip: toSkip },
    { $limit: numberPerRequest },
  ]);

  let users = await cursor.toArray();
  cursor.close();

  // format users' data
  users = UsersTools.addAge(users);
  users = UsersTools.filterData(users);

  // format server response
  const resObj = { error: '', users };
  if (users.length === numberPerRequest) {
    resObj.nextHref = `/myprofile/matches?start=${toSkip + numberPerRequest}`;
  }

  // send response and end request
  return res.send(resObj);
};

module.exports = { get };
