require('dotenv').config()
const {
    list,
    exists,
    stat,
    mkdir,
    rmdir,
    remove,
    rename
} = require('./utils/sftp')
const {
    ping,
    get_downloads,
    get_download,
    set_download
} = require('./utils/mongodb')

const logName = item => {
    console.log(item.path + '/' + item.name)
    if (item.children) {
        item.children.map(i => logName(i))
    }
}

const __main__ = async _ => {
    /*const structure = await list(process.env.PLEX_MEDIA_PATH + '/test')

    structure.map(item => {
        logName(item)
    })*/

   //console.log(structure)


   // ping().catch(console.dir);
   const data = await get_download("640f7d3d4cc002bf82574173").catch(console.dir);
   console.log(data)
   const data1 = await set_download("640f7d3d4cc002bf82574173", { desc: "_s_s_" }).catch(console.dir);
   console.log(data1)
   const data2 = await get_download("640f7d3d4cc002bf82574173").catch(console.dir);
   console.log(data2)

}

__main__()