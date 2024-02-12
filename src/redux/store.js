import { createStore } from 'redux';
import counterReducer from './Reducer';

// Passing counterReducer to createStore
const store = createStore(counterReducer);

export default store; 