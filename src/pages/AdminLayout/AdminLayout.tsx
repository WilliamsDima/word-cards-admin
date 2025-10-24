import React from "react"
import Sidebar from "@widgets/Sidebar/Sidebar"
import { Outlet } from "react-router-dom"
import styles from "./AdminLayout.module.scss"

const AdminLayout: React.FC = () => {
	return (
		<div className={styles.wrapper}>
			<Sidebar />
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	)
}

export default AdminLayout
