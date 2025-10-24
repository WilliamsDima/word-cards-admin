import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import DoneIcon from "@assets/icons/done-green-48.svg?react"
import Loading from "@shared/Loading/Loading"
import DeleteIcon from "@assets/icons/delete-red-64.svg?react"
import AddIcon from "@assets/icons/add-square-green-64.svg?react"
import styles from "./SocialsPage.module.scss"
import { useAppSelector } from "@shared/hooks/useStore"
import type { ISocial, SocialKey, SocialKeys } from "@shared/api/types"
import { useChangeSocialsMutation } from "@pages/AplicationPage/api/AppServices"
import Input from "@shared/Input/Input"

type SocialsDataType = Record<SocialKey, ISocial>

function SocialsPage() {
	const { firebaseApp } = useAppSelector(store => store.app)

	const [socialsData, setSocialsData] = useState<SocialsDataType | null>(null)

	const [changeSocials, { isLoading }] = useChangeSocialsMutation()

	const inputs = useMemo(() => {
		return socialsData ? Object.values(socialsData) : []
	}, [socialsData])

	const onChangeInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>, it: ISocial, fieldName: SocialKeys) => {
			setSocialsData(prev => {
				return prev
					? {
							...prev,
							[it.key]: {
								...prev[it.key],
								[fieldName]: e.target.value,
							},
					  }
					: prev
			})
		},
		[]
	)

	const onSaveHandler = useCallback(() => {
		const socials = socialsData ? Object.values(socialsData) : []

		if (socials.length) changeSocials({ socials })
	}, [changeSocials, socialsData])

	useEffect(() => {
		if (firebaseApp?.socials) {
			const map: Partial<SocialsDataType> = {}
			firebaseApp?.socials.forEach(it => {
				map[it.key] = it
			})
			setSocialsData(map as SocialsDataType)
		}
	}, [firebaseApp])

	return (
		<div>
			<div className={styles.inputs}>
				<h1 className={styles.title}>Социальные сети</h1>

				{inputs.map((it, i) => {
					const prevIt = firebaseApp?.socials.find(item => item.id === it.id)
					return (
						<div className={styles.group} key={it.id}>
							<div className={styles.groupNameBlock}>
								<DeleteIcon width={25} height={25} />
								<p className={styles.index}>{i + 1}.</p>
								<p className={styles.blockName}>{prevIt?.name}</p>
							</div>

							<p className={styles.blockName}>Name</p>

							<div className={styles.inputWrapper}>
								<Input
									value={it.name}
									onChange={e => onChangeInput(e, it, "name")}
								/>
								{prevIt && prevIt?.name !== it.name && (
									<DoneIcon onClick={onSaveHandler} width={28} height={28} />
								)}
								{isLoading && <Loading className={styles.loader} />}
							</div>

							<p className={styles.blockName}>icon</p>

							<div className={styles.inputWrapper}>
								<Input
									value={it.icon}
									onChange={e => onChangeInput(e, it, "icon")}
								/>
								{prevIt && prevIt?.icon !== it.icon && (
									<DoneIcon onClick={onSaveHandler} width={28} height={28} />
								)}
								{isLoading && <Loading className={styles.loader} />}
							</div>
						</div>
					)
				})}
			</div>

			<div className={styles.addBtn}>
				<AddIcon />
			</div>
		</div>
	)
}

export default SocialsPage
