import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import styles from './CourseItem.scss';
import useStyles from 'isomorphic-style-loader/useStyles';
import Link from 'react-router/lib/Link';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import PopoverComponent from '../PopoverComponent';
import Flag from '../Flag';
import LessonCount from './LessonCount';
import {getShowFiltergroups} from '../../selectors/playlist';
import {getCourseIntro} from '../../resources/courseContent';
import {getCourseIcon} from '../../resources/courseIcon';
import {onlyCheckedMainLanguage} from '../../selectors/filter';
import {getCourseExternalLink, getCourseTitle} from '../../resources/courseFrontmatter';
import {getLanguageIndependentCoursePath} from '../../resources/courses';
import {getTranslator} from '../../selectors/translate';

const CourseItem = ({course, language}) => {
  useStyles(styles);

  const showLessonCount = useSelector(state => getShowFiltergroups(state));
  const isOnlyCheckedMainLanguage = useSelector(state => onlyCheckedMainLanguage(state));
  const t = useSelector(state => getTranslator(state));

  const courseTitle = getCourseTitle(course, language);
  const externalLink = getCourseExternalLink(course, language);
  const popoverContent = getCourseIntro(course, language);
  const popoverButton = popoverContent ?
    <PopoverComponent {...{popoverContent}}>
      <Button bsSize='xs' className={styles.popButton} aria-label={t('general.glyphicon', {title: courseTitle})}>
        <Glyphicon className={styles.popoverGlyph} glyph='info-sign'/>
      </Button>
    </PopoverComponent>
    : null;
  const courseIcon = (
    <img
      className={styles.courseLogo}
      src={getCourseIcon(course)}
      alt={t('general.picture', {title: courseTitle})}
    />
  );
  return (
    <div>
      {externalLink ?
        <a className={styles.courseItem} href={externalLink} target='_blank' rel='noopener'>
          {courseIcon}
          <span className={styles.courseName}>
            {courseTitle}
            {popoverButton}
            <Glyphicon className={styles.externalGlyph} glyph='new-window'/>
          </span>
          {!isOnlyCheckedMainLanguage ? <span><Flag language={language}/></span> : null}
        </a>
        :
        <Link className={styles.courseItem} to={getLanguageIndependentCoursePath(course)}>
          {courseIcon}
          <span className={styles.courseName}>{courseTitle}{popoverButton}</span>
          {showLessonCount ? <LessonCount {...{course}}/> : null}
        </Link>
      }
    </div>);
};

CourseItem.propTypes = {
  course: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export default CourseItem;
