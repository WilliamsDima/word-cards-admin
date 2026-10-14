import React, { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import cn from "classnames"
import styles from "./UserProfileNotifications.module.scss"
import Button from "@shared/Button/Button"
import Input from "@shared/Input/Input"
import { useSendUserPushNotificationMutation } from "@shared/api/services/userNotificationSettings/UserNotificationSettingsQuery"
import {
	DEFAULT_PUSH_TITLE,
	MAX_PUSH_BODY_LENGTH,
	MAX_PUSH_TITLE_LENGTH,
} from "@shared/api/services/userNotificationSettings/types"
import {
	EMPTY_PUSH_FORM,
	buildPushErrorResult,
	buildPushSuccessResult,
	getTextLength,
	validatePushForm,
	type PushFormValues,
	type PushSendResult,
} from "../lib/pushNotificationForm"
import UserProfilePushResult from "./UserProfilePushResult"

const UserProfilePushForm: React.FC = () => {
	const { id } = useParams()

	const [values, setValues] = useState<PushFormValues>(EMPTY_PUSH_FORM)
	const [isBodyTouched, setIsBodyTouched] = useState(false)
	const [result, setResult] = useState<PushSendResult | null>(null)

	const [sendPush, { isLoading }] = useSendUserPushNotificationMutation()

	const validation = useMemo(() => validatePushForm(values), [values])

	const titleCounter = useMemo(
		() => `${getTextLength(values.title.trim())} / ${MAX_PUSH_TITLE_LENGTH}`,
		[values.title],
	)

	const bodyCounter = useMemo(
		() => `${getTextLength(values.body.trim())} / ${MAX_PUSH_BODY_LENGTH}`,
		[values.body],
	)

	const bodyError = useMemo(
		() => (isBodyTouched ? (validation.errors.body ?? "") : ""),
		[isBodyTouched, validation.errors.body],
	)

	const textareaClassName = useMemo(
		() => cn(styles.textarea, { [styles.textareaError]: Boolean(bodyError) }),
		[bodyError],
	)

	const isSubmitDisabled = useMemo(
		() => isLoading || !validation.parsed || !id,
		[id, isLoading, validation.parsed],
	)

	const onTitleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target
			setValues(prev => ({ ...prev, title: value }))
		},
		[],
	)

	const onBodyChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => {
			const { value } = event.target
			setValues(prev => ({ ...prev, body: value }))
		},
		[],
	)

	const onBodyBlur = useCallback(() => {
		setIsBodyTouched(true)
	}, [])

	const onSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			setIsBodyTouched(true)
			const parsed = validation.parsed
			if (!parsed || !id) return
			setResult(null)
			try {
				const response = await sendPush({ userId: id, ...parsed }).unwrap()
				setResult(buildPushSuccessResult(response))
				setValues(prev => ({ ...prev, body: "" }))
				setIsBodyTouched(false)
			} catch (err) {
				setResult(buildPushErrorResult(err))
			}
		},
		[id, sendPush, validation.parsed],
	)

	return (
		<form className={styles.pushForm} onSubmit={onSubmit} noValidate>
			<div className={styles.pushHeader}>
				<h3 className={styles.sectionTitle}>Отправить push-уведомление</h3>
				<p className={styles.hint}>
					Уведомление уйдёт на все зарегистрированные устройства пользователя.
				</p>
			</div>

			<label className={styles.field}>
				<span className={styles.label}>Заголовок (необязательно)</span>
				<Input
					type='text'
					name='push-title'
					placeholder={DEFAULT_PUSH_TITLE}
					maxLength={MAX_PUSH_TITLE_LENGTH}
					value={values.title}
					onChange={onTitleChange}
					disabled={isLoading}
					isError={Boolean(validation.errors.title)}
				/>
				{validation.errors.title ? (
					<span className={styles.fieldError}>{validation.errors.title}</span>
				) : (
					<span className={styles.fieldHint}>{titleCounter}</span>
				)}
			</label>

			<label className={styles.field}>
				<span className={styles.label}>Текст</span>
				<textarea
					name='push-body'
					className={textareaClassName}
					rows={4}
					maxLength={MAX_PUSH_BODY_LENGTH}
					value={values.body}
					onChange={onBodyChange}
					onBlur={onBodyBlur}
					disabled={isLoading}
					required
					aria-invalid={bodyError ? true : undefined}
				/>
				{bodyError ? (
					<span className={styles.fieldError}>{bodyError}</span>
				) : (
					<span className={styles.fieldHint}>{bodyCounter}</span>
				)}
			</label>

			<div className={styles.actions}>
				<Button
					type='submit'
					className={styles.primaryBtn}
					disabled={isSubmitDisabled}
				>
					{isLoading ? "Отправка..." : "Отправить"}
				</Button>
			</div>

			{result ? <UserProfilePushResult result={result} /> : <></>}
		</form>
	)
}

export default UserProfilePushForm
