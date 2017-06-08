import queryString from 'query-string';

import MongoConnection from './config/MongoConnection.js';
import * as UsersTools from './UsersTools.js';

const addNameQuery = (searchOBJ, name) => {
  if (name) {
    const regex = new RegExp(name);

    searchOBJ.$and.push({
      $or: [
        { login: regex },
        { firstname: regex },
        { lastname: regex },
      ],
    });
  }
  return searchOBJ;
};

const addAgeQuery = (searchOBJ, age) => {
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

    searchOBJ.$and.push({
      birthDate: {
        $lt: dateMax,
      },
    });
    searchOBJ.$and.push({
      birthDate: {
        $gt: dateMin,
      },
    });
  }
  return searchOBJ;
};

const addDistQuery = (searchOBJ, location, dist) => {
  if (dist && (dist === '0to15' || dist === 'to50' || dist === 'to150')) {
    const { latitude, longitude } = location;
    let distMax;
    if (dist === '0to15') {
      distMax = 15 * 1000;
    } else if (dist === 'to50') {
      distMax = 50 * 1000;
    } else {
      distMax = 150 * 1000;
    }

    searchOBJ.$and.push({
      loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: distMax },
      },
    });
  }
  return searchOBJ;
};

const addTagsQuery = (searchOBJ, tags) => {
  if (tags) {
    const tagsQuery = Object.prototype.toString.call(tags) === '[object Array]' ? tags : [tags];

    searchOBJ.$and.push({
      tags: {
        $in: tagsQuery,
      },
    });
  }
  return searchOBJ;
};

const advancedSearch = async (req, res) => {
  const { currentUser } = req.decoded;
  const { query } = req;

  // get current user from db
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });

  // initialize the search object (parameter of find() )
  let searchOBJ = {
    $and: [
      { login: { $ne: currentUser } },
      { blockedBy: { $ne: currentUser } },
      { blocked: { $ne: currentUser } },
    ],
  };
  // add query params
  searchOBJ = addNameQuery(searchOBJ, query.name);
  searchOBJ = addAgeQuery(searchOBJ, query.age);
  searchOBJ = addDistQuery(searchOBJ, user.location, query.distVal);
  searchOBJ = addTagsQuery(searchOBJ, query.tags);

  // define number of results per requests
  const toSkip = !query.start ? 0 : parseInt(query.start, 10);
  const numberPerRequest = 2;

  // get users from db
  const cursor = usersCollection.find(searchOBJ)
                                .skip(toSkip).limit(numberPerRequest);
  let users = await cursor.toArray();

  // format users' data
  UsersTools.addUsefullData(users, user);
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
