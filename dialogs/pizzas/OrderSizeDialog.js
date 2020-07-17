const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper, orderHelper } = require("../../helpers");
const { dialogs, intents } = require("../../config");

const BaseDialog = require("../BaseDialog");

const TEXT_PROMPT = "orderSizePrompt";

const MAIN = "orderSizeMain";

class OrderSizeDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("orderSize", { luisRecognizer, locale });
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
      let size = tamanho[userProfile.cont];
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
          this.getRandomResponse("askAboutPizzaSize", {size})
      );

      return await stepContext.prompt(TEXT_PROMPT, { prompt });
        
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
      const entities = this.luisRecognizer.getEntities(luisResults);
      const instancesPizzas = luisResults.entities.$instance.pizzas;
      const instancesNumeros = luisResults.entities.$instance.number;
      let entitiesPizzas = entities.pizzas;
      let entitiesNumbers;
      console.log("ENTITIE PIZZA: " + entitiesPizzas)
      if(entities.number){
        entitiesNumbers = entities.number;

        let numerosNovo = orderHelper.quatroQueijos(entitiesPizzas, entitiesNumbers);
        console.log("numerosNovo: " + numerosNovo)

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


        let positionsPizzas = pizzaHelper.positionsObjects(instancesPizzas);
        console.log("saiu 4")

        let numbersResult = pizzaHelper.numbersResult(positionsNumber, positionsPizzas, entitiesNumbers);
        console.log("NumberResult: " + numbersResult);

        let totalEntitiesNumber = 0;
        if(entitiesPizzas){
          if(numbersResult){
            for(let i = 0; i < numbersResult.length; i++){
             console.log(numbersResult.length)
              if(numbersResult.length == 1){
               console.log("IF")
                totalEntitiesNumber += numbersResult[i];
              }
            }
            console.log("saiu for")
          }

          if(numbersResult){
            for(let i = 0; i < numbersResult.length; i++){
              console.log("length 15")
              userProfile.numeros.push(numbersResult[i]);
            }
            
            for(let entitiesPizza of entitiesPizzas){
              userProfile.pizzas.push(entitiesPizza);
              userProfile.tamanho.push(tamanho[userProfile.cont]);
            }
    
            if(tamanho){
                if(userProfile.cont < tamanho.length - 1){
                  userProfile.cont += 1;
                  console.log("return if 2")
                  return await stepContext.replaceDialog(dialogs.orderSize, {pizzas, numeros, tamanho, userProfile});
                }
            }
          }
          console.log(userProfile)
          pizzas = userProfile.pizzas;
          tamanho = userProfile.tamanho;
          numeros = userProfile.numeros;
          return stepContext.next({pizzas, numeros, tamanho, topIntent, luisResults});
        }
      }else if(entitiesPizzas){
          
        for(let entitiesPizza of entitiesPizzas){
          userProfile.pizzas.push(entitiesPizza);
          userProfile.numeros.push(0);
          userProfile.tamanho.push(tamanho[userProfile.cont]);
        }
  
        if(tamanho){
          if(userProfile.cont < tamanho.length - 1){
            userProfile.cont += 1;
            console.log("return if 3")
            return await stepContext.replaceDialog(dialogs.orderSize, {pizzas, numeros, tamanho, userProfile});
          }
        }
        
        console.log(userProfile)
        pizzas = userProfile.pizzas;
        tamanho = userProfile.tamanho;
        numeros = userProfile.numeros;
        return stepContext.next({pizzas, numeros, tamanho, topIntent, luisResults});
      }else{
        return await stepContext.replaceDialog(dialogs.orderSize, {pizzas, numeros, tamanho, userProfile});
      }
      console.log("return if 4")
      return await stepContext.replaceDialog(dialogs.orderSize, {pizzas, numeros, tamanho, userProfile});  
    }
    async endStep(stepContext) {
      let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
      console.log("endOrderSize pizza: " + pizzas)
      console.log("endOrderSize numeros: " + numeros)
      console.log("endOrderSize tamanho: " + tamanho)
      return stepContext.endDialog({ pizzas, numeros, tamanho, topIntent, luisResults});
    }
}

module.exports = OrderSizeDialog;