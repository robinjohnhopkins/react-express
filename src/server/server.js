import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {connectDB} from './connect-db';
import './initialize-db';
import {authenticationRoute} from './authenticate';

let port = 7777;
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
