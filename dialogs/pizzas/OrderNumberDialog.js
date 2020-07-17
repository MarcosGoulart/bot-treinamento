const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper, orderHelper } = require("../../helpers");
const { dialogs, intents } = require("../../config");

const BaseDialog = require("../BaseDialog");

const TEXT_PROMPT = "orderNumberPrompt";

const MAIN = "orderNumberMain";

class OrderNumberDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("orderNumber", { luisRecognizer, locale });
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
      let prompt;
      if(numeros[userProfile.cont] == 1){
        let totalNumber = numeros[userProfile.cont];
        prompt = MessageFactory2.suggestedActions([
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
            this.getRandomResponse("askAboutPizzaNumberPlural", {totalNumber})
        );
      }else{

        let totalNumber = numeros[userProfile.cont];
        prompt = MessageFactory2.suggestedActions([
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
            this.getRandomResponse("askAboutPizzaNumberPlural", {totalNumber})
        );
      }
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
      //console.log(inspect(stepContext.context))
      //console.log(inspect(luisResults))
      //console.log(luisResults.entities.pizzas)
      //console.log(luisResults.entities.$instance.pizzas)
      const instancesPizzas = luisResults.entities.$instance.pizzas;
      const instancesNumeros = luisResults.entities.$instance.number;
      const instancesTamanho = luisResults.entities.$instance.tamanho;
  
      const entities = this.luisRecognizer.getEntities(luisResults);
      //console.log(entities.pizzas)

      let entitiesPizzas = entities.pizzas;
      let entitiesNumbers = [];
      let entitiesTamanho = [];
      
      if(entities.number){
        entitiesNumbers = entities.number;
      }
      let positionsTamanhos;
      if(entities.tamanho){
        entitiesTamanho = entities.tamanho;
        positionsTamanhos = pizzaHelper.positionsObjects(instancesTamanho);
      }

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

      let positionsPizzasStart = pizzaHelper.positionsObjects(instancesPizzas);
      let positionsPizzasEnd = pizzaHelper.positionsObjects(instancesPizzas, true);

      let numbersResult = pizzaHelper.numbersResult(positionsNumber, positionsPizzasStart, numerosNovo);

      let tamanhosResult = pizzaHelper.tamanhosResult(positionsTamanhos, positionsPizzasStart, positionsPizzasEnd, entitiesTamanho);
      console.log("tamanhoResult: " + tamanhosResult)
      let totalEntitiesNumber = 0;
      if(entitiesPizzas){
       
        if(numbersResult){
          for(let i = 0; i < numbersResult.length; i++){
            totalEntitiesNumber += numbersResult[i];
          }
        }
        if(entitiesPizzas.length == 1){
          totalEntitiesNumber = numeros[userProfile.cont];
        }

        if(totalEntitiesNumber != numeros[userProfile.cont]){

          return await stepContext.replaceDialog(dialogs.orderNumber, {pizzas, numeros, tamanho, userProfile});
        }

        if(numbersResult){
          if(entitiesPizzas.length == 1){
            userProfile.numeros.push(numeros[userProfile.cont]);
          }else{
            for(let i = 0; i < numbersResult.length; i++){
              userProfile.numeros.push(numbersResult[i]);
            }
          }
        }
        
        for(let entitiesPizza of entitiesPizzas){
          userProfile.pizzas.push(entitiesPizza);     
        }
      
        if(tamanhosResult){
          if(tamanhosResult.length > 0){
            console.log("IFS")
            for(let entitiesSize of tamanhosResult){
              userProfile.tamanho.push(entitiesSize);
            }      
          }else{
            for(let entitiesPizza of entitiesPizzas){
              console.log("FOR")
              userProfile.tamanho.push(0);   
              console.log("ELSE: " + tamanhosResult)
            }
          } 
        }

        if(numeros){
          if(userProfile.cont < numeros.length - 1){
            userProfile.cont += 1;
            return await stepContext.replaceDialog(dialogs.orderNumber, {pizzas, numeros, tamanho, userProfile});
          }
        }
        pizzas = userProfile.pizzas;
        numeros = userProfile.numeros;
        tamanho = userProfile.tamanho;
        //console.log("TAMANHO: " + tamanho);
        return stepContext.next({pizzas, numeros, tamanho, topIntent, luisResults});
      }
      return await stepContext.replaceDialog(dialogs.orderNumber, {pizzas, numeros, tamanho, userProfile});
    
    }
    async endStep(stepContext) {
      let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
      return stepContext.endDialog({ pizzas, numeros, tamanho, topIntent, luisResults});
    }
}

module.exports = OrderNumberDialog;