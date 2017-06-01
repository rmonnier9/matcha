import React, { Component } from 'react';

import Localisation from './Localisation.js';
import Tags from './Tags.js';
import LookingFor from './LookingFor.js';

class EncartRight extends Component {

  gracefulGender = (gender) => {
    if (gender === 'male') {
      return 'dude';
    } else if (gender === 'female') {
      return 'girl';
    }
    return '';
  }

  render() {
    const { profile } = this.props;
    const {
      distance,
      age,
      lookingFor,
      about,
      tags,
    } = profile;
    const gender = this.gracefulGender(profile.gender);

    return (
      <div className="encart-right">
        <div className="age">
          <span>{age}</span>ans.
        </div>
        <div className="gender">
          {"I'm a "}<span>{gender}</span>
        </div>
        <LookingFor lookingFor={lookingFor} />
        <div className="about">
          <span>{about}</span>
        </div>
        <Tags tags={tags} />
        <Localisation distance={distance} />
      </div>
    );
  }
}

export default EncartRight;
