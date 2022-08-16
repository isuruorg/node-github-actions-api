const { WebClient } = require('@slack/web-api');

class SlackClient {
  apiInstance: any;
  constructor() {
    this.apiInstance = new WebClient(process.env.SLACK_TOKEN);
  }
}
module.exports = new SlackClient();
