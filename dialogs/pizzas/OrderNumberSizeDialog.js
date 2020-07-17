const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper, orderHelper } = require("../../helpers");
const { dialogs, intents } = require("../../config");

const BaseDialog = require("../BaseDialog");

const TEXT_PROMPT = "orderNumberSizePrompt";

const MAIN = "orderNumberSizeMain";

class OrderNumberSizeDialog extends BaseDialog {
  constructor({ luisRecognizer, locale }) {
    super("orderNumberSize", { luisRecognizer, locale });
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
      console.log("numeros: " + numeros)
      console.log("tamanhos: " + tamanho)
      console.log("numeros: " + numeros[userProfile.cont])
      console.log("tamanhos: " + tamanho[userProfile.cont])
      let prompt;
      if(numeros[userProfile.cont] == 1){
        if(tamanho[userProfile.cont]){
          let size = tamanho[userProfile.cont]
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
            this.getRandomResponse("askAboutPizzaNumberSizeSingular", {size})
          );
        }else{
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
            this.getRandomResponse("askAboutPizzaNumberSingular")
          );
        }

      }else if(tamanho[userProfile.cont]){
        console.log("TAMANHO EXISTE: " + tamanho[userProfile.cont])
        let totalNumber = numeros[userProfile.cont];
        let size = tamanho[userProfile.cont]
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
            this.getRandomResponse("askAboutPizzaNumberSizePlural", {totalNumber, size})
        );
      }else{
        console.log("TAMANHO NAO EXISTE: " + tamanho[userProfile.cont])
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
      const instancesPizzas = luisResults.entities.$instance.pizzas;
      const instancesNumeros = luisResults.entities.$instance.number;
      //console.log(inspect(luisResults))
      //console.log(inspect(instancesNumeros))

      const entities = this.luisRecognizer.getEntities(luisResults);

      let entitiesPizzas = entities.pizzas;
      console.log("Entitie Pizza: " + entitiesPizzas)
      let entitiesNumbers = [];
      console.log("entities bumbers: " + entities.number)
      if(entities.number){
        console.log("entro if entitie number")
        entitiesNumbers = entities.number;
      }
      
      let numerosNovo = orderHelper.quatroQueijos(entitiesPizzas, entitiesNumbers);
      console.log("numerosNovo: " + numerosNovo)
      
      let positionsTamanhos;
      let entitiesTamanho;
      if(entities.tamanho){
        entitiesTamanho = entities.tamanho;
        positionsTamanhos = pizzaHelper.positionsObjects(instancesTamanho);
      }

      let positionsNumber = pizzaHelper.positionsObjects(instancesNumeros);
      //positionsNumber = pizzaHelper.positionsStringNumber(text, numerosNovo, positionsNumber);
      console.log("positionsNumber: " + positionsNumber)
      console.log("positionsTamanhos: " + positionsTamanhos)
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
      console.log("number result: "+ numbersResult)
      let totalEntitiesNumber = 0;
      if(entitiesPizzas){
        if(numbersResult){
          for(let i = 0; i < numbersResult.length; i++){
            //console.log("length 12")
            totalEntitiesNumber += numbersResult[i];
            console.log("totalNumbers: " + totalEntitiesNumber)
            console.log("number result[i]: "+ numbersResult[i])
          }
          if(entitiesPizzas.length == 1){
            totalEntitiesNumber = numeros[userProfile.cont];
            //console.log("length 13")
          }
        }
        if(totalEntitiesNumber != numeros[userProfile.cont]){
          return await stepContext.replaceDialog(dialogs.orderNumberSize, {pizzas, numeros, tamanho, userProfile});
        }
        if(numbersResult){
          if(entitiesPizzas.length == 1){
           // console.log("length 14")
           if(numeros[userProfile.cont]){
            userProfile.numeros.push(numeros[userProfile.cont]);
           }else{
             userProfile.numeros.push(numbersResult[0]);
           }
          }else{
            for(let i = 0; i < numbersResult.length; i++){
              //console.log("length 15")
              userProfile.numeros.push(numbersResult[i]);
            }
          }
        }
        for(let entitiesPizza of entitiesPizzas){
          userProfile.pizzas.push(entitiesPizza);
          //console.log("length 16")
        }

        if(tamanhosResult){
          if(tamanhosResult.length > 0){
            console.log("IFS")
            for(let entitiesSize of tamanhosResult){
              userProfile.tamanho.push(entitiesSize);
            }      
          }else if(tamanho[userProfile.cont]){
            for(let entitiesPizza of entitiesPizzas){
              console.log("FOR")
              userProfile.tamanho.push(tamanho[userProfile.cont]);   
              console.log("ELSE: " + tamanhosResult)
            }
          }else{
            for(let entitiesPizza of entitiesPizzas){
              userProfile.tamanho.push(0);
            }
          }
        }

        if(tamanho.length && numeros.length){
          if(tamanho.length >= numeros.length){
            if(userProfile.cont < tamanho.length - 1){
              //console.log("length 17")
              userProfile.cont += 1;
              return await stepContext.replaceDialog(dialogs.orderNumberSize, {pizzas, numeros, tamanho, userProfile});
            }
          }else{
            if(userProfile.cont < numeros.length - 1){
              //console.log("length 17")
              userProfile.cont += 1;
              return await stepContext.replaceDialog(dialogs.orderNumberSize, {pizzas, numeros, tamanho, userProfile});
            }
          }
        }
        pizzas = userProfile.pizzas;
        numeros = userProfile.numeros;
        tamanho = userProfile.tamanho;
        return stepContext.next({pizzas, numeros, tamanho, topIntent, luisResults});
      }
      return await stepContext.replaceDialog(dialogs.orderNumberSize, {pizzas, numeros, tamanho, userProfile});
    }
    
    async endStep(stepContext) {
      let { pizzas, numeros, tamanho, topIntent, luisResults } = stepContext.result;
      return stepContext.endDialog({ pizzas, numeros, tamanho, topIntent, luisResults});
    }
}

module.exports = OrderNumberSizeDialog;