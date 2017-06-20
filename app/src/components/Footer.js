import React from 'react';
import { Link } from 'react-router-dom';
// import { northwesternPurple, richBlack10 } from '../colors';
// import facebook from '../images/facebook.png';
// import github from '../images/github-circle.png';

const style = {
  background: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  panel: {
    width: '300px',
    margin: '25px',
    color: 'black',
  },
  icon: {
    marginRight: '10px',
  },
  anchorColor: {
    color: 'black',
  },
};

const Footer = () => (
  <div style={style.background}>
    <div style={style.panel}>
      <h1 style={{ marginTop: 0 }}>Matcha</h1>
      <p>&copy; 2017 <a style={style.anchorColor} href="http://github.com/rmonnier">Robin Monnier</a></p>
    </div>
    <div style={style.panel}>
      <a href="https://github.com/rmonnier/matcha-dating-app"><img src="/df" alt="Github" style={style.icon} /></a>
    </div>
    <div style={style.panel}>
      <Link to="/"><p style={style.anchorColor}>Matcha</p></Link>
    </div>
  </div>
);

export default Footer;
