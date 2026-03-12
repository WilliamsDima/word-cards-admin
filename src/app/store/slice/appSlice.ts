import { type PayloadAction, createSlice } from "@reduxjs/toolkit"

type InitialState = {
	isAdmin: boolean
}

const initialState: InitialState = {
	isAdmin: false,
}

export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setIsAdmin: (state, { payload }: PayloadAction<boolean>) => {
			state.isAdmin = payload
		},
	},
})

export const appActions = appSlice.actions

export default appSlice.reducer
