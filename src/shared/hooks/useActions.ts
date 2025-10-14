import { useMemo } from "react"
import { useAppDispatch } from "./useStore"
import { bindActionCreators } from "@reduxjs/toolkit"
import { appActions } from "@app/store/slice/appSlice"

const allActions = {
	...appActions,
}

export const useActions = () => {
	const dispatch = useAppDispatch()

	return useMemo(() => bindActionCreators(allActions, dispatch), [dispatch])
}
