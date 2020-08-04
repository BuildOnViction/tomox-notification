const MongoClient = require('mongodb').MongoClient
const TomoWallet = require('./services/tomowallet')
const config = require('config')
const _ = require('lodash')
const moment = require('moment')

const uri = config.get('mongodb.uri')
const insert_pipeline = [
    {
        $match: {
            operationType: 'insert'
        }
    }
]

const update_pipeline = [
    {
        $match: {
            operationType: 'update'
        }
    }
]

async function run() {
    console.log('Start watching events!!!')
	let con = await MongoClient.connect(uri, { useUnifiedTopology: true })
	con.db('tomodex').collection('lending_trades').watch(insert_pipeline)
		.on('change', (data) => {
            let delay = moment().diff(moment(data.fullDocument.updatedAt), 'seconds')
            if (delay > 30) {
                return false
            }
            let borrower = data.fullDocument.borrower
            let investor = data.fullDocument.investor

            TomoWallet.sendNotify(
                borrower,
                `tomochain:dapp?url=${config.tomoscan.uri}/lending/trade/${data.fullDocument.hash}`,
                'TRADE | TomoX P2P Lending',
                'You have a new p2p lending contract'
            )
            TomoWallet.sendNotify(
                investor,
                `tomochain:dapp?url=${config.tomoscan.uri}/lending/trade/${data.fullDocument.hash}`,
                'TRADE | TomoX P2P Lending',
                'You have a new p2p lending contract'
            )
		})

	con.db('tomodex').collection('lending_trades').watch(update_pipeline, { fullDocument: 'updateLookup' })
		.on('change', (data) => {
            let borrower = data.fullDocument.borrower
            let investor = data.fullDocument.investor
            let status = data.fullDocument.status.toUpperCase()
            
            if (status !== 'CLOSED' && status !== 'LIQUIDATED') {
                return false
            }
            let delay = moment().diff(moment(data.fullDocument.updatedAt), 'seconds')
            if (delay > 30) {
                return false
            }

            TomoWallet.sendNotify(
                borrower,
                `tomochain:dapp?url=${config.tomoscan.uri}/lending/trade/${data.fullDocument.hash}`,
                'TRADE | TomoX P2P Lending',
                `Your p2p lending contract is ${status}`
            )
            TomoWallet.sendNotify(
                investor,
                `tomochain:dapp?url=${config.tomoscan.uri}/lending/trade/${data.fullDocument.hash}`,
                'TRADE | TomoX P2P Lending',
                `Your p2p lending contract is ${status}`
            )
		})

    /*
	con.db('tomodex').collection('lending_repays').watch(insert_pipeline)
		.on('change', (data) => {
            let tradeHash = data.fullDocument.hash

            let delay = moment().diff(moment(data.fullDocument.updatedAt), 'seconds')
            if (delay > 30) {
                return false
            }

            con.db('tomodex').collection('lending_trades').findOne({
                hash: tradeHash
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    return false
                }
                let borrower = result.borrower
                let investor = result.investor

                TomoWallet.sendNotify(
                    borrower,
                    `tomochain:dapp?url=${config.tomoscan.uri}/lending/repay/${result.hash}`,
                    'REPAY | TomoX P2P Lending',
                    'Your p2p lending contract have a new REPAY order'
                )

                TomoWallet.sendNotify(
                    investor,
                    `tomochain:dapp?url=${config.tomoscan.uri}/lending/repay/${result.hash}`,
                    'REPAY | TomoX P2P Lending',
                    'Your p2p lending contract have a new REPAY order'
                )

            })
		})
    */

	con.db('tomodex').collection('lending_topups').watch(insert_pipeline)
		.on('change', (data) => {
            let tradeHash = data.fullDocument.hash

            let delay = moment().diff(moment(data.fullDocument.updatedAt), 'seconds')
            if (delay > 30) {
                return false
            }

            con.db('tomodex').collection('lending_trades').findOne({
                hash: tradeHash
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    return false
                }
                let borrower = result.borrower
                let investor = result.investor

                TomoWallet.sendNotify(
                    borrower,
                    `tomochain:dapp?url=${config.tomoscan.uri}/lending/topup/${result.hash}`,
                    'TOPUP | TomoX P2P Lending',
                    'Your p2p lending contract have a new TOPUP order'
                )

                TomoWallet.sendNotify(
                    investor,
                    `tomochain:dapp?url=${config.tomoscan.uri}/lending/topup/${result.hash}`,
                    'TOPUP | TomoX P2P Lending',
                    'Your p2p lending contract have a new TOPUP order'
                )

            })
		})

	con.db('tomodex').collection('lending_recalls').watch(insert_pipeline)
		.on('change', (data) => {
            let tradeHash = data.fullDocument.hash

            let delay = moment().diff(moment(data.fullDocument.updatedAt), 'seconds')
            if (delay > 30) {
                return false
            }

            con.db('tomodex').collection('lending_trades').findOne({
                hash: tradeHash
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    return false
                }
                let borrower = result.borrower
                let investor = result.investor

                TomoWallet.sendNotify(
                    borrower,
                    `tomochain:dapp?url=${config.tomoscan.uri}/lending/recalls/${result.hash}`,
                    'RECALL | TomoX P2P Lending',
                    'Your p2p lending contract have a new RECALL order'
                )

                TomoWallet.sendNotify(
                    investor,
                    `tomochain:dapp?url=${config.tomoscan.uri}/lending/recalls/${result.hash}`,
                    'RECALL | TomoX P2P Lending',
                    'Your p2p lending contract have a new RECALL order'
                )

            })
		})
}

run()
