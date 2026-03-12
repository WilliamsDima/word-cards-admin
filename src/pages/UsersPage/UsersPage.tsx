import { UsersList } from "@features/Users/ui/UsersList/UsersList"
import UsersListFilter from "@widgets/UsersListFilter/UsersListFilter"
import React, { useState } from "react"
import styles from "./UsersPage.module.scss"
import { useDebounce } from "@shared/hooks/useDebounce"
import PageHeader from "@shared/PageHeader/PageHeader"
import Card from "@shared/Card/Card"

function UsersPage() {
	const [search, setSearch] = useState("")
	const [debouncedSearch, setDebouncedSearch] = useState("")

	const debounceSearch = useDebounce((value: string) => {
		setDebouncedSearch(value)
	}, 400)

	const onSearchChange = (value: string) => {
		setSearch(value)
		debounceSearch(value)
	}

	return (
		<div className={styles.page}>
			<PageHeader
				title='Users'
				subtitle='Manage profiles, activity, and access.'
			/>
			<div className={styles.toolbar}>
				<UsersListFilter value={search} onChange={onSearchChange} />
			</div>
			<Card className={styles.panel}>
				<UsersList search={debouncedSearch.trim()} />
			</Card>
		</div>
	)
}

export default UsersPage
