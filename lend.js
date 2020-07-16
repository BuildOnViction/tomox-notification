const MongoClient = require('mongodb').MongoClient
const TomoWallet = require('./services/tomowallet')

const uri = 'mongodb://localhost:27017/tomodex?replicaSet=rs0'
const insert_pipeline = [
    {
        $match: {
            operationType: 'insert'
        }
    }
]

async function run() {
	let con = await MongoClient.connect(uri, { useUnifiedTopology: true })
	console.log(uri + ' watching: trades')
	con.db('tomodex').collection('trades').watch(insert_pipeline)
		.on('change', data => {
            await TomoWallet.sendNotify(
                'xxx',
                `tomochain:dapp?url=https://dex.tomochain.com`
            )
		})
}

run()
