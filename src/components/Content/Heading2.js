import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Heading2.scss';

const icons = {
  'check': require('assets/graphics/check.svg'),
  'flag': require('assets/graphics/flag.svg'),
  'save': require('assets/graphics/save.svg'),
};
const iconTypes = Object.keys(icons);

const Heading2 = ({type, children}) => {
  return <h2 className={styles[type] || null}>
    {iconTypes.includes(type) ? <img src={icons[type]} className={styles.img} alt={type}/> : null}
    {children}
  </h2>;
};

Heading2.propTypes = {
  type: PropTypes.string,
};

export default withStyles(styles)(Heading2);
