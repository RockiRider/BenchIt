const nodeserver = require('../../localserver/server');
const ResultsPanel = require('../ResultsPanel');


const webpage = new ResultsPanel.ResultsPanel();
let instance = new nodeserver.LocalServer(webpage.getHtml());

module.exports = {
    // @ts-ignore
    instance
  }