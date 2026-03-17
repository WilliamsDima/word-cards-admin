import React, { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import styles from "../UserProfilePage.module.scss"
import type { IUser } from "@entities/api/users/types"
import { useGetUserByIdQuery } from "@entities/api/users/UsersQuery"
import UserProfileGridItem, {
	ProfileGridItemType,
} from "../ui/UserProfileGridItem"
import UserProfilePageGridsSkeleton from "../UserProfilePageGridsSkeleton"
import Accordion from "@shared/Accordion/Accordion"

const buildGrids = (
	user: IUser | undefined,
	createdAt: string,
	id: string | undefined,
	lastActiveAt: string,
) => [
	{
		title: "Account",
		rows: [
			{ label: "Email", value: user?.email },
			{ label: "Auth provider", value: user?.email ? "Google" : "Vk" },
			{ label: "UID", value: user?.google_uid },
		],
	},
	{
		title: "Activity",
		rows: [
			{ label: "Registered", value: createdAt },
			{ label: "Last active", value: lastActiveAt },
			{ label: "Status", value: "Active" },
		],
	},
	{
		title: "Profile",
		rows: [
			{ label: "User id", value: user?.id ?? id },
			{ label: "Avatar", value: user?.image ? "Set" : "Not set" },
			{ label: "Notes", value: "N/A" },
		],
	},
]

export const UserProfileGrids = () => {
	const { id } = useParams()
	const location = useLocation()
	const userFromState = (location.state as { user?: IUser } | undefined)?.user

	const { data, isLoading } = useGetUserByIdQuery(id ?? "", {
		skip: !id,
	})

	const user: IUser | undefined = useMemo(
		() => data ?? userFromState,
		[data, userFromState],
	)
	const showSkeleton = useMemo(() => isLoading && !user, [isLoading, user])

	const createdAt = useMemo(
		() =>
			user?.created_at
				? new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(
						new Date(user.created_at),
					)
				: "N/A",
		[user],
	)

	const lastActiveAt = useMemo(
		() =>
			user?.last_active_at
				? new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(
						new Date(user.last_active_at),
					)
				: "N/A",
		[user],
	)

	const grids: ProfileGridItemType[] = useMemo(() => {
		return buildGrids(user, createdAt, id, lastActiveAt)
	}, [createdAt, user, id, lastActiveAt])

	return (
		<Accordion
			header={
				<div className={styles.gridsHeader}>
					<span className={styles.gridsTitle}>Данные профиля</span>
				</div>
			}
			className={styles.gridsAccordion}
			headerClassName={styles.gridsHeaderButton}
			contentClassName={styles.gridsContent}
			defaultOpen={false}
		>
			<div className={styles.grid}>
				{showSkeleton ? (
					<UserProfilePageGridsSkeleton />
				) : (
					grids.map(it => <UserProfileGridItem key={it.title} item={it} />)
				)}
			</div>
		</Accordion>
	)
}
