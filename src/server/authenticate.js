import {connectDB} from './connect-db';
import uuid from 'uuid';
import md5 from 'md5';

const authenticationTokens = [];

async function assembleUserState(user){
    let db = await connectDB();

    let tasks = await db.collection(`tasks`).find({owner:user.id}).toArray();
    let groups = await db.collection(`groups`).find({owner:user.id}).toArray();
    let users = [
        await db.collection(`users`).findOne({id:user.id}),
        ...await db.collection(`users`).find({id:{$in:[...tasks].map(x=>x.owner)}}).toArray()
    ];

    let userState = {
        tasks,
        groups,
        users,
        session:{authenticated:`AUTHENTICATED`,id:user.id, name:user.name}
    };
    console.log("userState", userState);
    return userState;
}
export const authenticationRoute = app => {
    app.post('/authenticate', async (req, res) => {
        //console.info("server /authenticate route", req.body);
        let {username, password} = req.body;
        let db = await connectDB();
        let collection = db.collection(`users`);
        let user = await collection.findOne({name:username});
        if (!user){
            return res.status(500).send("User not found");
        }
        let hash = md5(password);
        let passwordCorrect = hash === user.passwordHash;

        if (!passwordCorrect){
            return res.status(500).send("Password incorrect");
        }
        let token = uuid();
        authenticationTokens.push({
            token,
            userID: user.id
        });
        let state=await assembleUserState(user);
        res.send({token,state});
    })
}