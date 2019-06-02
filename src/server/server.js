import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {connectDB} from './connect-db';
//import './initialize-db'; // if you import this it populates db with samples but duplicates if run multiple times!
// to sort drop db in robomongo and rerun with this imported.
import {authenticationRoute} from './authenticate';
import path from 'path';

let port = process.env.PORT || 7777;
let app = express();

app.listen(port, console.log("server listening on port", port));

// app.get('/', (req,res)=>{
//     res.send("Hello world");
// });

app.use(
    cors(),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json()
);

authenticationRoute(app);

app.get('/stats', async (req,res)=>{
    let stats = [{
        name:"robin",
        score: 23
    },
    {
        name:"fred",
        score: 33
    },
    {
        name:"mark",
        score: 11
    },
    ];
    res.status(200).send(stats);
});

// This allows us to not use webpack server in production
if (process.env.NODE_ENV == `production`) {
    app.use(express.static(path.resolve(__dirname,'../../dist')));
    app.get('/*',(req,res)=>{
        res.sendFile(path.resolve('index.html'));
    });
}

export const addNewTask = async task=>{
    console.debug('addNewTask ', task);
    let db = await connectDB();
    let collection = db.collection(`tasks`);
    await collection.insertOne(task);
}

export const updateTask = async task=>{
    console.debug('updateTask ', task);
    let { id, group, isComplete, name} = task;
    let db = await connectDB();
    let collection = db.collection(`tasks`);
    if (group) {
        await collection.updateOne({id}, {$set:{group}});
    }
    if (name) {
        console.debug('update name');
        await collection.updateOne({id}, {$set:{name}});
    }
    if (isComplete !== undefined) {
        await collection.updateOne({id}, {$set:{isComplete}});
    }
}

app.post('/task/new', async (req,res)=>{
    let task = req.body.task;
    await addNewTask(task);
    res.status(200).send();
});

app.post('/task/update', async (req,res)=>{
    let task = req.body.task;
    await updateTask(task);
    res.status(200).send();
});

export const deleteTask = async task=>{
    console.debug('deleteTask ', task);
    let { id, group, isComplete, name} = task;
    let db = await connectDB();
    let collection = db.collection(`tasks`);
    if (id) {
        console.debug('delete id');
        await collection.deleteOne({id});
    }
}

app.delete('/task/delete', async (req,res)=>{
    let task = req.body.task;
    await deleteTask(task);
    res.status(200).send();
});
