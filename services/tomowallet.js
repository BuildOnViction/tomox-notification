const axios = require('axios')
const Web3 = require('web3')
const config = require('config')
const web3 = new Web3()

const sendNotify = async function(address, deeplink) {
    var PRIVATE_KEY = config.get('tomowallet.apiKey')
    var api = config.get('tomowallet.uri')
    var base64Data = Buffer.from(JSON.stringify({
        appName: 'TomoDEX',
        title: 'test',
        msg: 'test',
        address: address,
        deepLink: deeplink
    })).toString('base64');
    var signMessage = web3.eth.accounts.sign(base64Data, PRIVATE_KEY)
    var signature = signMessage.signature;
    var { data } = await axios.post(`${api}/api/services/notification/push`, {
        message: base64Data,
        signature
    });
    console.log(data)
    if (data.error) {
        throw new Error('The application dont have permission for push notification to TomoWallet');
    }
}

module.exports = {
    sendNotify
}
