const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper, orderHelper } = require("../../helpers");
const { dialogs, intents } = require("../../config");

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
      console.log("TAMANHO: " + tamanho);

      if(tamanho){
        if(tamanho[userProfile.cont]){
          console.log("entrou tamanho user profile: " + tamanho[userProfile.cont])
          while(userProfile.cont < tamanho.length){
            if(tamanho[userProfile.cont] != 0){
              userProfile.tamanho.push(tamanho[userProfile.cont])
              userProfile.pizzas.push(pizzas[userProfile.cont]);
              userProfile.numeros.push(numeros[userProfile.cont]);
              userProfile.cont += 1;
            }else{
              break;
            }
          }
        }
      }
      console.log("contPosFor: " + userProfile.cont)
      console.log("pizzas.length: " + pizzas.length)
      if(pizzas.length > userProfile.cont){
        let prompt;
        if(pizzas.length == numeros.length){
          console.log("entro if 0")
          let pizza = pizzas[userProfile.cont];
          console.log("pizza if 0 " + pizza)
          let numero = numeros[userProfile.cont];
          console.log("numero if 0 " + numero)
          if(numeros[userProfile.cont] == 1){
            prompt = MessageFactory2.text(
              this.getRandomResponse("askAboutPizzaNumberSingular", {numero, pizza})
            );
          }else{
            prompt = MessageFactory2.text(
              this.getRandomResponse("askAboutPizzaNumberPlural", {numero, pizza})
            );
          }
        }
      
        return await stepContext.prompt(TEXT_PROMPT, { prompt });
          
      }
      return await stepContext.next({pizzas, numeros, tamanho, userProfile});
    }

    async askAboutPizza(stepContext){
        let {pizzas, numeros, tamanho, userProfile } = stepContext.options;

        const luisResults = await this.luisRecognizer.executeLuisQuery(
            stepContext.context
        );
        const topIntent = this.luisRecognizer.topIntent(luisResults);
        if(topIntent == intents.cancel) {
          await stepContext.context.sendActivity(this.getRandomResponse("bye"));
          return await stepContext.cancelAllDialogs(true);
        }
        const instancesNumeros = luisResults.entities.$instance.number;
        const instancesTamanho = luisResults.entities.$instance.tamanho;
        const entities = this.luisRecognizer.getEntities(luisResults);
        console.log(inspect(instancesTamanho))
        console.log("PIZZA: " + pizzas)
        let entitiesTamanho = entities.tamanho;
        console.log("TAMANHO: " + entitiesTamanho)
        let entitiesNumbers = [];
      
        if(entities.number){
          entitiesNumbers = entities.number;
        }
        console.log("NUMBER: " + entitiesNumbers);

        if(pizzas.length > userProfile.cont){
 
          let positionsNumber = pizzaHelper.positionsObjects(instancesNumeros);

          let positionsTamanhos = pizzaHelper.positionsObjects(instancesTamanho);
          console.log("positionsTamanhos:" + positionsTamanhos)

          if(positionsNumber && positionsTamanhos){
            for(let i = 0; i < positionsNumber.length; i++){
              for(let j = 0; j < positionsTamanhos.length; j++){
                if(positionsNumber[i] == positionsTamanhos[j]){
                  positionsNumber.splice(i, 1);
                  entitiesNumbers.splice(i, 1);
                }
              }
            }
          }

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
              console.log("numeros " + numeros[userProfile.cont])
              console.log("entitiesNumber" + totalEntitiesNumber)
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
              console.log(userProfile.pizzas);
              console.log(userProfile.tamanho);

          
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
          return await stepContext.next({pizzas, numeros, tamanho, topIntent, luisResults});
        }
        return await stepContext.replaceDialog(dialogs.orderPizzaNumber, {pizzas, numeros, tamanho, userProfile});
      }
      pizzas = userProfile.pizzas;
      numeros = userProfile.numeros;
      tamanho = userProfile.tamanho;
      return await stepContext.next({pizzas, numeros, tamanho, topIntent, luisResults});
    }
    
    async endStep(stepContext) {
      console.log(inspect(stepContext.result))
      let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
      return stepContext.endDialog({ pizzas, numeros, tamanho, topIntent, luisResults});
    }
}

module.exports = OrderPizzaNumberDialog;