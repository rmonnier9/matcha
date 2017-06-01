import React from 'react';

const Tags = props => (
  <div className="tags">
    {
      props.tags.map(tag => (<span key={tag}>#{tag} </span>))
    }
  </div>
);

export default Tags;
