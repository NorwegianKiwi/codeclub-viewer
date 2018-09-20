// Inspired by https://github.com/utatti/react-render-html/blob/master/index.js
import React from 'react';
import convertAttr from 'react-attr-converter';
import parse5 from 'parse5';
import styleParser from './styleParser';
import ToggleButton from '../components/Content/ToggleButton';
import ScratchBlocks from '../components/Content/ScratchBlocks';
import Section from '../components/Content/Section';
import Heading1 from '../components/Content/Heading1';
import Heading2 from '../components/Content/Heading2';
import TaskList from '../components/Content/TaskList';
import ScratchText from '../components/Content/ScratchText';

/**
 *
 * The parse5.parseFragment() returns the following tree:
 * {
 *   nodeName: '#document-fragment',
 *   childNodes: [
 *     {
 *       nodeName: 'h1',
 *       tagName: 'h1',
 *       attrs: [
 *         {name: 'class', value: 'myClass'},
 *         ...
 *       ],
 *       namespaceURI: 'http://www.w3.org/1999/xhtml',
 *       childNodes: [
 *         {...},
 *         ...
 *       ],
 *       parentNode: {nodeName: '#document-fragment', childNodes: [ ... ]},
 *     },
 *     {
 *       nodeName: '#text',
 *       value: 'Any text or perhaps a line shift',
 *       parentNode: {nodeName: '#document-fragment', childNodes: [ ... ]},
 *     },
 *     ...
 *   ]
 * }
 */

const getAttribute = (attrs, attrName) => {
  for (let attr of attrs) {
    if (attr.name === attrName) {
      return attr.value;
    }
  }
  return null;
};

const getFirstChildWithTagname = (node, tagName) => {
  for (const child of node.childNodes) {
    if (child.tagName === tagName) {
      return child;
    }
  }
  return null;
};

const getTextContent = (node, defaultValue = '') => {
  if (node) {
    for (const child of node.childNodes) {
      if (child.nodeName === '#text') {
        return child.value;
      }
    }
  }
  return defaultValue;
};

/**
 * nodeName {string} (required) The nodeName (tagName) of the html node to replace
 * className {string|regex}  (optional) Further specification of the html node to replace
 * newElement {string|React-class} (required) The element to render instead of the current html node.
 * attributes {obj|func} (optional) If given, these attributes (props) will be sent to the new element.
 *                       Can also be a function, which gets the current node as an argument. The function
 *                       must return an object.
 * useChildrenOf {node|func} (optional, defaults to the current node).
 *                           Change if you want a different node's children to be send to the new element.
 *                           Set to null if no children are needed.
 *                           Can also be a function, which gets the current node as an argument. The function
 *                           must return a node, or the value null.
 */
const replacements = [
  {
    nodeName: 'script',
    newElement: 'script',
    attributes: (node) => ({
      dangerouslySetInnerHTML: {__html: node.childNodes[0].value},
    }),
    useChildrenOf: null,
  },
  {
    nodeName: 'toggle',
    newElement: ToggleButton,
    attributes: (node) => ({
      buttonText: getTextContent(getFirstChildWithTagname(node, 'strong'), 'Hint'),
    }),
    useChildrenOf: (node) => getFirstChildWithTagname(node, 'hide'),
  },
  {
    nodeName: 'pre',
    className: 'blocks',
    newElement: ScratchBlocks,
    attributes: (node) => ({scratchCode: getTextContent(node)}),
    useChildrenOf: null,
  },
  {
    nodeName: 'code',
    className: 'b',
    newElement: ScratchBlocks,
    attributes: (node) => ({
      scratchCode: getTextContent(node),
      inline: true,
    }),
  },
  {
    nodeName: 'code',
    className: /^block/,
    newElement: ScratchText,
  },
  {
    nodeName: 'section',
    newElement: Section,
  },
  {
    nodeName: 'h1',
    newElement: Heading1,
  },
  {
    nodeName: 'h2',
    newElement: Heading2,
  },
  {
    nodeName: 'section',
    newElement: Section,
  },
  {
    nodeName: 'ul',
    className: 'task-list',
    newElement: TaskList,
  },
];

const AstNodeToReact = (node, key) => {
  const nodeName = node.nodeName;

  if (nodeName === '#text' || nodeName === '#comment') {
    return node.value;
  }

  const className = getAttribute(node.attrs, 'class');
  const attrs = node.attrs.reduce( (result, attr) => {
    const name = convertAttr(attr.name);
    result[name] = name === 'style' ? styleParser(attr.value) : attr.value;
    return result;
  }, {key: key});

  if (node.childNodes.length === 0) {
    return React.createElement(node.tagName, attrs);
  }

  for (const r of replacements) {
    if (r.nodeName === nodeName) {
      if (
        r.className == null || // null or undefined
        typeof r.className === 'string' && r.className === className ||
        r.className instanceof RegExp && r.className.test(className)
      ) {
        const newAttrs = (typeof r.attributes === 'function' ? r.attributes(node) : r.attributes) || {};
        const mergedAttrs = {...attrs, ...newAttrs};
        const useChildrenOf = typeof r.useChildrenOf === 'function' ? r.useChildrenOf(node) : r.useChildrenOf || node;
        if (useChildrenOf) {
          const children = useChildrenOf.childNodes.map(AstNodeToReact);
          return React.createElement(r.newElement, mergedAttrs, children);
        } else {
          return React.createElement(r.newElement, mergedAttrs);
        }
      }
    }
  }

  const children = node.childNodes.map(AstNodeToReact);
  return React.createElement(node.tagName, attrs, children);
};

const htmlToReact = (html) => {
  let htmlAST = parse5.parseFragment(html);
  if (htmlAST.childNodes.length === 0) {
    return null;
  }
  const result = htmlAST.childNodes.map(AstNodeToReact);
  return result.length === 1 ? result[0] : result;
};

export default htmlToReact;
