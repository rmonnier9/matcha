import { getAge } from './UsersTools.js';

// score computation for suggestions
const getAgeScore = (ageA, ageB) => {
  const ageDiff = Math.abs(ageA - ageB);
  if (ageDiff < 2) return 100;
  else if (ageDiff < 5) return 75;
  else if (ageDiff < 10) return 50;
  else if (ageDiff < 20) return 25;
  return (0);
};

const getDistScore = (dist) => {
  if (dist < 5) return (100);
  else if (dist < 10) return (75);
  else if (dist < 20) return (50);
  else if (dist < 30) return (25);
  return (0);
};

const getCommonTagsScore = (comTags) => {
  if (comTags > 25) return (100);
  else if (comTags > 18) return (75);
  else if (comTags > 10) return (50);
  else if (comTags > 5) return (25);
  return (0);
};

const getPopScore = pop => (pop * 10);

const addScore = (users, currentUser) => {
  const age = getAge(currentUser.birthDate);
  return users.map((user) => {
    user.score = getAgeScore(user.age, age);
    user.score += getPopScore(user.popularity);
    user.score += getDistScore(user.distance);
    user.score += getCommonTagsScore(user.commonTags);
    return (user);
  });
};

export { addScore };
