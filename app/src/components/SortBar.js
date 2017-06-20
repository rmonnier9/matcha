import React from 'react';
import PropTypes from 'prop-types';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

const SortBar = ({ defaultSort }) => (
  <div>
    <RadioButtonGroup name="sort" defaultSelected={defaultSort}>
      <RadioButton
        value="popularity"
        label="Popularity"
        style={styles.radioButton}
      />
      <RadioButton
        value="commonTags"
        label="Common tags"
        style={styles.radioButton}
      />
      <RadioButton
        value="distance"
        label="Age"
        style={styles.radioButton}
      />
      <RadioButton
        value="age"
        label="Distance"
        style={styles.radioButton}
      />
    </RadioButtonGroup>
  </div>
);

SortBar.propTypes = {
  defaultSort: PropTypes.string.isRequired,
};


SortBar.defaultProps = {
  defaultSort: 'popularity',
};

export default SortBar;
