import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {getLessonIntroPromise} from '../../resources/lessonContent';
import styles from './LessonIntro.scss';

const LessonIntro = ({course, lesson, language, isReadme}) => {
  const LoadableIntro = Loadable({
    loader: () => getLessonIntroPromise(course, lesson, language, isReadme),
    loading: ({error}) => error ? <div>Failed to load intro!</div> : <div>Loading...</div>,
    render: (loaded) => <div className={styles.content} dangerouslySetInnerHTML={{__html: loaded}}/>,
  });
  return <LoadableIntro/>;
};
LessonIntro.propTypes = {
  // ownProps
  course: PropTypes.string.isRequired,
  lesson: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  isReadme: PropTypes.bool.isRequired,
};

export default withStyles(styles)(LessonIntro);
