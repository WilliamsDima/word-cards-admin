import { collection, getDocs } from "firebase/firestore"
import { baseRTK } from "@app/api/BaseRTK"
import { db } from "@shared/config/firebase"
import { IUser } from "../model/user"

export const usersAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		// получение пользователей
		getUsers: builder.query<IUser[], void>({
			async queryFn() {
				const usersRef = collection(db, "users")
				const querySnapshot = await getDocs(usersRef)

				const usersList: IUser[] = []
				querySnapshot.forEach(doc => {
					usersList.push(doc.data() as IUser)
				})

				return { data: usersList }
			},
			providesTags: ["users"],
		}),
	}),
})

export const { useGetUsersQuery } = usersAPI
