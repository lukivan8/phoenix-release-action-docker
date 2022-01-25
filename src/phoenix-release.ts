import * as os from 'os'
import { locateMixFile, parseMixFile } from './mix'

import * as core from '@actions/core'
import { exec } from '@actions/exec'

let mixFile: string | undefined

try {
	mixFile = locateMixFile('../github_actions_test')
} catch (err: any) {
	core.setFailed(`Action failed with error ${err.message}`);
}

const mixProject = await parseMixFile(mixFile!)

const target = [os.arch(), os.platform(), os.release()].join('-')
const app =  [mixProject.app, mixProject.version].join('-')

core.info("Mix application: " + app)
core.info("Build target: " + target)

exec("mix phx.gen.release")
exec("mix release")
