import MongoConnection from '../MongoConnection';
import * as UsersTools from './UsersTools';

const getMatchObj = (currentUser, gender, lookingFor, birthDate) => {
  const secondsInTenYears = 10 * 365 * 24 * 3600 * 1000;
  const dateMin = new Date(birthDate.getTime() - secondsInTenYears);
  const dateMax = new Date(birthDate.getTime() + secondsInTenYears);

  const matchObj = {
    $and: [
      { login: { $ne: currentUser } },
      { blockedBy: { $ne: currentUser } },
      { blocked: { $ne: currentUser } },
      { gender: { $in: lookingFor } },
      { lookingFor: gender },
      { birthDate: { $gte: dateMin } },
      { birthDate: { $lte: dateMax } },
    ],
  };
  return (matchObj);
};

const getGeoNearObj = loc => ({
  near: loc,
  distanceField: 'distance',
  maxDistance: 50 * 1000,
  spherical: true,
});

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

const getSortObj = (sort) => {
  let sortObj;
  switch (sort) {
    case 'commonTags':
      sortObj = { tagsInCommon: -1, login: 1 }; break;
    case 'age':
      sortObj = { birthDate: -1, login: 1 }; break;
    case 'popularity':
      sortObj = { popularity: -1, login: 1 }; break;
    default:
      sortObj = { distance: 1, login: 1 };
  }
  return sortObj;
};

const get = async (req, res) => {
  const { currentUser } = req.decoded;
  const { query } = req;

  // get current user from db
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });

  // initialize the match object
  const {
    gender,
    lookingFor = [],
    loc = { coordinates: [0, 0] },
    tags,
    birthDate,
} = user;

  const matchObj = getMatchObj(
    currentUser,
    gender,
    lookingFor,
    birthDate,
  );

  // add query params
  const geoNearObj = getGeoNearObj(loc);
  const projObj = getProjObj(tags);
  const addCompatibility = {
    login: 1,
    pictures: 1,
    profilePicture: 1,
    firstname: 1,
    lastname: 1,
    distance: 1,
    birthDate: 1,
    tags: 1,
    popularity: 1,
    tagsInCommon: 1,
    compatibility: { $add: [
      { $divide: ['$distance', 1000] },
      { $multiply: [0.5, '$popularity'] },
      { $multiply: [10, '$tagsInCommon'] },
    ] },
  };
  const sortObj = getSortObj(query.sort);

  // define number of results per requests
  const toSkip = !query.start ? 0 : parseInt(query.start, 10);
  const numberPerRequest = 10;

  // get users from db
  const cursor = usersCollection.aggregate([
    { $geoNear: geoNearObj },
    { $match: matchObj },
    { $project: projObj },
    { $project: addCompatibility },
    { $sort: { compatibility: -1 } },
    { $skip: toSkip },
    { $limit: numberPerRequest },
    { $sort: sortObj },
  ]);

  let users = await cursor.toArray();

  // format users' data
  users = UsersTools.addAge(users);
  users = UsersTools.filterData(users);

  // format server response
  const resObj = { error: '', users };

  // send response and end request
  return res.send(resObj);
};

export { get };
