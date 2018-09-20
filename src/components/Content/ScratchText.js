import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './ScratchText.scss';

const ScratchText = ({children, className}) => {
  return <code className={styles[className] || className || null}>
    {children}
  </code>;
};

ScratchText.propTypes = {
  className: PropTypes.string,
};

export default withStyles(styles)(ScratchText);
