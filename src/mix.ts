import { existsSync, readFile } from 'fs'
import { resolve } from 'path'
import { exec } from '@actions/exec'

interface MixProject {
  app: string
  version: string
  elixir: string
	phoenix: string
}

export function locateMixFile(buildDir: string): string {
  const path = resolve(buildDir, 'mix.exs')
  if (!existsSync(path))
    throw new Error(`Cannot locate mix.exs project file in path: ${path}`)
  return path
}

export function parseMixFile(fileName: string): Promise<MixProject> {
  return new Promise((resolve, reject) =>
    readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve({
        app: matchMixProperty(data, 'app'),
        version: matchMixProperty(data, 'version'),
        elixir: matchMixProperty(data, 'elixir'),
				phoenix: matchPhoenixVersion(data)
      })
    })
  )
}

function matchMixProperty(string: string, property: string): string {
  const propRegex = new RegExp(`${property}: [:"](~>\\s)?([\\.\\d\\w]+)[",]?`)
  const match = string.match(propRegex)

  if (match !== null) {
    return match[2]
  } else {
    throw new Error(`Cannot parse mix file property: ${property}`)
  }
}

function matchPhoenixVersion(string: string) {
  const propRegex = /{:phoenix[:,] [:"](~>\s)?([\.\d\w]+)\}?[",]?/
  const match = string.match(propRegex)

  if (match !== null) {
    return match[2]
  } else {
    throw new Error(`Cannot parse mix file Phoenix version`)
  }
}
