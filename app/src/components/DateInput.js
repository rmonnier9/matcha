import React from 'react';

const DateInput = () => (
  <div className="date">
    <div className="dateInputs">
      <input type="number" className="textInp dateInp" name="day" min={1} max={31} placeholder="DAY" />
      <select name="month" className="dateInp">
        <option value="01">JANUARY</option>
        <option value="02">FEBRUARY</option>
        <option value="03">MARCH</option>
        <option value="04">APRIL</option>
        <option value="05">MAY</option>
        <option value="06">JUNE</option>
        <option value="07">JULY</option>
        <option value="08">AUGUST</option>
        <option value="09">SEPTEMBER</option>
        <option value="10">OCTOBER</option>
        <option value="11">NOVEMBER</option>
        <option value="12">DECEMBER</option>
      </select>
      <input type="number" className="textInp dateInp" placeholder="YEAR" name="year" />
    </div>
  </div>
);

export default DateInput;
