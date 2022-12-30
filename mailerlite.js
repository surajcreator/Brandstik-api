const sdk = require('api')('@mailerliteapi/v2#3vxhg2kkw1s00g2');

const getCampaigns = () =>{
sdk.auth('12426a751a594462054af32bbd4dafc8');
sdk.campaignsByType({
  limit: '100',
  offset: '0',
  order: 'desc',
  status: 'sent',
  'x-mailerlite-apidocs': 'true'
})
  .then(({ data }) => console.log(data.toString()))
  .catch(err => console.error(err.toString()));
}

module.exports = getCampaigns