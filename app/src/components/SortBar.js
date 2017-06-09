import React from 'react';

const SortBar = (props) => {
  const { defaultSort } = props;
  return (
    <div className="sortBar">
      <div className="label">Sort by</div>
      <div className="sortButtons">
        <input type="radio" value="popularity" id="popularity" name="sort" defaultChecked={defaultSort === 'popularity'} />
        <label htmlFor="popularity">Popularity</label>
        <input type="radio" value="commonTags" id="commonTags" name="sort" defaultChecked={defaultSort === 'commonTags'} />
        <label htmlFor="commonTags">Common tags</label>
        <input type="radio" value="age" id="age" name="sort" defaultChecked={defaultSort === 'age'} />
        <label htmlFor="age">Age</label>
        <input type="radio" value="distance" id="distance" name="sort" defaultChecked={defaultSort === 'sort'} />
        <label htmlFor="distance">Distance</label>
      </div>
    </div>
  );
};

export default SortBar;
