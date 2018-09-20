import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Heading1.scss';

const Heading1 = ({className, children}) => {
  return <h1 className={styles[className] || className || null}>
    {children}
  </h1>;
};

Heading1.propTypes = {
  className: PropTypes.string,
};

export default withStyles(styles)(Heading1);
