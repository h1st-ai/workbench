import { configureStore } from '@reduxjs/toolkit';
import reducer from 'reducers';

const store = configureStore({ reducer, devTools: true });

export default store;
