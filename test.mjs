import { locateMixFile, parseMixFile } from "./lib/mix.js"

const file = locateMixFile("../github_actions_test")
console.log(await parseMixFile(file))
