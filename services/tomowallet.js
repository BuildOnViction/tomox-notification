const axios = require('axios')
const Web3 = require('web3')
const config = require('config')
const web3 = new Web3()

const sendNotify = async function(address, deeplink, title, message) {
    var PRIVATE_KEY = config.get('tomowallet.apiKey')
    var api = config.get('tomowallet.uri')
    var base64Data = Buffer.from(JSON.stringify({
        appName: 'TomoDEX',
        title: title,
        msg: message,
        address: address,
        deepLink: deeplink
    })).toString('base64');
    var signMessage = web3.eth.accounts.sign(base64Data, PRIVATE_KEY)
    var signature = signMessage.signature;
    var { data } = await axios.post(`${api}/api/services/notification/tomodex`, {
        message: base64Data,
        signature
    });
    console.log(`SEND notification to=${address} title="${title}" msg="${message}" status="${data.message}"`)
    if (data.error) {
        throw new Error('The application dont have permission for push notification to TomoWallet');
    }
}

module.exports = {
    sendNotify
}
