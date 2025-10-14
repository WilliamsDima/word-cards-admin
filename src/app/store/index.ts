import { baseRTK } from "@app/api/BaseRTK"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import appReducer from "./slice/appSlice"

const rootReducer = combineReducers({
	app: appReducer,
	[baseRTK.reducerPath]: baseRTK.reducer,
})

export const store = configureStore({
	reducer: rootReducer,

	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat(baseRTK.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
