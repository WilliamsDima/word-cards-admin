import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const svgDir = path.join(projectRoot, "src", "assets", "icons", "svg")
const webpDir = path.join(projectRoot, "src", "assets", "icons", "webp")
const outFile = path.join(projectRoot, "src", "assets", "icons", "Icon.tsx")

const toPascalCase = (value) => {
	const parts = value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
	if (parts.length === 0) return "Icon"
	const name = parts.map((part) => part[0].toUpperCase() + part.slice(1)).join("")
	return /^[0-9]/.test(name) ? `Icon${name}` : name || "Icon"
}

const readFiles = (dir, ext) =>
	fs
		.existsSync(dir)
		? fs
				.readdirSync(dir)
				.filter((file) => file.toLowerCase().endsWith(ext))
				.sort((a, b) => a.localeCompare(b, "en"))
		: []

const svgFiles = readFiles(svgDir, ".svg")
const webpFiles = readFiles(webpDir, ".webp")

const svgEntries = svgFiles.map((file) => {
	const base = path.basename(file, ".svg")
	const component = `${toPascalCase(base)}Icon`
	const importPath = `@assets/icons/svg/${file}?react`
	return { base, component, importPath }
})

const webpEntries = webpFiles.map((file) => {
	const base = path.basename(file, ".webp")
	const component = `${toPascalCase(base)}Webp`
	const importPath = `@assets/icons/webp/${file}`
	return { base, component, importPath }
})

const svgImports = svgEntries
	.map((e) => `import ${e.component} from "${e.importPath}"`)
	.join("\n")

const webpImports = webpEntries
	.map((e) => `import ${e.component} from "${e.importPath}"`)
	.join("\n")

const svgNamesUnion =
	svgEntries.length > 0 ? svgEntries.map((e) => `\t| "${e.base}"`).join("\n") : "never"

const webpNamesUnion =
	webpEntries.length > 0
		? webpEntries.map((e) => `"${e.base}"`).join(" | ")
		: "never"

const svgCases = svgEntries
	.map(
		(e) =>
			`\t\tcase "${e.base}":\n\t\t\treturn <${e.component} width={width} height={height} {...svgProps} />\n`
	)
	.join("\n")

const webpCases = webpEntries
	.map(
		(e) =>
			`\t\t\tcase "${e.base}":\n\t\t\t\treturn (\n\t\t\t\t\t<img\n\t\t\t\t\t\tsrc={${e.component}}\n\t\t\t\t\t\talt={alt ?? name}\n\t\t\t\t\t\t{...webpProps}\n\t\t\t\t\t\twidth={width}\n\t\t\t\t\t\theight={height}\n\t\t\t\t\t/>\n\t\t\t\t)\n`
	)
	.join("\n")

const content = `import type { ImgHTMLAttributes, SVGAttributes } from "react"
${svgImports}${svgImports && webpImports ? "\n" : ""}${webpImports}

export type SvgName =
${svgNamesUnion}
export type WebpName = ${webpNamesUnion}

type KindMap = {
\tsvg: {
\t\tname: SvgName
\t} & SVGAttributes<SVGSVGElement>
\twebp: {
\t\tname: WebpName
\t\twidth: number
\t\theight: number
\t} & ImgHTMLAttributes<HTMLImageElement>
}

export function Icon<K extends keyof KindMap>(props: { kind: K } & KindMap[K]) {
\tif (props.kind === "webp") {
\t\tconst webpProps = props as { kind: "webp" } & KindMap["webp"]
\t\tconst { name, width, height, alt } = webpProps
\t\tswitch (name) {
${webpCases}
\t\t\tdefault:
\t\t\t\treturn <></>
\t\t}
\t}

\tconst svgProps = props as { kind: "svg" } & KindMap["svg"]
\tconst { name, width, height } = svgProps

\tswitch (name) {
${svgCases}
\t\tdefault:
\t\t\treturn <></>
\t}
}
`

fs.writeFileSync(outFile, content, "utf8")
console.log(
	`Updated ${path.relative(projectRoot, outFile)} with ${svgEntries.length} svg and ${webpEntries.length} webp icon(s).`
)
