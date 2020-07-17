const { WaterfallDialog } = require("botbuilder-dialogs");

const BaseDialog = require("./BaseDialog");

const WATERFALL_DIALOG = "WaterfallDialog";

class GreetingDialog extends BaseDialog {
  constructor({ locale }) {
    super("saudar", { locale });

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.displayStep.bind(this),
        this.endStep.bind(this)
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async displayStep(stepContext) {
  
    return await stepContext.context.sendActivity(
      this.getRandomResponse("handle")
    );
  }
  async endStep(stepContext) {
    return await stepContext.endDialog();
  }
}

module.exports = GreetingDialog;
