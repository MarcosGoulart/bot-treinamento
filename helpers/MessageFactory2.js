const _ = require('lodash');
const { MessageFactory } = require('botbuilder');

class MessageFactory2 extends MessageFactory {
 /* static attachment(attachment, msgObj, inputHint) {
    const maybeMsgText = _.isString(msgObj) && msgObj;
    if (maybeMsgText) {
      return super.attachment(attachment, maybeMsgText, undefined, inputHint);
    }
    return super.attachment(
      attachment,
      msgObj && msgObj.text,
      msgObj && msgObj.speak,
      inputHint
    );
  }

  static carousel(attachments, msgObj, inputHint) {
    const maybeMsgText = _.isString(msgObj) && msgObj;
    if (maybeMsgText) {
      return super.carousel(attachments, maybeMsgText, undefined, inputHint);
    }
    return super.carousel(
      attachments,
      msgObj && msgObj.text,
      msgObj && msgObj.speak,
      inputHint
    );
  }

  static contentUrl(url, contentType, name, msgObj, inputHint) {
    const maybeMsgText = _.isString(msgObj) && msgObj;
    if (maybeMsgText) {
      return super.contentUrl(
        url,
        contentType,
        name,
        maybeMsgText,
        undefined,
        inputHint
      );
    }
    return super.contentUrl(
      url,
      contentType,
      name,
      msgObj && msgObj.text,
      msgObj && msgObj.speak,
      inputHint
    );
  }

  static list(attachments, msgObj, inputHint) {
    const maybeMsgText = _.isString(msgObj) && msgObj;
    if (maybeMsgText) {
      return super.list(attachments, maybeMsgText, undefined, inputHint);
    }
    return super.list(
      attachments,
      msgObj && msgObj.text,
      msgObj && msgObj.speak,
      inputHint
    );
  } */

  static suggestedActions(actions, msgObj, inputHint) {
    const maybeMsgText = _.isString(msgObj) && msgObj;
    if (maybeMsgText) {
      return super.suggestedActions(
        actions,
        maybeMsgText,
        undefined,
        inputHint
      );
    }
    return super.suggestedActions(
      actions,
      msgObj && msgObj.text,
      msgObj && msgObj.speak,
      inputHint
    );
  }

  static text(msgObj, inputHint) {
    const maybeMsgText = _.isString(msgObj) && msgObj;
    if (maybeMsgText) {
      return super.text(maybeMsgText, undefined, inputHint);
    }
    return super.text(msgObj && msgObj.text, msgObj && msgObj.speak, inputHint);
  } 
}

module.exports = MessageFactory2;
