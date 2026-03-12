import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import styles from "./SocialsPage.module.scss"
import type { ISocial, SocialKeys } from "@shared/api/types"
import SocialItem from "./ui/SocialItem/SocialItem"
import {
	useGetAppConfigQuery,
	useUpdateAppConfigMutation,
} from "@shared/api/services/appConfig/AppConfigQuery"
import { Icon } from "@assets/icons/Icon"
import PageHeader from "@shared/PageHeader/PageHeader"
import Card from "@shared/Card/Card"

type SocialsDataType = ISocial[]

function SocialsPage() {
	const { data } = useGetAppConfigQuery()
	const [updateConfig, { isLoading }] = useUpdateAppConfigMutation()

	const [socialsData, setSocialsData] = useState<SocialsDataType>([])
	const [savingId, setSavingId] = useState<number | string | null>(null)

	const inputs = useMemo(() => socialsData, [socialsData])

	const persist = useCallback(
		async (nextSocials: ISocial[], id?: number | string) => {
			if (!data) return
			setSavingId(id ?? null)
			try {
				await updateConfig({ ...data, socials: nextSocials }).unwrap()
			} finally {
				setSavingId(null)
			}
		},
		[data, updateConfig],
	)

	const onDelete = useCallback(
		async (id: number | string) => {
			const next = socialsData.filter(it => it.id !== id)
			setSocialsData(next)
			await persist(next, id)
		},
		[persist, socialsData],
	)

	const onAdd = useCallback(() => {
		const tempId = `temp-${Date.now()}`
		setSocialsData(prev => [
			...prev,
			{
				id: tempId,
				link: "",
				icon: "",
				name: "",
				key: "",
			},
		])
	}, [])

	const onChangeInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>, it: ISocial, fieldName: SocialKeys) => {
			setSocialsData(prev =>
				prev.map(item =>
					item.id === it.id ? { ...item, [fieldName]: e.target.value } : item,
				),
			)
		},
		[],
	)

	const onSaveHandler = useCallback(
		async (id: number | string) => {
			await persist(socialsData, id)
		},
		[persist, socialsData],
	)

	useEffect(() => {
		if (data?.socials) {
			setSocialsData(data.socials)
		}
	}, [data])

	return (
		<div className={styles.page}>
			<PageHeader
				title='Соц сети'
				subtitle='Управление внешними ссылками и иконками сервиса.'
			/>

			<Card className={styles.card}>
				<div className={styles.inputs}>
					{inputs.map((it, i) => {
						const prevIt = data?.socials.find(item => item.id === it.id)
						return (
							<SocialItem
								key={it.id}
								index={i}
								item={it}
								prevIt={prevIt}
								isLoading={isLoading && savingId === it.id}
								onChangeInput={onChangeInput}
								onDelete={onDelete}
								onSaveHandler={onSaveHandler}
							/>
						)
					})}
				</div>

				<div className={styles.addBtn}>
					<Icon
						kind='svg'
						name='add-square-green-64'
						width={20}
						height={20}
						onClick={onAdd}
					/>
				</div>
			</Card>
		</div>
	)
}

export default SocialsPage
