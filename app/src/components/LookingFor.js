import React from 'react';

const LookingFor = (props) => {
  const { lookingFor } = props;

  let message;
  if (lookingFor === 'both') {
    message = 'girls and dudes';
  } else if (lookingFor === 'male') {
    message = 'dudes';
  } else if (lookingFor === 'female') {
    message = 'girls';
  } else {
    message = '';
  }

  return (
    <div className="lookingFor">
      looking for <span>{message}</span>
    </div>
  );
};

export default LookingFor;
