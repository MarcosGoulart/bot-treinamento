const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { MessageFactory2, UserProfile } = require("../../helpers");
const { dialogs } = require("../../config");

const BaseDialog = require("../BaseDialog");
const OrderPizzaNumberDialog = require("./OrderPizzaNumberDialog");


const TEXT_PROMPT = "textTamanhoPrompt";

const MAIN = "tamanhoMain";

class TamanhoDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("tamanho", { luisRecognizer, locale });
    this.addDialog(new TextPrompt(TEXT_PROMPT))
    .addDialog(new OrderPizzaNumberDialog({luisRecognizer, locale }))
      .addDialog(
        new WaterfallDialog(MAIN, [
          this.askAboutTamanho.bind(this),
          //this.extractingSizes.bind(this),
          this.endStep.bind(this)
        ])
      );
  
    this.initialDialogId = MAIN;
  }

  async askAboutTamanho(stepContext){
    let {pizzas, numeros, tamanho } = stepContext.options;

    console.log("Entrou Tamanhos")
    if(pizzas && numeros){
      let userProfile = new UserProfile(0);
      return await stepContext.beginDialog(dialogs.orderPizzaNumber, {pizzas, numeros, tamanho, userProfile});
    }
    return stepContext.next(pizzas, numeros, tamanho);
  }
  // async extractingSizes(stepContext){
  //   let { pizzas, numeros } = stepContext.options;
  //   const luisResults = await this.luisRecognizer.executeLuisQuery(
  //       stepContext.context
  //   );
  //   const entities = this.luisRecognizer.getEntities(luisResults);
  //   let tamanho = entities.tamanho;
  //   if(tamanho){
  //     if(tamanho.length >= pizzas.length){
  //       stepContext.options.pizzas = pizzas;
  //       stepContext.options.numeros = numeros;
  //       stepContext.options.tamanho = tamanho;
  //       return stepContext.next(pizzas, numeros, tamanho);
  //     }
  //   }
  //   return stepContext.replaceDialog("tamanho", stepContext.options);
  // }
  async endStep(stepContext) {
    let { pizzas, numeros, tamanho } = stepContext.result;
    return stepContext.endDialog({ pizzas, numeros, tamanho});
  }
}

module.exports = TamanhoDialog;