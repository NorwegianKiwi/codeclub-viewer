import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Loadable from 'react-loadable';
import styles from './Content.scss';
import processContent from '../../processContent';
import {getLessonContentPromise} from '../../resources/lessonContent';

const createMarkup = (lessonContent) => {
  return ({__html: processContent(lessonContent, styles)});
};

const Content = ({course, lesson, language, isReadme}) => {
  const LoadableContent = Loadable({
    loader: () => getLessonContentPromise(course, lesson, language, isReadme),
    loading: () => <div>Loading...</div>,
    render: (loaded) => <div dangerouslySetInnerHTML={createMarkup(loaded)}/>,
  });
  return <LoadableContent/>;
};
Content.propTypes = {
  // ownProps
  course: PropTypes.string.isRequired,
  lesson: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  isReadme: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Content);
