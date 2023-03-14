const { MongoClient, ObjectId } = require('mongodb')
const mongodb_url = process.env.MONGODB_CONNECTION_URL || "mongodb://localhost:27017"
const mongodb_db_name = process.env.MONGODB_DB_NAME || "mongodb"
const client = new MongoClient(mongodb_url);

const COLLECTION_DOWNLOADS = "downloads"


async function ping() {
    try {
        await client.connect();
        return await client.db(mongodb_db_name).command({ ping: 1 });
    } finally {
        await client.close();
    }
}

async function get_downloads() {
    try {
        await client.connect();
        const db = client.db(mongodb_db_name);
        const collection = db.collection(COLLECTION_DOWNLOADS);
        return await collection.find({}).toArray();
        
    } finally {
        await client.close();
    }
}

async function get_download(id) {
    try {
        await client.connect();
        const db = client.db(mongodb_db_name);
        const collection = db.collection(COLLECTION_DOWNLOADS);
        return await collection.find({ _id: new ObjectId(id) }).toArray();
        
    } finally {
        await client.close();
    }
}

async function set_download(id, data) {
    try {
        await client.connect();
        const db = client.db(mongodb_db_name);
        const collection = db.collection(COLLECTION_DOWNLOADS);
        return await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });

    } finally {
        await client.close();
    }
}



module.exports = {
    ping,
    get_downloads,
    get_download,
    set_download
}


