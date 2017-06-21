import React from 'react';
import TagsInput from 'react-tagsinput';
import InputRange from 'react-input-range';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import 'react-input-range/lib/css/index.css';

import SortBar from '../components/SortBar';

const style = {
  margin: 12,
};

const SearchParams = ({
    message,
    name,
    updateName,
    tags,
    updateTags,
    ageVal,
    updateAge,
    distVal,
    updateDist,
    popVal,
    updatePop,
  }) => (
    <div className="search-params">
      <div className="errorMessageMain">{message}</div>
      <div className="rightSearch">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            floatingLabelText="Name or username"
            value={name}
            onChange={updateName}
          />
          <SelectField
            floatingLabelText="Distance :"
            value={distVal}
            onChange={updateDist}
          >
            <MenuItem value={'0to15'} primaryText="From 0 to 15km" />
            <MenuItem value={'to50'} primaryText="Until 50km" />
            <MenuItem value={'to150'} primaryText="Until 150km" />
          </SelectField><br />
          <SelectField
            floatingLabelText="Age :"
            value={ageVal}
            onChange={updateAge}
          >
            <MenuItem value={'18to30'} primaryText="18 to 30 years old" />
            <MenuItem value={'30to50'} primaryText="30 to 45 years old" />
            <MenuItem value={'from50'} primaryText="45 and beyond" />
          </SelectField><br />
        </div>
        <div className="leftSearch">
          <TagsInput value={tags} onChange={updateTags} />
        </div>
        <label htmlFor="inputPopularity" className="sr-only">Popularity</label>
        <InputRange maxValue={100} minValue={0} value={popVal} onChange={updatePop} />
        <br />
      </div>
      <SortBar defaultSort={'popularity'} />
      <RaisedButton
        style={style}
        type="submit"
        label="SEARCH"
        primary
      />
    </div>
  );

export default SearchParams;
