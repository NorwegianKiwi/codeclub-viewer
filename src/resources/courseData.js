import memoize from 'fast-memoize';
import {cleanseTags} from '../util';

// lessonSrc/*/data.yml
const courseDataContext =
  require.context('lessonSrc/', true, /^[.][/][^/]+[/]data[.]yml$/);

// External courses are courses that have 'external' in the frontmatter.
// External courses have no lessons.
// Currently, only external courses have tags, but this could change in the future.

// An example of the structure of courses:
// const courses = {
//   kodegenet: {
//     tags: {
//       topic: ['block_based', 'app'],
//       subject: ['technology', 'programming'],
//       grade: ['secondary', 'junior'],
//     },
//   },
//   khan_academy: {
//     /* ... */
//   },
//   /* ... */
// };
const getCourses = memoize(
  () => {
    const courses = {};
    for (const key of courseDataContext.keys()) {
      const [/* ignore */, course] = key.match(/^[.][/]([^/]+)[/]data[.]yml$/);
      const {tags} = courseDataContext(key);
      courses[course] = {tags: cleanseTags(tags, key)};
    }
    return courses;
  }
);

const getCourseMetadata = (course) => getCourses()[course] || {};

/**
 * Get tags for the course.
 *
 * @param {string} course E.g. 'kodegenet'
 * @returns {object} E.g.
 {
   topic: ['block_based', 'app'],
   subject: ['technology', 'programming'],
   grade: ['secondary', 'junior'],
 }
 */
export const getCourseTags = (course) => getCourseMetadata(course).tags || {};
