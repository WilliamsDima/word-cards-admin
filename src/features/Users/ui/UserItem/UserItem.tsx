import React, { FC } from "react"
import styles from "./UserItem.module.scss"
import { IUser } from "@features/Users/model/user"
import cn from "classnames"
import { getLastActiveDay } from "@features/Users/helpers/user"

type Props = {
	user: IUser
}

export const UserItem: FC<Props> = ({ user }) => {
	return (
		<li className={styles.item}>
			<img className={styles.image} src={user.image} />

			<div className={styles.content}>
				<div className={styles.info}>
					<div className={styles.infoItem}>
						<p>uid:</p>
						<h3 className={styles.name}>{user.uid}</h3>
					</div>

					<div className={styles.infoItem}>
						<p>name:</p>
						<h3 className={styles.name}>{user.name}</h3>
					</div>

					<div className={styles.infoItem}>
						<p>способ регистрации:</p>
						<h3 className={styles.name}>{user.email ? "Google" : "Vk"}</h3>
					</div>
				</div>

				<div className={cn(styles.info)}>
					<div className={styles.infoItem}>
						<p>дата регистрации: </p>
						<h3 className={styles.name}>
							{new Intl.DateTimeFormat("ru-RU", {
								dateStyle: "medium",
							}).format(user.dateRegistration)}
						</h3>
					</div>

					<div className={styles.infoItem}>
						<p>email: </p>
						<h3 className={styles.name}>{user.email || "---"}</h3>
					</div>

					<div className={styles.infoItem}>
						<p>последняя активность: </p>
						<h3 className={styles.name}>{getLastActiveDay(user) || "---"}</h3>
					</div>
				</div>
			</div>
		</li>
	)
}
