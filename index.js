
const path = require('path')
const linkInfo = {
  getLinked: function (packageFile = null, checkDev = true, baseFolder = null) {
    if (packageFile == null) {
      packageFile = path.join(process.env.INIT_CWD || process.env.PWD, 'package.json')
    }
    if (baseFolder == null) {
      baseFolder = path.dirname(packageFile)
    }
    const packageContent = require(packageFile)
    let dependencies = []
    if (packageContent.dependencies) {
      dependencies = dependencies.concat(Object.keys(packageContent.dependencies))
    }
    if (checkDev && packageContent.devDependencies) {
      dependencies = dependencies.concat(Object.keys(packageContent.devDependencies))
    }
    const linked = dependencies.filter((dep) => {
      return this.isLinked(dep, baseFolder)
    })
    const sublinked = linked.reduce((res, dep) => {
      return res.concat(this.getLinked(require.resolve(dep + '/package.json'), baseFolder, checkDev))
    }, [])
    return Array.from(new Set(linked.concat(sublinked)))
  },
  baseFolder: function (depedency) {
    return path.dirname(require.resolve(depedency + '/package.json'))
  },
  isLinked: function (depedency, baseFolder = process.env.INIT_CWD || process.env.PWD) {
    if (baseFolder[baseFolder.length - 1] !== path.sep) {
      baseFolder += path.sep
    }
    return require.resolve(depedency).indexOf(baseFolder) !== 0
  },
  exec: function (depedency, cmd, options = {}) {
    const spawn = linkInfo.exec.getSpawnFunction()
    const process = linkInfo.exec.getProcess()
    const format = linkInfo.exec.formatOutput
    const context = {}

    const sub = spawn('npx', cmd, { cwd: linkInfo.baseFolder(depedency), ...options, stdio: 'pipe' })

    sub.stdout.on('data', function (data) {
      process.stdout.write(format(data, depedency, context))
    })

    sub.stderr.on('data', function (data) {
      process.stderr.write(format(data, depedency, context))
    })

    return sub
  }
}

linkInfo.exec.getSpawnFunction = function () {
  try {
    return require('cross-spawn')
  } catch (e) {
    return require('child_process').spawn
  }
}

linkInfo.exec.getProcess = function () {
  return process
}

linkInfo.exec.formatOutput = function (output, moduleName, context) {
  const prefix = `   [${moduleName}] `
  const parts = output.toString().split(/\r?\n/g)
  const wasOngoing = context.ongoing
  const ongoing = context.ongoing = parts[parts.length - 1] !== ''
  if (!ongoing) {
    parts.pop()
  }
  return (wasOngoing ? '' : prefix) + parts.join('\n' + prefix) + (ongoing ? '' : '\n')
}

module.exports = linkInfo
