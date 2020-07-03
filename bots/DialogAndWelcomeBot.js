// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const DialogBot = require("./dialogBot");
// const { locationHub } = require('../helpers');

class DialogAndWelcomeBot extends DialogBot {
  constructor(conversationState, userState, dialog, userLocationAccessor) {
    super(conversationState, userState, dialog);

    this.onMembersAdded(async (context, next) => {
      console.log("from", await userLocationAccessor.get(context));
      


      const membersAdded = context.activity.membersAdded;
      for (const memberAdded of membersAdded) {
        if (memberAdded.id !== context.activity.recipient.id) {
          await dialog.run(
            context,
            conversationState.createProperty("DialogState")
          );
        }
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}

module.exports = DialogAndWelcomeBot;
