import { addNewTask, updateTask, deleteTask } from './server';

(async function myTest(){
    await addNewTask({
        name:"My Task",
        id:"12345"
    });
    await updateTask({
        name:"My Task - UPDATED",
        id:"12345"
    });
    await deleteTask({
        name:"My Task - UPDATED",
        id:"12345"
    });
})();
