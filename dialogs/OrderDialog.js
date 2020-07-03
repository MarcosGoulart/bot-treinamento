const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { dialogs } = require("../config");
const { MessageFactory2, orderHelper } = require("../helpers");

const BaseDialog = require("./BaseDialog");
const PizzaDialog = require("./pizzas/PizzaDialog");
const NumeroDialog = require("./numeros/NumeroDialog");
const TamanhoDialog = require("./tamanhos/TamanhoDialog");

const TEXT_PROMPT = "orderPrompt";

const MAIN = "orderMain";

class OrderDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("order", { luisRecognizer, locale });
    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new PizzaDialog({ luisRecognizer, locale }))
      .addDialog(new NumeroDialog({ luisRecognizer, locale }))
      .addDialog(new TamanhoDialog({ luisRecognizer, locale }))
      .addDialog(
        new WaterfallDialog(MAIN, [
          this.checkStep.bind(this),
          this.checkPizzaStep.bind(this),
          this.checkNumeroStep.bind(this),
          this.checkTamanhoStep.bind(this),
          this.confirmationStep.bind(this),
          this.confirmStep.bind(this),
          this.endStep.bind(this)
        ])
      );

    this.initialDialogId = MAIN;
  }

  async checkStep(stepContext){
    const luisResults = await this.luisRecognizer.executeLuisQuery(
      stepContext.context
    );
    const entities = this.luisRecognizer.getEntities(luisResults);
    let pizzas = entities.pizzas;
    let numeros = entities.number;
    let tamanho = entities.tamanho;

    return stepContext.next({ pizzas, numeros, tamanho });
  }

  async checkPizzaStep(stepContext){
    let { pizzas, numeros, tamanho } = stepContext.result;

    if(!pizzas){ 
      return await stepContext.beginDialog(dialogs.pizza, {pizzas, numeros, tamanho});
    }
    return stepContext.next({ pizzas, numeros, tamanho });
  }
  async checkNumeroStep(stepContext){
    let { pizzas, numeros, tamanho } = stepContext.result;

    numeros = orderHelper.quatroQueijos(pizzas, numeros);
  
    if(!numeros){
      return await stepContext.beginDialog(dialogs.numero, {pizzas, numeros, tamanho});
    }else if(numeros.length < pizzas.length){
      return await stepContext.beginDialog(dialogs.numero, {pizzas, numeros, tamanho});
    }
    return stepContext.next({ pizzas, numeros, tamanho });
  }
  async checkTamanhoStep(stepContext){
    let { pizzas, numeros, tamanho } = stepContext.result;
    if(!tamanho){
      return await stepContext.beginDialog(dialogs.tamanho, {pizzas, numeros, tamanho});
    }else if(tamanho.length < pizzas.length){
      return await stepContext.beginDialog(dialogs.tamanho, {pizzas, numeros, tamanho});
    }
    return stepContext.next({ pizzas, numeros, tamanho });
  }

  async confirmationStep(stepContext) {
    let { pizzas, numeros, tamanho } = stepContext.result;
    console.log("pizzas: " + pizzas + "Numeros: " + "tamanho: " + tamanho)

    let text = "Esse é seu pedido? \n";
    if(pizzas.length <= numeros.length && pizzas.length <= tamanho.length){ 
      for(let i = 0; i < pizzas.length; i++){
        text += `${numeros[i]} pizza(s) ${tamanho[i]}(s) de ${pizzas[i]} \n`;
      }
    }
    const prompt = MessageFactory2.text(text);
    return await stepContext.prompt(TEXT_PROMPT, { prompt });
  }

  async confirmStep(stepContext){
    let { pizzas, numeros, tamanho } = stepContext.result;
    const luisResults = await this.luisRecognizer.executeLuisQuery(
      stepContext.context
    );
    const entities = this.luisRecognizer.getEntities(luisResults);
    let positive = entities.positive;
    let negative = entities.negative;

    console.log("Positive: " + positive)
    console.log("Negative: " + negative)
    
    if(positive){
      await stepContext.context.sendActivity(this.getRandomResponse("positive"));
    }else if(negative){
      await stepContext.context.sendActivity(this.getRandomResponse("negative"));
    }
    return stepContext.next();
  }

  async endStep(stepContext) {
    return stepContext.endDialog();
  }
}

module.exports = OrderDialog;