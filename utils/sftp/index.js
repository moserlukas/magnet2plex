
const { Worker } = require('worker_threads')
const WORKER_PATH = __dirname + '/sftp_worker.js'

const start_sftp_worker = (workerData) => {
    return new Promise((resolve, reject) => {
        // create new worker and pass the specified path
        const worker = new Worker(WORKER_PATH, { workerData })
        // mapping message and error to reject and resolve
        worker.on('message', (res) => {
            resolve(res)
            worker.terminate()
        })
        worker.on('error', (error) => {
            console.error(error)
            reject(error)
        })
    })
}

// Retrieves a directory listing. This method returns a Promise, which once realised, returns an array of objects representing items in the remote directory.
const list = async (path = process.env.PLEX_MEDIA_PATH, folders_only = true) => {
    const sftp_res = await start_sftp_worker({
        function_name: 'LIST',
        path,
        folders_only
    })

    const files = []
    const folders = []
    const ignore_list = ['.', '#'] // only first character is checked. ignoring system files such as '.DS_Store' and '#recycle'
    const data = sftp_res?.data.filter(item => !ignore_list.includes(item.name.substring(0,1)))

    for await (const item of data) {
        if(item.type == 'd') {
            const children = await list(`${path}/${item.name}`, folders_only)
            folders.push({ ...item, path, children})
        } else {
            files.push({ ...item, path })
        }
    }
    return [ ...files, ...folders ]
}
// Tests to see if remote file or directory exists. Returns type of remote object if it exists or false if it does not.
const exists = async (path) => {
    const sftp_res = await start_sftp_worker({
        function_name: 'EXISTS',
        path
    })
    return sftp_res.data
}
// Returns the attributes associated with the object pointed to by path.
const stat = async (path) => {
    const sftp_res = await start_sftp_worker({
        function_name: 'STAT',
        path
    })
    return sftp_res.data
}
// Create a new directory. If the recursive flag is set to true, the method will create any directories in the path which do not already exist. Recursive flag defaults to false.
const mkdir = async (path, recursive = true) => {
    const sftp_res = await start_sftp_worker({
        function_name: 'MKDIR',
        path,
        recursive
    })
    return sftp_res.data
}
// Remove a directory. If removing a directory and recursive flag is set to true, the specified directory and all sub-directories and files will be deleted. If set to false and the directory has sub-directories or files, the action will fail.
const rmdir = async (path, recursive = false) => {
    const sftp_res = await start_sftp_worker({
        function_name: 'RMDIR',
        path,
        recursive
    })
    return sftp_res.data
}
// Delete a file on the remote server.
const remove = async (path, noErrorOK = true) => {
    const sftp_res = await start_sftp_worker({
        function_name: 'REMOVE',
        path,
        noErrorOK
    })
    return sftp_res.data
}
// Rename a file or directory from fromPath to toPath. You must have the necessary permissions to modify the remote file.
const rename = async (path, newPath) => {
    const sftp_res = await start_sftp_worker({
        function_name: 'RENAME',
        path,
        newPath
    })
    return sftp_res.data
}

const put = async (path, dstPath) => {

    const worker = new Worker(WORKER_PATH, { 
        function_name: 'PUT',
        path,
        newPath
     })

        // mapping message and error to reject and resolve
        worker.on('message', (res) => {
            console.log('worker done', res)

            worker.terminate()
        })
        worker.on('error', (error) => {
            console.error(error)
            reject(error)
        })

    /*
        await sftp.fastPut(filePath, remoteFilePath, {
                step: step => {
                    const percent = Math.floor((step / file.length) * 100);

                    if (Date.now() - lastUpdate > 1000 || percent == 100) {
                        file.progress = percent / 100
                        lastUpdate = Date.now()
                        _saveTownloadsInfo()
                    }
                }
            })
    */
}

module.exports = {
    list,
    exists,
    stat,
    mkdir,
    rmdir,
    remove,
    rename
}
