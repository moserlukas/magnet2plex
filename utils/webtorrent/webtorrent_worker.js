const { workerData, parentPort } = require('worker_threads')

let step = 0

for(let i = 0; i < 100000000000; i++) {

    if(i > step + 1000000000) {
        step = i
        parentPort.postMessage(i)
    }
}