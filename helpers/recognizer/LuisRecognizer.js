// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { LuisRecognizer } = require("botbuilder-ai");

const fixLuisResult = require("./fixLuisResult");

class Recognizer {
  constructor(config) {
    const luisIsConfigured =
      config && config.applicationId && config.endpointKey && config.endpoint;
    if (luisIsConfigured) {
      this.recognizer = new LuisRecognizer(config, {
        includeAllIntents: true,
        includeInstanceData: true
      }, true);
    }
  }

  get isConfigured() {
    return this.recognizer !== undefined;
  }

  /**
   * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
   * @param {stepContext} context
   */
  async executeLuisQuery(context) {
    //console.log(this.recognizer);
    return await this.recognizer.recognize(context);
  }

  topIntent(result) {
    console.log(result.intents);
    const intentName = Object.keys(result.intents)[0];
    const intent = result.intents[intentName];
    if (intent.score < 0.2) {
      return "None";
    }
    return intentName;
  }

  getEntities(result) {
    return fixLuisResult(result).entities;
  }
}

module.exports = Recognizer;
