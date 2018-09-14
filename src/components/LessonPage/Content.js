import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Content.scss';
import htmlToReact from '../../utils/htmlToReact';
import {getLessonContent} from '../../resources/lessonContent';


const Content = ({course, lesson, language, isReadme}) => {
  const lessonContent = getLessonContent(course, lesson, language, isReadme);
  return (
    <div className={styles.container}>
      {htmlToReact(lessonContent)}
    </div>
  );
};

Content.propTypes = {
  // ownProps
  course: PropTypes.string.isRequired,
  lesson: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  isReadme: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Content);
