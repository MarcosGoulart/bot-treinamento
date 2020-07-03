const { TextPrompt, WaterfallDialog } = require("botbuilder-dialogs");

const { inspect } =  require("util");

const { MessageFactory2, pizzaHelper } = require("../../helpers");
const { dialogs } = require("../../config");

const BaseDialog = require("../BaseDialog");

const TEXT_PROMPT = "orderSizePrompt";

const MAIN = "orderSizeMain";

class OrderNumberSizeDialog extends BaseDialog {
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
      const entities = this.luisRecognizer.getEntities(luisResults);

      let entitiesPizzas = entities.pizzas;

      if(entitiesPizzas){
        
        for(let entitiesPizza of entitiesPizzas){
          userProfile.pizzas.push(entitiesPizza);
        }

        if(tamanho){
            if(userProfile.cont < tamanho.length - 1){
              userProfile.cont += 1;
              return await stepContext.replaceDialog(dialogs.orderSize, {pizzas, numeros, tamanho, userProfile});
            }
        }

        pizzas = userProfile.pizzas;
        return stepContext.next({pizzas, numeros, tamanho});
      }
      return await stepContext.replaceDialog(dialogs.orderNumber, {pizzas, numeros, tamanho, userProfile});
    
    }
    async endStep(stepContext) {
      let { pizzas, numeros, tamanho } = stepContext.result;
      return stepContext.endDialog({ pizzas, numeros, tamanho});
    }
}

module.exports = OrderNumberSizeDialog;