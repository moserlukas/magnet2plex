const { Worker } = require('worker_threads')
const WORKER_PATH = __dirname + '/webtorrent_worker.js'


const worker = new Worker(WORKER_PATH)

worker.on('message', (res) => {

    console.log(res)
    worker.terminate()

})
worker.on('error', (error) => {

    console.error(error)

})