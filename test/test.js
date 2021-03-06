const chai = require('chai')
chai.use(require('chai-fs'))
const assert = chai.assert
const npmLinkInfo = require('../index')
const path = require('path')

describe('npm-link-info', function () {
  it('can find if a module is not linked', function () {
    assert.isFalse(npmLinkInfo.isLinked('my-module'))
    assert.isFalse(npmLinkInfo.isLinked('mocha', path.resolve('./node_modules')))
  })
  it('can find if a module is linked', function () {
    assert.isTrue(npmLinkInfo.isLinked('my-module', path.resolve('./node_modules')))
  })
  it('can list linked modules', function () {
    assert.deepEqual(npmLinkInfo.getLinked(null, true, path.resolve('./node_modules')), ['my-module'])
  })
  it('can list linked modules without dev', function () {
    assert.deepEqual(npmLinkInfo.getLinked(null, false, path.resolve('./node_modules')), [])
  })
  it('can get the path of a module folder', function () {
    assert.deepEqual(npmLinkInfo.baseFolder('my-module'), path.resolve('./test/my-module'))
  })
  it('can exec in the path of a module folder', function (done) {
    var out = ''
    npmLinkInfo.exec.getProcess = function () {
      return {
        stdout: {
          write: function (data) {
            out += data
          }
        },
        stderr: {
          write: function (data) {
            out += data
          }
        }
      }
    }
    const sub = npmLinkInfo.exec('my-module', ['node', 'output.js'])
    sub.on('close', function () {
      assert.equal(out, '   [my-module] Lorem\n   [my-module] ipsum\n   [my-module] dolor\n   [my-module] sit\n   [my-module] amet\n')
      done()
    })
  })
})
