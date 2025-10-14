import { doc, getDoc } from "firebase/firestore"
import { baseRTK } from "@app/api/BaseRTK"
import { db } from "@shared/config/firebase"
import { IAplication } from "./types"

export const globalAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getFirebaseApp: builder.query<IAplication, void>({
			async queryFn() {
				const docRef = doc(db, "app", "info")
				const docSnap = await getDoc(docRef)
				const data = docSnap.data() as IAplication

				return { data }
			},
			providesTags: ["firebaseApp"],
		}),
	}),
})

export const { useGetFirebaseAppQuery } = globalAPI
