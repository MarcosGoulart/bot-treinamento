const { WaterfallDialog } = require("botbuilder-dialogs");

const BaseDialog = require("./BaseDialog");

const HELP_MAIN_WATERFALL_DIALOG = "helpMainWaterfallDialog";

class HelpDialog extends BaseDialog {
  constructor({ locale }) {
    super("help", { locale });

    this.addDialog(
      new WaterfallDialog(HELP_MAIN_WATERFALL_DIALOG, [
        this.displayStep.bind(this),
        this.endStep.bind(this)
      ])
    );

    this.initialDialogId = HELP_MAIN_WATERFALL_DIALOG;
  }

  async displayStep(stepContext) {
    return await stepContext.context.sendActivity(
      this.getRandomResponse("whatICanDo")
    );
  }
  async endStep(stepContext) {
    return await stepContext.endDialog();
  }
}

module.exports = HelpDialog;
