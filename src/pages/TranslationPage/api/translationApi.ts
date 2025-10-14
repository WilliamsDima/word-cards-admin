import axios from "axios"
import type { IJSONLanguage } from "./json"
import { Base64 } from "js-base64"

export type JsonData = {
	json: IJSONLanguage
	sha: string
}

export type GitResponse = {
	content: {
		name: string
		path: string
		sha: string
		size: number
		url: string
		html_url: string
		git_url: string
		download_url: string
		type: "file"
		_links: {
			self: string
			git: string
			html: string
		}
	}
	commit: {
		sha: string
		node_id: string
		url: string
		html_url: string
		author: {
			name: string
			email: string
			date: string
		}
		committer: {
			name: string
			email: string
			date: string
		}
		tree: {
			sha: string
			url: string
		}
		message: string
		parents: [
			{
				sha: string
				url: string
				html_url: string
			}
		]
		verification: {
			verified: boolean
			reason: string
			signature: null
			payload: null
			verified_at: null
		}
	}
}

const token = import.meta.env.VITE_GITHUB_TOKEN
const owner = import.meta.env.VITE_GITHUB_OWNER
const repo = import.meta.env.VITE_GITHUB_REPO

export const getLanguageJson = async (path: string) => {
	try {
		const res = await axios.get(
			`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
			{
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3+json",
				},
			}
		)

		const jsonStr = Base64.decode(res.data.content)
		const json = JSON.parse(jsonStr)
		const sha = res.data.sha // нужен для PUT
		return { json, sha } as JsonData
	} catch (error) {
		console.log("getLanguageJson error", error)
		return { error: true }
	}
}

export const updateLanguageJson = async (jsonData: JsonData, path: string) => {
	try {
		// Сначала преобразуем объект в JSON строку
		const jsonStr = JSON.stringify(jsonData.json, null, 2)

		// Кодируем JSON в Base64 с правильной UTF-8
		const content = Base64.encode(jsonStr)

		const res = await axios.put(
			`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
			{
				message: "Обновление перевода",
				content: content,
				sha: jsonData.sha, // текущая версия файла
				branch: "main", // ветка для коммита
			},
			{
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3+json",
				},
			}
		)

		return res.data as GitResponse
	} catch (error) {
		console.log("updateLanguageJson error", error)
		return { error: true }
	}
}
