import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './ScratchText.scss';

const ScratchText = ({children, type}) => {
  return <code className={styles[type] || type || null}>
    {children}
  </code>;
};

ScratchText.propTypes = {
  type: PropTypes.string,
};

export default withStyles(styles)(ScratchText);
