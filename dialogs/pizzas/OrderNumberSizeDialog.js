const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper } = require("../../helpers");
const { dialogs } = require("../../config");

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
    
      let totalNumber = numeros[userProfile.cont];
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
          this.getRandomResponse("askAboutPizzaNumberSize", {totalNumber, size})
      );

      return await stepContext.prompt(TEXT_PROMPT, { prompt });
        
    }

    async askAboutPizza(stepContext){
      let {pizzas, numeros, tamanho, userProfile } = stepContext.options;

      const luisResults = await this.luisRecognizer.executeLuisQuery(
          stepContext.context
      );
      const entities = this.luisRecognizer.getEntities(luisResults);

      let entitiesPizzas = entities.pizzas;
      let entitiesNumbers = [];
      
      if(entities.number){
        entitiesNumbers = entities.number;
      }
      
      let text = luisResults.text.toLowerCase();
     
      let positionsNumber = pizzaHelper.positionsNumber(text, entitiesNumbers);
     
      positionsNumber = pizzaHelper.positionsStringNumber(text, entitiesNumbers, positionsNumber);

      let positionsPizzas = pizzaHelper.positionsObjects(text, entitiesPizzas);

      let numbersResult = pizzaHelper.numbersResult(positionsNumber, positionsPizzas, entitiesNumbers);

      let totalEntitiesNumber = 0;
      if(entitiesPizzas){
        if(numbersResult){
          for(let i = 0; i < numbersResult.length; i++){
            totalEntitiesNumber += numbersResult[i];
          }
          if(entitiesPizzas.length == 1){
            totalEntitiesNumber = numeros[userProfile.cont];
          }
        }
        if(totalEntitiesNumber != numeros[userProfile.cont]){
          return await stepContext.replaceDialog(dialogs.orderNumberSize, {pizzas, numeros, tamanho, userProfile});
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
          userProfile.tamanho.push(tamanho[userProfile.cont]);
        }

        if(tamanho){
          if(userProfile.cont < tamanho.length - 1){
            userProfile.cont += 1;
            return await stepContext.replaceDialog(dialogs.orderNumberSize, {pizzas, numeros, tamanho, userProfile});
          }
        }
        pizzas = userProfile.pizzas;
        numeros = userProfile.numeros;
        tamanho = userProfile.tamanho;
        return stepContext.next({pizzas, numeros, tamanho});
      }
      return await stepContext.replaceDialog(dialogs.orderNumberSize, {pizzas, numeros, tamanho, userProfile});
    }
    
    async endStep(stepContext) {
      let { pizzas, numeros, tamanho } = stepContext.result;
      return stepContext.endDialog({ pizzas, numeros, tamanho});
    }
}

module.exports = OrderNumberSizeDialog;