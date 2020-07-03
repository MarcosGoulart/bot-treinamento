const {
  DialogSet,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog
} = require("botbuilder-dialogs");

const BaseDialog = require("./BaseDialog");
const MainDialog = require("./MainDialog");
const { dialogs } = require("../config");

const TEXT_PROMPT = "introTextPrompt";
const MAIN_WATERFALL = "introMainWaterfall";

class IntroDialog extends BaseDialog {
  constructor({ luisRecognizer, userStateAccessor, locale }) {
    super("intro", { luisRecognizer, locale });

    this.addDialog(
      new MainDialog({ luisRecognizer, userStateAccessor, locale })
    )
      .addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(
        new WaterfallDialog(MAIN_WATERFALL, [
          this.redirectStep.bind(this)
        ])
      );

    this.initialDialogId = MAIN_WATERFALL;
  }
  /**
   * The run method handles the incoming activity (in the form of a stepContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {*} stepContext
   * @param {*} accessor
   */
  async run(stepContext, accessor) {
    console.log("run intro");
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(stepContext);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      console.log("intro: " + this.id);
      await dialogContext.beginDialog(this.id);
    }
  }

  async redirectStep(stepContext) {
    console.log("redirectStep");
    return await stepContext.beginDialog(dialogs.main);
  }
}

module.exports = IntroDialog;