import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage/session'
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from 'redux-thunk'

import rootReducer from './reducer/rootReducer'

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
    const store = createStore(persistedReducer,
        composeWithDevTools(applyMiddleware(thunk))
    )
    const persistor = persistStore(store)
    return { store, persistor }
}