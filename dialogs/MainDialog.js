// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const _ = require("lodash");

const { MessageFactory2 } = require("../helpers");
const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const BaseDialog = require("./BaseDialog");
const { intents, dialogs } = require("../config");
const MenuDialog = require("./MenuDialog");
const HelpDialog = require("./HelpDialog");
const GreetingDialog = require("./GreetingDialog");
const NoneDialog = require("./NoneDialog");
const OrderDialog = require("./OrderDialog");

const TEXT_PROMPT = "mainTextPrompt";
const MAIN_WATERFALL_DIALOG = "mainWaterfallDialog";

class MainDialog extends BaseDialog {
  constructor({ luisRecognizer, userStateAccessor, locale }) {
    super("main", { luisRecognizer, locale });

    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(
        new MenuDialog({
          luisRecognizer,
          locale
        })
      )
      .addDialog(new HelpDialog({ locale }))
      .addDialog(
        new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
          this.introStep.bind(this),
          this.actStep.bind(this),
          this.repeatStep.bind(this)
        ])
      )
      .addDialog(new GreetingDialog({ locale }))
      .addDialog(new NoneDialog({ locale }))
      .addDialog(
        new OrderDialog({
          luisRecognizer,
          locale
        })
      );

    this.initialDialogId = MAIN_WATERFALL_DIALOG;

    this.userStateAccessor = userStateAccessor;
  }

  async introStep(stepContext) {
    const prompt = MessageFactory2.suggestedActions(
      [
        this.getRandomResponse("suggestedYes"),
        this.getRandomResponse("suggestedNo"),
        this.getRandomResponse("suggestedHelp"),
        this.getRandomResponse("suggestedQuit")
      ],
      this.getRandomResponse("howCanIHelpHead")
    );

    return await stepContext.prompt(TEXT_PROMPT, { prompt });
  }

  async actStep(stepContext) {
    //console.log("context: " + JSON.stringify(stepContext.context));
    
    const luisResults = await this.luisRecognizer.executeLuisQuery(
      stepContext.context
    );
    //const entities = this.luisRecognizer.getEntities(luisResults);
   // console.log(entities);
    const topIntent = this.luisRecognizer.topIntent(luisResults);
    
    // clear
    //console.log("User intent: ", stepContext.context);
    await this.userStateAccessor.delete(stepContext.context);

    console.log("User intent: ", topIntent);
   // console.log("step context: ", stepContext);
    switch (topIntent) {
      case intents.cancel:
        await stepContext.context.sendActivity(this.getRandomResponse("bye"));
        return await stepContext.endDialog();
      case intents.negative:
        await stepContext.context.sendActivity(this.getRandomResponse("bye"));
        return await stepContext.endDialog();
      case intents.positive:
        return await stepContext.beginDialog(dialogs.menu, { luisResults });
      case intents.help:
        return await stepContext.beginDialog(dialogs.help);
      case intents.menu:
        return await stepContext.beginDialog(dialogs.menu, { luisResults });
      case intents.order:
        return await stepContext.beginDialog(dialogs.order, { luisResults });
      case intents.saudar:
        return await stepContext.beginDialog(dialogs.saudar);
      default:
        return await stepContext.beginDialog(dialogs.none);
    }
  }

  async repeatStep(stepContext) {
    return await stepContext.beginDialog(MAIN_WATERFALL_DIALOG);
  }
}

module.exports = MainDialog;