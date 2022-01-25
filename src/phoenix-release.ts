import * as os from 'os'
// import from 'mix'
import * as core from '@actions/core'

import { exec } from '@actions/exec'

const target = [os.arch(), os.platform(), os.release()].join('-')
// const app =  [mix.version(), mix.appName()].join('-')
