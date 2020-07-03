const { WaterfallDialog } = require("botbuilder-dialogs");

const BaseDialog = require("./BaseDialog");

const NONE_MAIN = "noneMain";

class NoneDialog extends BaseDialog {
  constructor({ locale }) {
    super("none", { locale });

    this.addDialog(
      new WaterfallDialog(NONE_MAIN, [
        this.displayStep.bind(this),
        this.endStep.bind(this)
      ])
    );

    this.initialDialogId = NONE_MAIN;
  }

  async displayStep(stepContext) {
    let msg = stepContext.context.activity.text;

    return await stepContext.context.sendActivity(
      this.getRandomResponse("sorry", { msg })
    );
  }
  async endStep(stepContext) {
    return await stepContext.endDialog({});
  }
}

module.exports = NoneDialog;
