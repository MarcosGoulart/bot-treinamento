const fs = require('fs');
const jsonc = require('jsonc');

const { ComponentDialog } = require('botbuilder-dialogs');

const { selectResponse } = require('../helpers');

class BaseDialog extends ComponentDialog {
  constructor(id, { luisRecognizer, locale = 'pt-br' }) {
    super(id);

    this.luisRecognizer = luisRecognizer;

    // may be used for i18n related checks
    this.locale = locale;

    const responsesPath = `./locales/${locale}/${id}.jsonc`;
    const responsesExists = fs.existsSync(responsesPath);
    if (responsesExists) {
      this.responses = jsonc.readSync(responsesPath).resources;
    }
  }

  /**
   *
   * @param {string} key - The key of the sentence in the locales file
   * @param {?Object} interpObj - The object with which to interpolate
   */
  getRandomResponse(key, interpObj) {
    return selectResponse(this.responses[key], interpObj);
  }
}

module.exports = BaseDialog;