import React from 'react';
import PropTypes from 'prop-types';

const ErrorDisplayer = ({ error }) => (
  <div className="errors">
    {
      error.map(({ message, field }) => (<p key={field}>{`On ${field} field : ${message}.`} </p>))
    }
  </div>
);

ErrorDisplayer.propTypes = {
  error: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    message: PropTypes.string,
  })),
};

ErrorDisplayer.defaultProps = {
  error: [],
};

export default ErrorDisplayer;
