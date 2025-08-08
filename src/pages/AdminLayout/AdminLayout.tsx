import React from "react"
import Sidebar from "@widgets/Sidebar/Sidebar"
import { Outlet } from "react-router-dom"

const AdminLayout: React.FC = () => {
	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Sidebar />
			<main style={{ flexGrow: 1, padding: 20 }}>
				<Outlet />
			</main>
		</div>
	)
}

export default AdminLayout
