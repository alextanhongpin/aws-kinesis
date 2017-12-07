const AWS = require('aws-sdk')

const region = 'ap-southeast-1'
AWS.config.apiVersions = {
	region,
	kinesis: '2013-12-02',
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

const kinesis = new AWS.Kinesis({ region })

const KinesisAdapter = ({ streamName, partitionKey }) => {

	async function publish (data) {
		const params = {
			Data: new Buffer(data),
			PartitionKey: partitionKey,
			StreamName: streamName
		}

		return new Promise((resolve, reject) => {
			kinesis.putRecord(params, (err, { ShardId, SequenceNumber }) => {
				err ? reject(err) : resolve({ ShardId, SequenceNumber })
			})
		})
	}

	async function subscribe ({ shardIterator, limit=10 }) {
		const params = {
			ShardIterator: shardIterator,
			Limit: limit
		}
		return new Promise((resolve, reject) => {
			kinesis.getRecords(params, (err, data) => {
				err ? reject(err) : resolve(data)
			})
		})
	}

	async function getShardIterator({ shardId, shardIteratorType = 'TRIM_HORIZON' }) {
		const params = {
			ShardId: shardId,
			ShardIteratorType: shardIteratorType,
			StreamName: streamName,
			Timestamp: new Date()
		}

		return new Promise((resolve, reject) => {
			kinesis.getShardIterator(params, (err, { ShardIterator }) => {
				err ? reject(err) : resolve({ ShardIterator })
			})
		})
	}
	return { publish, subscribe, getShardIterator }
}

async function main () {
	const kinesis = KinesisAdapter({ streamName: 'test', partitionKey: 'hello' })
	
	const { ShardId: shardId } = await kinesis.publish('hello kinesis!')
	console.log(`shardId = ${shardId}`)

	const { ShardIterator: shardIterator } = await kinesis.getShardIterator({ shardId })
	console.log(`shardIterator = ${shardIterator}`)

	const data = await kinesis.subscribe({ shardIterator })
	console.log('records', data)

	data.Records.forEach((record) => {
		console.log(record.Data.toString('utf8'))
	})
}

main()
.then(console.log)
.catch(console.error)
