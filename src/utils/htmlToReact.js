// Taken from https://github.com/utatti/react-render-html/blob/master/index.js
import React from 'react';
import convertAttr from 'react-attr-converter';
import htmlParser from 'parse5';
import styleParser from './styleParser';

const renderNode = (node, key) => {
  if (node.nodeName === '#text') {
    return node.value;
  }

  if (node.nodeName === '#comment') {
    return node.value;
  }

  const attr = node.attrs.reduce(function (result, attr) {
    const name = convertAttr(attr.name);
    result[name] = name === 'style' ? styleParser(attr.value) : attr.value;
    return result;
  }, {key: key});

  if (node.childNodes.length === 0) {
    return React.createElement(node.tagName, attr);
  }

  if (node.nodeName === 'script') {
    attr.dangerouslySetInnerHTML = {__html: node.childNodes[0].value};
    return React.createElement('script', attr);
  }

  const children = node.childNodes.map(renderNode);
  return React.createElement(node.tagName, attr, children);
};

const htmlToReact = (html) => {
  const htmlAST = htmlParser.parseFragment(html);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  const result = htmlAST.childNodes.map(renderNode);

  return result.length === 1 ? result[0] : result;
};

export default htmlToReact;
