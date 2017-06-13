import React from 'react';
import PropTypes from 'prop-types';

const Tags = ({ tags }) => (
  <div className="tags">
    {
      tags.map(tag => (<span key={tag}>#{tag} </span>))
    }
  </div>
);

Tags.propTypes = {
  tags: PropTypes.PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tags;
