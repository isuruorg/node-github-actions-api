import { isDevEnv } from 'lib/networking/domain';
import { SLACK_TEST } from 'lib/utils/slackChannels.utils';

const slackClient = require('clients/slack.client');

const sendMessage = async (channelID: string, msg: string) => {
  if (isDevEnv) {
    channelID = SLACK_TEST;
    msg = `[TEST] ${msg}`;
  }
  // `response` contains information about the posted message
  await slackClient.apiInstance.chat.postMessage({ channel: channelID, text: msg });
};

export = {
  sendMessage,
};
