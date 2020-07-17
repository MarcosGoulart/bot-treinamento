const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, UserProfile } = require("../../helpers");

const { dialogs } = require("../../config");

const BaseDialog = require("../BaseDialog");
const OrderNumberSizeDialog = require("./OrderNumberSizeDialog");
const OrderNumberDialog = require("./OrderNumberDialog");
const OrderSizeDialog = require("./OrderSizeDialog");

const TEXT_PROMPT = "pizzaPrompt";

const MAIN = "pizzaMain";

class PizzaDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("pizza", { luisRecognizer, locale });
    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new OrderNumberSizeDialog({luisRecognizer, locale }))
      .addDialog(new OrderNumberDialog({luisRecognizer, locale }))
      .addDialog(new OrderSizeDialog({luisRecognizer, locale }))
      .addDialog(
        new WaterfallDialog(MAIN, [
          this.askAboutPizza.bind(this),
          this.endStep.bind(this)
        ])
      );
  
    this.initialDialogId = MAIN;
  }

  async askAboutPizza(stepContext){
    let {pizzas, numeros, tamanho } = stepContext.options;
    console.log("Entrou Pizzas")
    if(numeros && tamanho){
      console.log("Entrou Pizzas NUMERO TAMANHO")
      let userProfile = new UserProfile(0);
      return await stepContext.beginDialog(dialogs.orderNumberSize, {pizzas, numeros, tamanho, userProfile});
    }
    if(numeros){
      console.log("Entrou Pizzas NUMERO")
      let userProfile = new UserProfile(0);
      return await stepContext.beginDialog(dialogs.orderNumber, {pizzas, numeros, tamanho, userProfile});
    }
    if(tamanho){
      console.log("Entrou Pizzas TAMANHO")
      let userProfile = new UserProfile(0);
      return await stepContext.beginDialog(dialogs.orderSize, {pizzas, numeros, tamanho, userProfile});
    }
    return stepContext.next(pizzas, numeros, tamanho);
  }

  async endStep(stepContext) {
    let { pizzas, numeros, tamanho } = stepContext.result;
    console.log("end Step pizzas: " + pizzas)
    console.log("end Step numeros: " + numeros)
    console.log("end Step tamanho: " + tamanho)
    return stepContext.endDialog({ pizzas, numeros, tamanho});
  }
}

module.exports = PizzaDialog;