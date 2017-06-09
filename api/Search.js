import queryString from 'query-string';

import MongoConnection from './config/MongoConnection.js';
import * as UsersTools from './UsersTools.js';

const initMatchObj = currentUser => (
  {
    $and: [
      { login: { $ne: currentUser } },
      { blockedBy: { $ne: currentUser } },
      { blocked: { $ne: currentUser } },
    ],
  }
);

const addNameQuery = (matchObj, name) => {
  if (name) {
    const regex = new RegExp(name);

    matchObj.$and.push({
      $or: [
        { login: regex },
        { firstname: regex },
        { lastname: regex },
      ],
    });
  }
  return matchObj;
};

const addAgeQuery = (matchObj, age) => {
  if (age && (age === '18to30' || age === '30to50' || age === 'from50')) {
    let dateMax;
    let dateMin;
    if (age === '18to30') {
      dateMax = UsersTools.getBirthDate(18);
      dateMin = UsersTools.getBirthDate(30);
    } else if (age === '30to50') {
      dateMax = UsersTools.getBirthDate(30);
      dateMin = UsersTools.getBirthDate(50);
    } else {
      dateMax = UsersTools.getBirthDate(50);
      dateMin = UsersTools.getBirthDate(100);
    }

    matchObj.$and.push({
      birthDate: {
        $lt: dateMax,
      },
    });
    matchObj.$and.push({
      birthDate: {
        $gt: dateMin,
      },
    });
  }
  return matchObj;
};

const getGeoNearObj = (loc, dist) => {
  const { coordinates } = loc;
  const lng = coordinates[0];
  const lat = coordinates[1];

  let distMax;
  if (dist === '0to15') {
    distMax = 15 * 1000;
  } else if (dist === 'to50') {
    distMax = 50 * 1000;
  } else {
    distMax = 150 * 1000;
  }

  const geoNearObj = {
    near: { type: 'Point', coordinates: [lng, lat] },
    distanceField: 'distance',
    maxDistance: distMax,
    spherical: true,
  };
  return geoNearObj;
};

const getSortObj = (sort) => {
  let sortObj;
  switch (sort) {
    case 'commonTags':
      sortObj = { tagsInCommon: -1 }; break;
    case 'age':
      sortObj = { birthDate: -1 }; break;
    case 'popularity':
      sortObj = { popularity: -1 }; break;
    default:
      sortObj = { distance: 1 };
  }
  return sortObj;
};

const getFilterPopObj = (popmin, popmax) => {
  popmin = parseInt(popmin, 10);
  popmax = parseInt(popmax, 10);

  return ({ $and: [{ popularity: { $gt: popmin } }, { popularity: { $lt: popmax } }] });
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

const addTagsQuery = (matchObj, tags) => {
  if (tags) {
    const tagsQuery = tags instanceof Array ? tags : [tags];

    matchObj.$and.push({
      tags: {
        $all: tagsQuery,
      },
    });
  }
  return matchObj;
};

const advancedSearch = async (req, res) => {
  const { currentUser } = req.decoded;
  const { query } = req;

  // get current user from db
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });

  // initialize the search object (parameter of find() )
  let matchObj = initMatchObj(currentUser);

  // add query params
  matchObj = addNameQuery(matchObj, query.name);
  matchObj = addAgeQuery(matchObj, query.ageVal);
  matchObj = addTagsQuery(matchObj, query.tags);
  const filterPopObj = getFilterPopObj(query.popmin, query.popmax);
  const projObj = getProjObj(user.tags);
  const sortObj = getSortObj(query.sort);
  const geoNearObj = getGeoNearObj(user.loc, query.distVal);

  // define number of results per requests
  const toSkip = !query.start ? 0 : parseInt(query.start, 10);
  const numberPerRequest = 2;

  const cursor = usersCollection.aggregate([
    { $geoNear: geoNearObj },
    { $match: matchObj },
    { $project: projObj },
    { $match: filterPopObj },
    { $sort: sortObj },
    { $skip: toSkip },
    { $limit: numberPerRequest },
  ], { cursor: { batchSize: numberPerRequest } });

  let users = await cursor.toArray();

  // format users' data
  UsersTools.addAge(users);
  users = UsersTools.filterData(users);

  // format server response
  const resObj = { error: '', users };
  if (users.length === numberPerRequest) {
    query.start = toSkip + numberPerRequest;
    resObj.nextHref = `/search?${queryString.stringify(query)}`;
  }

    // send response and end request
  return res.json(resObj).end();
};

export { advancedSearch };
