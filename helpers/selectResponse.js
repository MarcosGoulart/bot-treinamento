const _ = require('lodash');

const randomItem = list => list[_.random(list.length - 1)];

/**
 * @param {string | string[]} list - The array of possible responses to select or the response itself
 * @param {?Object} interpObj - The object of values with which to interpolate
 * @returns {string | {text: string, speak: string}} The selected string or an ordered pair (text, speech)
 */
module.exports = (list, interpObj = {}) => {
  const rawResult = _.isString(list) ? list : randomItem(list);
  return _.isString(rawResult)
    ? _.template(rawResult)(interpObj)
    : {
        text: _.template(rawResult.text)(interpObj),
        speak: _.template(rawResult.speak)(interpObj)
      };
};
