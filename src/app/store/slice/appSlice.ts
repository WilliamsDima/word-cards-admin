import { type PayloadAction, createSlice } from "@reduxjs/toolkit"
import type { IAplication } from "@shared/api/types"

type InitialState = {
	firebaseApp: IAplication | null
	isAdmin: boolean
}

const initialState: InitialState = {
	firebaseApp: null,
	isAdmin: false,
}

export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setFirebaseApp: (state, { payload }: PayloadAction<null | IAplication>) => {
			state.firebaseApp = payload
		},
		setIsAdmin: (state, { payload }: PayloadAction<boolean>) => {
			state.isAdmin = payload
		},
	},
})

export const appActions = appSlice.actions

export default appSlice.reducer
