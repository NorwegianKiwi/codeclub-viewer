import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Section.scss';

const Section = ({type, children}) => {
  return <section className={styles[type] || type || null}>
    {children}
  </section>;
};

Section.propTypes = {
  type: PropTypes.string,
};

export default withStyles(styles)(Section);
