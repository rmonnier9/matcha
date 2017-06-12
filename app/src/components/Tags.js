import React from 'react';

const Tags = ({ tags }) => (
  <div className="tags">
    {
      tags.map(tag => (<span key={tag}>#{tag} </span>))
    }
  </div>
);

export default Tags;
