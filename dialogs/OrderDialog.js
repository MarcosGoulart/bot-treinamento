const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { dialogs, intents } = require("../config");
const { MessageFactory2, orderHelper, pizzaHelper } = require("../helpers");

const { inspect } =  require("util");

const BaseDialog = require("./BaseDialog");
const PizzaDialog = require("./pizzas/PizzaDialog");
const NumeroDialog = require("./numeros/NumeroDialog");
const TamanhoDialog = require("./tamanhos/TamanhoDialog");
const OrderWrongDialog = require("./OrderWrongDialog");

const TEXT_PROMPT = "orderPrompt";

const MAIN = "orderMain";
let entrouQuatroQueijos = false;

class OrderDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("order", { luisRecognizer, locale });
    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new PizzaDialog({ luisRecognizer, locale }))
      .addDialog(new NumeroDialog({ luisRecognizer, locale }))
      .addDialog(new TamanhoDialog({ luisRecognizer, locale }))
      .addDialog(new OrderWrongDialog({ luisRecognizer, locale }))
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
    console.log("entrou order")
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
    console.log("Pizzas: " + pizzas)
    let numeros = entities.number;
    let tamanho = entities.tamanho;
    if(!pizzas && !numeros && !tamanho){
      console.log("entrou if")
      return await stepContext.beginDialog(dialogs.orderWrong);
    }

    return stepContext.next({ pizzas, numeros, tamanho, topIntent, luisResults });
  }

  async checkPizzaStep(stepContext){
    let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
    console.log("numeros: " + numeros)
    if(topIntent == intents.cancel) {
      await stepContext.context.sendActivity(this.getRandomResponse("bye"));
      return await stepContext.cancelAllDialogs(true);
    }
    if(luisResults){
      const instancesNumeros = luisResults.entities.$instance.number;
      const instancesTamanho = luisResults.entities.$instance.tamanho;

      let positionsNumberStart = pizzaHelper.positionsObjects(instancesNumeros);
      let positionsNumberEnd = pizzaHelper.positionsObjects(instancesNumeros, true);

      let positionsTamanhos = pizzaHelper.positionsObjects(instancesTamanho);
      


      if(positionsNumberStart && positionsTamanhos){
        for(let i = 0; i < positionsNumberStart.length; i++){
          for(let j = 0; j < positionsTamanhos.length; j++){
            if(positionsNumberStart[i] == positionsTamanhos[j]){
              positionsNumberStart.splice(i, 1);
              numeros.splice(i, 1);
            }
          }
        }
      }
      console.log("positionsTamanhos:" + positionsTamanhos)
      console.log("positionsNumberStart:" + positionsNumberStart)
      let tamanhoResultNumber = pizzaHelper.tamanhosResult(positionsTamanhos, positionsNumberStart, positionsNumberEnd, tamanho);
      tamanho = tamanhoResultNumber;
      console.log("tamanho: " + tamanho)
      console.log("numeros: " + numeros)
    }
    console.log("numeros: " + numeros)

    if(!pizzas){
      entrouQuatroQueijos = true;
      return await stepContext.beginDialog(dialogs.pizza, {pizzas, numeros, tamanho, topIntent, luisResults});
    }
    console.log("depois de if !pizza")
    return stepContext.next({ pizzas, numeros, tamanho, topIntent, luisResults });
  }
  async checkNumeroStep(stepContext){
    let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
    console.log("pizzas: " + pizzas)
    console.log("numeros: " + numeros)
    console.log("tamanho: " + tamanho)
    console.log("intents.cancel: " + intents.cancel)
    console.log("luisResults " + inspect(luisResults));

    //const topIntent = this.luisRecognizer.topIntent(luisResults);
    if(topIntent == intents.cancel) {
      await stepContext.context.sendActivity(this.getRandomResponse("bye"));
      return await stepContext.cancelAllDialogs(true);
    }
    if(numeros && !entrouQuatroQueijos){
      numeros = orderHelper.quatroQueijos(pizzas, numeros);
    }
    if(luisResults){
      const instancesNumeros = luisResults.entities.$instance.number;
      const instancesTamanho = luisResults.entities.$instance.tamanho;

      let positionsNumber = pizzaHelper.positionsObjects(instancesNumeros);
      
      let positionsTamanhos = pizzaHelper.positionsObjects(instancesTamanho);
      console.log("positionsTamanhos:" + positionsTamanhos)


      if(positionsNumber && positionsTamanhos){
        for(let i = 0; i < positionsNumber.length; i++){
          for(let j = 0; j < positionsTamanhos.length; j++){
            if(positionsNumber[i] == positionsTamanhos[j]){
              positionsNumber.splice(i, 1);
              numeros.splice(i, 1);
            }
          }
        }
      }
    }
    console.log("passou daqui: " + numeros)
    let temZeroOuNegativo = false;
    if(numeros){
      for(let i = 0; i < numeros.length; i++){
        console.log("entrou for")
        if(numeros[i] <= 0){
          console.log("entrou if")
          temZeroOuNegativo = true;
        }
      }
    }

    if(!numeros){
      return await stepContext.beginDialog(dialogs.numero, {pizzas, numeros, tamanho});
    }else if(numeros.length < pizzas.length || temZeroOuNegativo){
      return await stepContext.beginDialog(dialogs.numero, {pizzas, numeros, tamanho});
    }
    return stepContext.next({ pizzas, numeros, tamanho, topIntent, luisResults });
  }
  async checkTamanhoStep(stepContext){
    let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
    console.log("entrou stepTamanho")
    console.log("tamanho: " + tamanho)
    // const luisResults = await this.luisRecognizer.executeLuisQuery(
    //   stepContext.context
    // );
    console.log(topIntent)
    //const topIntent = this.luisRecognizer.topIntent(luisResults);
    if(topIntent == intents.cancel) {
      await stepContext.context.sendActivity(this.getRandomResponse("bye"));
      return await stepContext.cancelAllDialogs(true);
    }
    let temZero = false;
    if(tamanho){
      for(let i = 0; i < tamanho.length; i++){
        if(tamanho[i] == 0){
          temZero = true;
        }
      }
    }

    if(!tamanho){
      return await stepContext.beginDialog(dialogs.tamanho, {pizzas, numeros, tamanho});
    }else if(tamanho.length < pizzas.length || temZero){
      console.log("entrou ELSEIF tamanho")
      return await stepContext.beginDialog(dialogs.tamanho, {pizzas, numeros, tamanho});
    }
    return stepContext.next({ pizzas, numeros, tamanho, topIntent, luisResults });
  }

  async confirmationStep(stepContext) {
    let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
    //const topIntent = this.luisRecognizer.topIntent(luisResults);
    if(topIntent == intents.cancel) {
      await stepContext.context.sendActivity(this.getRandomResponse("bye"));
      return await stepContext.cancelAllDialogs(true);
    }
    console.log("pizzas: " + pizzas + " Numeros: " + " tamanho: " + tamanho)
    let prompt;
    let text = "Esse é seu pedido? \n";
    if(pizzas.length <= numeros.length && pizzas.length <= tamanho.length){ 
      for(let i = 0; i < pizzas.length; i++){
        if(numeros[i] == 1){
          text += `${numeros[i]} pizza ${tamanho[i]} de ${pizzas[i]} \n`;
        }else{

          text += `${numeros[i]} pizzas ${tamanho[i]}s de ${pizzas[i]} \n`;
        }
      }
      prompt = MessageFactory2.text(text);
    }else{
      prompt = MessageFactory2.text(
        this.getRandomResponse("naoEntendi")
      );
    }
    return await stepContext.prompt(TEXT_PROMPT, { prompt });
  }

  async confirmStep(stepContext){
    let { pizzas, numeros, tamanho } = stepContext.result;
    const luisResults = await this.luisRecognizer.executeLuisQuery(
      stepContext.context
    );
    const topIntent = this.luisRecognizer.topIntent(luisResults);
    if(topIntent == intents.cancel) {
      await stepContext.context.sendActivity(this.getRandomResponse("bye"));
      return await stepContext.cancelAllDialogs(true);
    }
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