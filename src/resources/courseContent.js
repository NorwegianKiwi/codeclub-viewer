// TODO: Perhaps use code-splitting / react-loadable / bundle-loader or similar here.

import {getCourseFrontmatter} from './courseFrontmatter';
import {extractFirstPartOfHtml} from '../util';

// lessonSrc/*/index*.md, only frontmatter
// The keys are of the form './course/index*.md'
// Note that the regex should be identical to the one for courseFrontmatter.js.
const courseContentContext =
  require.context('lessonSrc/', true, /^[.][/][^/]+[/]index[^.]*[.]md$/);

/**
 * Return the HTML markup for the course info.
 * @param {string} course E.g. 'scratch'
 * @param {string} language E.g. 'nb'
 * @return {string} HTML markup
 */
export const getCourseInfo = (course, language) => {
  const {key} = getCourseFrontmatter(course, language);
  return key ? courseContentContext(key) : '';
};

/**
 * Get first part of HTML markup for the course.
 * @param {string} course E.g. 'scratch'
 * @param {string} language E.g. 'nb'
 * @returns {string} HTML code to e.g. display in a popover.
 */
export const getCourseIntro = (course, language) => {
  const courseContent = getCourseInfo(course, language);
  const {path} = getCourseFrontmatter(course, language);
  return extractFirstPartOfHtml(courseContent, path);
};
