import { createApp } from './app.js';

const port = Number(process.env.PORT || 4105);
createApp().listen(port, () => {
  console.log('UPI Social Proof Ledger API listening on http://127.0.0.1:' + port);
});

