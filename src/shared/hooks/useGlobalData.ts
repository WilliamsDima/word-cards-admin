import { useEffect } from "react"
import { useActions } from "./useActions"
import { useGetFirebaseAppQuery } from "@shared/api/GlobalServices"
import { useAppSelector } from "./useStore"

export const useGlobalData = () => {
	const { setFirebaseApp } = useActions()
	const isAdmin = useAppSelector(store => store.app.isAdmin)

	const { data: firebaseApp } = useGetFirebaseAppQuery(undefined, {
		skip: !isAdmin,
	})

	useEffect(() => {
		console.log("firebaseApp", firebaseApp)

		setFirebaseApp(firebaseApp)
	}, [firebaseApp])
}
