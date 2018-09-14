import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './TaskList.scss';

const TaskList = ({children}) => {
  return <ul className={styles.checkboxList}>
    {children}
  </ul>;
};

export default withStyles(styles)(TaskList);
