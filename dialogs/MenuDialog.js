const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

//const { menuAPI } = require("../api");
const { dialogs, intents } = require("../config");
const { MessageFactory2 } = require("../helpers");

const BaseDialog = require("./BaseDialog");
const OrderDialog = require("./OrderDialog");

const TEXT_PROMPT = "menuPrompt";

const MAIN = "menuMain";

class MenuDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("menu", { luisRecognizer, locale });
    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new OrderDialog({ luisRecognizer, locale }))
      .addDialog(
        new WaterfallDialog(MAIN, [
          this.showMenuStep.bind(this),
          this.redirectedOrder.bind(this),
          this.endStep.bind(this)
        ])
      );

    this.initialDialogId = MAIN;
  }

  async showMenuStep(stepContext){
    const prompt = MessageFactory2.suggestedActions([
        this.getRandomResponse("brigadeiro"),
        this.getRandomResponse("calabresa"),
        this.getRandomResponse("frango com catupiry"),
        this.getRandomResponse("marguerita"),
        this.getRandomResponse("muçarela"),
        this.getRandomResponse("napolitana"),
        this.getRandomResponse("palmito"),
        this.getRandomResponse("portuguesa"),
        this.getRandomResponse("quatro queijos"),
        this.getRandomResponse("romeu e julieta"),
    ],
      this.getRandomResponse("showMenu"),
    );
    return stepContext.prompt(TEXT_PROMPT, { prompt });
  }

  async redirectedOrder(stepContext){
    const luisResults = await this.luisRecognizer.executeLuisQuery(
      stepContext.context
    );
    const topIntent = this.luisRecognizer.topIntent(luisResults);
    if(topIntent == intents.cancel) {
      await stepContext.context.sendActivity(this.getRandomResponse("bye"));
      return await stepContext.cancelAllDialogs(true);
    }
    return stepContext.beginDialog(dialogs.order, {luisResults});
  }

  async endStep(stepContext) {
    return stepContext.endDialog();
  }
}

module.exports = MenuDialog;
