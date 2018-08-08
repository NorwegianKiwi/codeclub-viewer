/* eslint-env node */

const publicPath = process.env.PUBLICPATH;

/**
 * Process parsed HTML object
 * @param {object} refObj Parsed HTML object
 * @param  {object} options Options object
 * @returns {object}
 */
const processObject = (refObj, options) => {
  let obj = refObj;
  if (obj['tag'] === 'a') {
    const oldHref = (obj['attrs'] || {})['href'];
    if (oldHref && typeof oldHref === 'string') {
      if (!oldHref.startsWith('http:') && !oldHref.startsWith('https:')) {
        const baseurl = `${publicPath}${options.baseurl.slice(1)}`;
        let href = `${baseurl}${oldHref.startsWith('/') ? '' : '/'}${oldHref}`;
        if (href.endsWith('.html')) { href = href.slice(0, -5); }
        if (href !== oldHref) {
          obj = {
            ...obj,
            attrs: {
              ...obj['attrs'],
              href,
            }
          };
        }
      }
    }
  }
  return {
    ...obj,
    content: walkParsedHtmlRecursively(obj['content'], options),
  };
};

/**
 * Walk recursively through parsed HTML object
 * @param {object} obj Parsed HTML object
 * @param  {object} options Options object
 * @returns {object}
 */
const walkParsedHtmlRecursively = (obj, options) => {
  if (Array.isArray(obj)) {
    return obj.map(val => walkParsedHtmlRecursively(val, options));
  } else if (typeof obj === 'object' && obj !== null) {
    return processObject(obj, options);
  } else {
    return obj;
  }
};

/**
 * Process course info html
 * @param {string} content Original HTML
 * @param {object} options Options object of the form
 * {
 *   baseurl: /scratch
 * }
 * @returns {string} The HTML as a string
 */
export const processCourseInfo = (content, options) => {
  const parser = require('posthtml-parser');
  const render = require('posthtml-render');

  let parsedContent = parser(content);
  parsedContent = walkParsedHtmlRecursively(parsedContent, options);
  content = render(parsedContent);
  // TODO: Instead of "render", perhaps make a function that takes the AST tree and renders into React components?
  //       Compare size of parse5 (https://github.com/inikulin/parse5)
  //       and posthtml-parser (https://github.com/posthtml/posthtml-parser)
  //       Both should be creating AST trees.
  //       See https://github.com/utatti/react-render-html/blob/master/index.js for how it can be done.
  //       Since we want to manipulate the AST tree before creating react components, we probably don't want
  //       to use react-render-html directly.
  //       But the code shows how to render AST trees using React.createElement.
  //       This way we can probably avoid using dangerouslySetInnerHtml for courseInfo and content!
  //       The code that converts AST tree to React could probably also exchange a-tags with certain hrefs into
  //       NavLink nodes.
  return content;
};
