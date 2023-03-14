const { workerData, parentPort } = require('worker_threads')
const Client = require('ssh2-sftp-client')
const sftp = new Client()
const config = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT,
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
}

sftp.connect(config)
  .then(() => {
    switch (workerData.function_name) {
      case 'EXISTS': return sftp.exists(workerData.path)
      case 'STAT': return sftp.stat(workerData.path)
      case 'MKDIR': return sftp.mkdir(workerData.path, workerData.recursive)
      case 'RMDIR': return sftp.rmdir(workerData.path, workerData.recursive)
      case 'REMOVE': return sftp.delete(workerData.path, workerData.noErrorOK)
      case 'RENAME': return sftp.posixRename(workerData.path, workerData.newPath)
      case 'LIST':  if (workerData.folders_only) { return sftp.list(workerData.path, item => item.type == 'd') } return sftp.list(workerData.path)
      default:
        return false
    }
  })
  .then(data => parentPort.postMessage({
    data,
    workerData
  }))
  .finally(_ => sftp.end())
