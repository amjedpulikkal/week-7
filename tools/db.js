const { ObjectId } = require("mongodb");

const MongoClient = require("mongodb").MongoClient

const url = "mongodb+srv://amjed:wVowpvLT8E2odtA5@cluster0.rsu8vtm.mongodb.net/?retryWrites=true&w=majority";

const bcrypt = require('bcrypt');

const clint = new MongoClient(url)

const db = "userLogin"

async function connect() {

    try {

        await clint.connect()

        return clint

    } catch (e) {
        console.log("err");
        console.log(e);
    }

}
connect()
const DB = clint.db(db).collection("user")

function find() {

    return new Promise((res, rev) => {


        DB.find({}).toArray().then(data => {
            if (data) {
                res(data)
            } else {
                rev("not find")
                console.log("not find");
            }
        })
    })
}

async function block(id) {

    await DB.updateOne({ _id: new ObjectId(id) }, { $set: { status: false } })

}
async function Unblock(id) {

    await DB.updateOne({ _id: new ObjectId(id) }, { $set: { status: true } })

}
function insert(data) {
    data.status = true


    return new Promise((res, rej) => {
        const edata = data.email;
        DB.findOne({ email: edata }).then(existingData => {
            if (existingData) {
                rej("email used");
            } else {
                console.log(data.pasword);
                bcrypt.hash(data.pasword, 10, (err, hash) => {

                    console.log(hash)
                    data.pasword = hash
                    DB.insertOne(data)
                        .then(insertedData => {
                            res(data);
                            console.log(insertedData);
                        })
                        .catch(insertError => {
                            rej("Error inserting data");
                            console.error(insertError);
                        });

                })

            }
        }).catch(findError => {
            rej("Error finding existing data");
            console.error(findError);
        });
    });
}


const dbDamin = clint.db(db).collection("admin")
async function admin(data) {

    return data = await dbDamin.findOne(data)
}

async function update(id, data) {

    console.log(id);
    console.log(data);

    console.log(new ObjectId(id));
    return await DB.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data })


}




function findUser(data) {
    console.log(data);

    return new Promise((res, rej) => {
        const dEmail = data.email
        DB.findOne({ email: dEmail }).then(value => {
            console.log(value);
            if (value) {
                if (value.status) {
                    bcrypt.compare(data.pasword, value.pasword, (err, result) => {
                        if (result) {
                            console.log(value);
                            res(value)
                        } else {
                            rej("not match password")
                        }
                    })
                } else {

                    rej("user blocked")
                }
            } else {
                rej("email not find")
            }



        })

    })

}

async function Duser(id) {
    return data = await DB.findOneAndDelete({ _id: new ObjectId(id) })
}
module.exports = { find, admin, insert, findUser, Duser, update, Unblock, block }



