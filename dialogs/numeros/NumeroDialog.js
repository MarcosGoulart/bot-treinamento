const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, UserProfile } = require("../../helpers");
const { dialogs } = require("../../config");

const BaseDialog = require("../BaseDialog");
const OrderPizzaSizeDialog = require("./OrderPizzaSizeDialog");

const TEXT_PROMPT = "textNumeroPrompt";

const MAIN = "numeroMain";

class NumeroDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("numero", { luisRecognizer, locale });
    this.addDialog(new TextPrompt(TEXT_PROMPT))
    .addDialog(new OrderPizzaSizeDialog({luisRecognizer, locale }))
      .addDialog(
        new WaterfallDialog(MAIN, [
          this.askAboutNumero.bind(this),
        //  this.extractingQuantities.bind(this),
          this.endStep.bind(this)
        ])
      );
  
    this.initialDialogId = MAIN;
  }

  async askAboutNumero(stepContext){
    let {pizzas, numeros, tamanho } = stepContext.options;
    console.log("Entrou Numeros")
    if(pizzas){
      let userProfile = new UserProfile(0);
      return await stepContext.beginDialog(dialogs.orderPizzaSize, {pizzas, numeros, tamanho, userProfile});
    }
    return stepContext.next(pizzas, numeros, tamanho);
  }

  //   let { pizzas, tamanho } = stepContext.options;
  //   let text = "Quantas pizzas você quer de cada um desses sabores? \n";
  //   let quantidadeNumeros = pizzas.length;
  //   for(let i = 0; i < quantidadeNumeros; i++){
  //     text += `* ${pizzas[i]} \n`;
  //   }
  //   const prompt = MessageFactory2.text(text);
  //   return await stepContext.prompt(TEXT_PROMPT, { prompt }); 
  // }
  // async extractingQuantities(stepContext){
  //   let { pizzas, tamanho } = stepContext.options;

  //   const luisResults = await this.luisRecognizer.executeLuisQuery(
  //       stepContext.context
  //   );
  //   const entities = this.luisRecognizer.getEntities(luisResults);
  //   let numeros = entities.number;
  //   if(numeros){
  //     if(numeros.length >= pizzas.length){
  //       stepContext.options.pizzas = pizzas;
  //       stepContext.options.numeros = numeros;
  //       stepContext.options.tamanho = tamanho;
  //       return stepContext.next(pizzas, numeros, tamanho);
  //     }
  //   }
  //   return stepContext.replaceDialog("numero", stepContext.options);
  // }
  async endStep(stepContext) {
    console.log(inspect(stepContext.result))
    let { pizzas, numeros, tamanho } = stepContext.result;
    return stepContext.endDialog({ pizzas, numeros, tamanho});
  }
}

module.exports = NumeroDialog;