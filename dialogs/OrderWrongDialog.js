const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");
const { dialogs, intents } = require("../config");

const { MessageFactory2 } = require("../helpers");

const BaseDialog = require("./BaseDialog");
const MenuDialog = require("./MenuDialog");

const WATERFALL_DIALOG = "WaterfallDialog";

const TEXT_PROMPT = "orderWrongPrompt";

const MAIN = "orderWrongMain";

class OrderWrongDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("orderWrong", { luisRecognizer, locale });
    this.addDialog(new TextPrompt(TEXT_PROMPT))
    //.addDialog(new MenuDialog({ luisRecognizer, locale}))
    .addDialog(
      new WaterfallDialog(MAIN, [
        this.aboutOrderWrong.bind(this),
        this.menuOrderWrong.bind(this),
        this.redirectedWrong.bind(this),
        this.endStep.bind(this)
      ])
    );

    this.initialDialogId = MAIN;
  }

  async aboutOrderWrong(stepContext) {
    console.log("entrou orderWrong")
    await stepContext.context.sendActivity(
      this.getRandomResponse("orderWrong")
    );
    return stepContext.next();
  }

  async menuOrderWrong(stepContext){
    console.log("entrou menu wrong")
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
      this.getRandomResponse("showMenu")
    );
    return await stepContext.prompt(TEXT_PROMPT, { prompt });
  }

  async redirectedWrong(stepContext){
    console.log("entrou redirect")
    const luisResults = await this.luisRecognizer.executeLuisQuery(
      stepContext.context
    );
    const topIntent = this.luisRecognizer.topIntent(luisResults);
    if(topIntent == intents.cancel) {
      await stepContext.context.sendActivity(this.getRandomResponse("bye"));
      return await stepContext.cancelAllDialogs(true);
    }
    const entities = this.luisRecognizer.getEntities(luisResults);
    let pizzas = entities.pizzas;
    let numeros = entities.number;
    let tamanho = entities.tamanho;
    if(!pizzas && !numeros && !tamanho){
        return await stepContext.replaceDialog(dialogs.orderWrong);
    }
    return stepContext.next({ pizzas, numeros, tamanho, topIntent, luisResults });
  }

  async endStep(stepContext) {
    let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
    return stepContext.endDialog({ pizzas, numeros, tamanho, topIntent, luisResults});
  }
}

module.exports = OrderWrongDialog;