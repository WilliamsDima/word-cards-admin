import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import styles from "./SocialsPage.module.scss"
import SocialItem from "./ui/SocialItem/SocialItem"
import {
	useGetAppConfigQuery,
	useUpdateAppConfigMutation,
} from "@shared/api/services/appConfig/AppConfigQuery"
import { Icon } from "@assets/icons/Icon"
import PageHeader from "@shared/PageHeader/PageHeader"
import Card from "@shared/Card/Card"
import { SocialDeleteModal } from "./ui/SocialDeleteModal"
import type { ISocial, SocialKeys } from "@shared/api/services/appConfig/types"
import { useToast } from "@shared/Toast/useToast"

function SocialsPage() {
	const { data } = useGetAppConfigQuery()
	const [updateConfig, { isLoading }] = useUpdateAppConfigMutation()
	const toast = useToast()

	const [socialsData, setSocialsData] = useState<ISocial[]>([])
	const [savingId, setSavingId] = useState<number | string | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<ISocial | null>(null)

	const inputs = useMemo(() => socialsData, [socialsData])

	const persist = useCallback(
		async (nextSocials: ISocial[], id?: number | string) => {
			if (!data) return
			setSavingId(id ?? null)
			try {
				await updateConfig({ ...data, socials: nextSocials }).unwrap()
				return { ok: true as const }
			} catch (err) {
				return { ok: false as const, err }
			} finally {
				setSavingId(null)
			}
		},
		[data, updateConfig],
	)

	const onDelete = useCallback(
		(id: number | string) => {
			const target = socialsData.find(it => it.id === id) || null
			setDeleteTarget(target)
		},
		[socialsData],
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
			const result = await persist(socialsData, id)
			if (!result) return

			if (result.ok) {
				const saved = socialsData.find(item => item.id === id)
				toast.success("Соцсеть сохранена", saved?.name || "Без названия")
			} else {
				const serverError =
					(result.err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось сохранить соцсеть",
				)
			}
		},
		[persist, socialsData, toast],
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
					<h1 className={styles.cardTitle}>Социальные сети</h1>

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
						width={50}
						height={50}
						onClick={onAdd}
					/>
				</div>
			</Card>

			<SocialDeleteModal
				deleteTarget={deleteTarget}
				socialsData={socialsData}
				setSocialsData={setSocialsData}
				persist={persist}
				setDeleteTarget={setDeleteTarget}
				toast={toast}
			/>
		</div>
	)
}

export default SocialsPage
