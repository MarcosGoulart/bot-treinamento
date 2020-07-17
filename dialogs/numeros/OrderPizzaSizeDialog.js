const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper } = require("../../helpers");
const { dialogs, intents } = require("../../config");

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
      let { pizzas, numeros, tamanho, userProfile } = stepContext.options;
      console.log("cont: " + userProfile.cont)
      console.log(pizzas);
      console.log(numeros);
      console.log(tamanho);

      if(numeros){
        if(numeros[userProfile.cont]){
          for(let i = 0; i < numeros.length; i++){
            if(numeros[userProfile.cont] > 0){
              userProfile.numeros.push(numeros[userProfile.cont])
              userProfile.cont += 1;
            }else{
              break;
            }
          }
        }
      }
      if(pizzas.length > userProfile.cont){
        console.log("entrou if pizza > cont")
        let prompt;

        if(tamanho){
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
        }else{
          let pizza = pizzas[userProfile.cont];
          prompt = MessageFactory2.text(
            this.getRandomResponse("askAboutPizza", {pizza})
          );
        }
    
        return await stepContext.prompt(TEXT_PROMPT, { prompt });
      }
      return await stepContext.next({pizzas, numeros, tamanho, userProfile});

    }

    async askAboutPizza(stepContext){
      let {pizzas, numeros, tamanho, userProfile } = stepContext.options;

      let luisResults = await this.luisRecognizer.executeLuisQuery(
          stepContext.context
      );
      console.log(inspect(luisResults))
      const topIntent = this.luisRecognizer.topIntent(luisResults);
      console.log("TOP INTENT " + topIntent)
      if(topIntent == intents.cancel) {
        await stepContext.context.sendActivity(this.getRandomResponse("bye"));
        return await stepContext.cancelAllDialogs(true);
      }

      const entities = this.luisRecognizer.getEntities(luisResults);

      const instancesTamanho = luisResults.entities.$instance.tamanho;
      console.log("instancesTamanho: " + instancesTamanho)
      const instancesNumeros = luisResults.entities.$instance.number;

      let entitiesTamanho = entities.tamanho;

      let positionsTamanhos = pizzaHelper.positionsObjects(instancesTamanho);
      console.log("positionsTamanhos:" + positionsTamanhos)

      let entitiesNumbers = [];
      if(pizzas.length > userProfile.cont){
        if(entities.number){
          entitiesNumbers = entities.number;
          console.log("ENTITIE: " + entitiesNumbers)
          let positionsNumber = pizzaHelper.positionsObjects(instancesNumeros);
          if(positionsNumber && positionsTamanhos){
            for(let i = 0; i < positionsNumber.length; i++){
              for(let j = 0; j < positionsTamanhos.length; j++){
                if(positionsNumber[i] == positionsTamanhos[j]){
                  positionsNumber.splice(i, 1);
                  numerosNovo.splice(i, 1);
                }
              }
            }
          }

          let tamanhoResultNumber = pizzaHelper.tamanhosResult(positionsTamanhos, positionsNumber, positionsNumber, entitiesTamanho);
        
          if(entitiesNumbers){
            for(let i = 0; i < entitiesNumbers.length; i++){
              console.log("entrou")
              userProfile.pizzas.push(pizzas[userProfile.cont]);
              console.log("1")
              userProfile.numeros.push(entitiesNumbers[i]);
              console.log("2")
              if(numeros){
                if(numeros.length > 0){
                  if(numeros.length > userProfile.cont){
                    numeros[userProfile.cont] = entitiesNumbers[i];
                  }else{
                    numeros.push(entitiesNumbers[i])
                  }
                }
              }
            }
          }
          if(tamanhoResultNumber && !tamanho[userProfile.cont]){
            console.log("tamanhoResultNumber: " + tamanhoResultNumber)
            for(let tamanhoResult of tamanhoResultNumber){
              userProfile.tamanho.push(tamanhoResult);
            }
          }else{
            userProfile.tamanho.push(tamanho[userProfile.cont]);
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
          pizzas = userProfile.pizzas;
          numeros = userProfile.numeros;
          tamanho = userProfile.tamanho;
          return await stepContext.next({pizzas, numeros, tamanho, topIntent, luisResults});
        }
        return await stepContext.replaceDialog(dialogs.orderPizzaSize, {pizzas, numeros, tamanho, userProfile});
      }
      pizzas = userProfile.pizzas;
      numeros = userProfile.numeros;
      tamanho = userProfile.tamanho;
      return await stepContext.next({pizzas, numeros, tamanho, topIntent, luisResults});
      
    }
    async endStep(stepContext) {
      //console.log(inspect(stepContext.result))
      let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
      console.log(inspect(topIntent))
      return stepContext.endDialog({ pizzas, numeros, tamanho, topIntent, luisResults});
    }
}

module.exports = OrderPizzaSizeDialog;