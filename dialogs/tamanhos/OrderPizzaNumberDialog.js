const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper } = require("../../helpers");
const { dialogs } = require("../../config");

const BaseDialog = require("../BaseDialog");

const TEXT_PROMPT = "orderPizzaNumberPrompt";

const MAIN = "orderPizzaNumberMain";

class OrderPizzaNumberDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("orderPizzaNumber", { luisRecognizer, locale });
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
      console.log(numeros);
      let prompt;
      console.log(pizzas.length);
      console.log(numeros.length);
      console.log(pizzas.length == numeros.length)
      if(pizzas.length == numeros.length){
        console.log("entro if 0")
        let pizza = pizzas[userProfile.cont];
        console.log("pizza if 0 " + pizza)
        let numero = numeros[userProfile.cont];
        console.log("numero if 0 " + numero)

        prompt = MessageFactory2.text(
          this.getRandomResponse("askAboutPizzaNumber", {numero, pizza})
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

        let entitiesTamanho = entities.tamanho;
        console.log("TAMANHO: " + entitiesTamanho)
        let entitiesNumbers = [];
      
        if(entities.number){
          entitiesNumbers = entities.number;
        }
        console.log("NUMBER: " + entitiesNumbers);

        let text = luisResults.text.toLowerCase();
        console.log("text:" + text)

        let positionsNumber = pizzaHelper.positionsNumber(text, entitiesNumbers);
        console.log("positionsNumber:" + positionsNumber)

        positionsNumber = pizzaHelper.positionsStringNumber(text, entitiesNumbers, positionsNumber);
        console.log("positionsNumber:" + positionsNumber)

        let positionsTamanhos = pizzaHelper.positionsObjects(text, entitiesTamanho);
        console.log("positionsTamanhos:" + positionsTamanhos)

        let numbersResult = pizzaHelper.numbersResult(positionsNumber, positionsTamanhos, entitiesNumbers);
        console.log("numbersResult:" + numbersResult)
        let totalEntitiesNumber = 0;
        if(entitiesTamanho){
            if(numbersResult){
                console.log("entrou if 1")
              for(let i = 0; i < numbersResult.length; i++){
                console.log("entrou for 1")
                totalEntitiesNumber += numbersResult[i];
              }
              if(entitiesTamanho.length == 1){
                console.log("entrou if 2")
                totalEntitiesNumber = numeros[userProfile.cont];
              }
            }
            if(totalEntitiesNumber != numeros[userProfile.cont]){
              return await stepContext.replaceDialog(dialogs.orderPizzaNumber, {pizzas, numeros, tamanho, userProfile});
            }
            if(numbersResult){
              if(entitiesTamanho.length == 1){
                console.log("entrou if 3")
                userProfile.numeros.push(numeros[userProfile.cont]);
              }else{
                for(let i = 0; i < numbersResult.length; i++){
                    console.log("entrou if 4")
                    userProfile.numeros.push(numbersResult[i]);
                }
              }
            }
            for(let entitiesSize of entitiesTamanho){
                userProfile.tamanho.push(entitiesSize);
                userProfile.pizzas.push(pizzas[userProfile.cont]);
            }
        
        if(pizzas){
          if(userProfile.cont < pizzas.length - 1){
            console.log("entrou if 5")
            userProfile.cont += 1;
            return await stepContext.replaceDialog(dialogs.orderPizzaNumber, {pizzas, numeros, tamanho, userProfile});
          }
        }
        
        pizzas = userProfile.pizzas;
        numeros = userProfile.numeros;
        tamanho = userProfile.tamanho;
        return await stepContext.next({pizzas, numeros, tamanho});
      }
      return await stepContext.replaceDialog(dialogs.orderPizzaNumber, {pizzas, numeros, tamanho, userProfile});
    }
    
    async endStep(stepContext) {
      console.log(inspect(stepContext.result))
      let { pizzas, numeros, tamanho } = stepContext.result;
      return stepContext.endDialog({ pizzas, numeros, tamanho});
    }
}

module.exports = OrderPizzaNumberDialog;