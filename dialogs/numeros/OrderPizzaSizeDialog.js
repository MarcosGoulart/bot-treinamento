const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper } = require("../../helpers");
const { dialogs } = require("../../config");

const BaseDialog = require("../BaseDialog");

const TEXT_PROMPT = "orderPizzaSizePrompt";

const MAIN = "orderPizzaSizeMain";

class OrderPizzaSizeDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("orderPizzaSize", { luisRecognizer, locale });
    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(
        new WaterfallDialog(MAIN, [
          this.questionAboutPizza.bind(this),
          this.askAboutPizza.bind(this),
          this.endStep.bind(this)
        ])
      );
  
    this.initialDialogId = MAIN;
  }

    async questionAboutPizza(stepContext){
      let {pizzas, numeros, tamanho, userProfile } = stepContext.options;
      console.log("cont: " + userProfile.cont)
      console.log(pizzas);
      let prompt;
      if(pizzas.length <= tamanho.length){
        let pizza = pizzas[userProfile.cont];
        let size = tamanho[userProfile.cont];

        prompt = MessageFactory2.text(
          this.getRandomResponse("askAboutPizzaSize", {pizza, size})
        );

      }else{
        let pizza = pizzas[userProfile.cont];
        prompt = MessageFactory2.text(
          this.getRandomResponse("askAboutPizza", {pizza})
        );

      }
     
      return await stepContext.prompt(TEXT_PROMPT, { prompt });
        
    }

    async askAboutPizza(stepContext){
      let {pizzas, numeros, tamanho, userProfile } = stepContext.options;

      const luisResults = await this.luisRecognizer.executeLuisQuery(
          stepContext.context
      );
      const entities = this.luisRecognizer.getEntities(luisResults);

      let entitiesNumbers = [];
      
      if(entities.number){
        entitiesNumbers = entities.number;
      
        if(entitiesNumbers){
          userProfile.numeros.push(entitiesNumbers[0]);
        }

        if(pizzas){
          console.log("CONT:" + userProfile.cont)
          console.log("pizzas.length - 1:" + pizzas.length - 1)
          console.log("pizzas.length:" + pizzas.length)
          console.log(userProfile.cont < pizzas.length)
          if(userProfile.cont < pizzas.length - 1){
            userProfile.cont += 1;
            return await stepContext.replaceDialog(dialogs.orderPizzaSize, {pizzas, numeros, tamanho, userProfile});
          }
        }
        console.log(userProfile.numeros);
        numeros = userProfile.numeros;
        console.log(numeros);
        return await stepContext.next({pizzas, numeros, tamanho});
      }
      return await stepContext.replaceDialog(dialogs.orderPizzaSize, {pizzas, numeros, tamanho, userProfile});
      
    }
    async endStep(stepContext) {
      console.log(inspect(stepContext.result))
      let { pizzas, numeros, tamanho } = stepContext.result;
      return stepContext.endDialog({ pizzas, numeros, tamanho});
    }
}

module.exports = OrderPizzaSizeDialog;