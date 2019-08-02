
const path = require('path')

module.exports = {
  getLinked: function (packageFile = null, checkDev = true, baseFolder = null) {
    if (packageFile == null) {
      packageFile = path.join(process.env.PWD, 'package.json')
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
  isLinked: function (depedency, baseFolder = process.env.PWD) {
    if (baseFolder[baseFolder.length - 1] !== path.sep) {
      baseFolder += path.sep
    }
    return require.resolve(depedency).indexOf(baseFolder) !== 0
  }
}
