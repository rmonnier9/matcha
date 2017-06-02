import queryString from 'query-string';

import config from './config/config.js';
import MongoConnection from './config/MongoConnection.js';
import * as UsersTools from './UsersTools.js';

const addAgeQuery = (searchOBJ, age) => {
  if (age && (age === '18to30' || age === '30to50' || age === 'from50')) {
    let dateMax;
    let dateMin;
    if (age === '18to30') {
      dateMax = UsersTools.getBirthDate(18);
      dateMin = UsersTools.getBirthDate(30);
    }    else if (age === '30to50') {
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
    let distMax;
    if (dist === '0to15') {
      distMax = 15 * 1000;
    } else if (dist === 'to50') {
      distMax = 50 * 1000;
    } else {
      distMax = 150 * 1000;
    }
    const { latitude, longitude } = location;
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

const advancedSearch = async (req, res) => {
  const { currentUser } = req.decoded;
  const { query } = req;

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });

  // initialize the search object (parameter of find() )
  let searchOBJ = {
    $and: [
      { blockedBy: { $ne: currentUser } },
    ],
  };
  if (query.name) {
    const regex = new RegExp(query.name);
    searchOBJ.$and.push({
      $or: [
        { login: regex },
        { firstname: regex },
        { lastname: regex },
      ],
    });
  }
  searchOBJ = addAgeQuery(searchOBJ, query.age);
  searchOBJ = addDistQuery(searchOBJ, user.location, query.distVal);
  console.log(searchOBJ);
  // define number of results per requests
  const toSkip = !query.start ? 0 : parseInt(query.start, 10);
  const numberPerRequest = 2;

  // execute the query in the DB
  const cursor = usersCollection.find(searchOBJ)
  .skip(toSkip).limit(numberPerRequest);
  let users = await cursor.toArray();

  UsersTools.addUsefullData(users, user);
  users = UsersTools.filterData(users);

  const resObj = { success: true, message: 'Search successfull.', users };
  if (users.length) {
    query.start = toSkip + numberPerRequest;
    resObj.nextHref = `/search?${queryString.stringify(query)}`;
  }
  return res.json(resObj).end();
};

export { advancedSearch };
