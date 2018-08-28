// Taken from https://github.com/utatti/react-render-html/blob/master/lib/style-parser.js
const hyphenToCamelcase = (str) => {
  let result = '';
  let upper = false;

  for (let i = 0; i < str.length; i++) {
    let c = str[i];

    if (c === '-') {
      upper = true;
      continue;
    }

    if (upper) {
      c = c.toUpperCase();
      upper = false;
    }

    result += c;
  }

  return result;
};

const convertKey = (key) => {
  let res = hyphenToCamelcase(key);

  if (key.indexOf('-ms-') === 0) {
    res = res[0].toLowerCase() + res.slice(1);
  }

  return res;
};

const styleParser = (styleStr) => {
  return styleStr
    .split(';')
    .reduce(function (res, token) {
      if (token.slice(0, 7) === 'base64,') {
        res[res.length - 1] += ';' + token;
      } else {
        res.push(token);
      }
      return res;
    }, [])
    .reduce(function (obj, str) {
      const tokens = str.split(':');
      const key = tokens[0].trim();
      if (key) {
        obj[convertKey(key)] = tokens.slice(1).join(':').trim();
      }
      return obj;
    }, {});
};

export default styleParser;
