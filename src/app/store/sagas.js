import { take, put, select } from 'redux-saga/effects';
import * as mutations from './mutations'; // with dot slash means find .js file in same directory
import uuid from 'uuid'; // without dot looks for an npm module called uuid
import axios from 'axios';

const url = "http://localhost:7777";

/**
 * Reducers cannot have any randomness (they must be deterministic)
 * Since the action of creating a task involves generating a random ID, it is not pure.
 * When the response to an action is not deterministic in a Redux application, both Sagas and Thunks are appropriate.
 */
export function* taskCreationSaga() {
    while (true){
        
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION);
        console.log("saga running groupID:", groupID);
        const ownerID = `U1`;
        // const ownerID = yield select(state=>state.session.id);
        const taskID = uuid();
        yield put(mutations.createTask(taskID, groupID, ownerID));
        const { res } = yield axios.post(url + `/task/new/`,{
            task:{
                id:taskID,
                group: groupID,
                owner: ownerID,
                isComplete: false,
                name: "New task"
            }
        });
        console.info("Got response,", res);
    }
}

export function* taskModificationSaga() {
    while (true){
        const task = yield take([
            mutations.SET_TASK_GROUP,
            mutations.SET_TASK_NAME,
            mutations.SET_TASK_COMPLETE
        ]);
        axios.post(url + `/task/update`,{
            task:{
                id: task.taskID,
                group: task.groupID,
                name: task.name,
                isComplete: task.isComplete
            }
        });
    }
}