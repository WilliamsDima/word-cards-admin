import fs from "node:fs"
import path from "node:path"

const projectRoot = process.cwd()
const svgDir = path.join(projectRoot, "src", "assets", "icons", "svg")
const outFile = path.join(projectRoot, "src", "assets", "icons", "Icon.tsx")

const toPascalCase = (value) => {
	const parts = value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
	if (parts.length === 0) return "Icon"
	const name = parts
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join("")
	const safe = /^[0-9]/.test(name) ? `Icon${name}` : name
	return safe || "Icon"
}

const svgFiles = fs
	.readdirSync(svgDir)
	.filter((file) => file.toLowerCase().endsWith(".svg"))
	.sort((a, b) => a.localeCompare(b, "en"))

if (svgFiles.length === 0) {
	console.log("No SVG files found in:", svgDir)
	process.exit(0)
}

const entries = svgFiles.map((file) => {
	const base = path.basename(file, ".svg")
	const component = `${toPascalCase(base)}Icon`
	const importPath = `@assets/icons/svg/${file}?react`
	return { base, component, importPath }
})

const imports = entries
	.map((e) => `import ${e.component} from "${e.importPath}"`)
	.join("\n")

const namesUnion = entries.map((e) => `"${e.base}"`).join(" | ")

const cases = entries
	.map(
		(e) =>
			`\t\tcase "${e.base}":\n\t\t\treturn <${e.component} width={width} height={height} />\n`
	)
	.join("\n")

const content = `import { FC } from "react"
${imports}

export type SVGName = ${namesUnion}

export type IconProps = {
\tname: SVGName
\twidth: number | string | undefined
\theight: number | string | undefined
}

export const Icon: FC<IconProps> = ({ name, height, width }) => {
\tswitch (name) {
${cases}
\t\tdefault:
\t\t\treturn <></>
\t}
}
`

fs.writeFileSync(outFile, content, "utf8")
console.log(`Updated ${path.relative(projectRoot, outFile)} with ${entries.length} icon(s).`)
