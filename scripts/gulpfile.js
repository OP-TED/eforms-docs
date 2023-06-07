// see https://gitlab.com/antora/demo/docs-site/blob/watch-mode/gulpfile.js
// see https://gitlab.com/antora/antora/-/issues/329
'use strict';

['http_proxy', 'https_proxy', 'no_proxy'].forEach((name) => {
  if (process.env[name]) process.env[name.toUpperCase()] = process.env[name]
})
process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE = ''
require('global-agent/bootstrap')

const connect = require('gulp-connect')
const fs = require('fs')
const generator = require('@antora/site-generator-default')
const yaml = require('js-yaml');

const { reload: livereload } = process.env.LIVERELOAD === 'true' ? require('gulp-connect') : {}
const { series, src, watch } = require('gulp')

const antoraArgs = []

readProperties()

if(process.env['SEARCH_ENABLED']) {
  if(process.env['SEARCH_ENGINE'] == 'lunr') {
    antoraArgs.push('--extension', 'lunr-search')
  } else if(process.env['SEARCH_ENGINE'] == 'algolia') {
    if(!process.env['ALGOLIA_API_KEY']) { throw 'Undefined environment variable ALGOLIA_API_KEY'}
    if(!process.env['ALGOLIA_API_ID']) { throw 'Undefined environment variable ALGOLIA_API_ID'}
    if(!process.env['ALGOLIA_INDEX_NAME']) { throw 'Undefined environment variable ALGOLIA_INDEX_NAME'}
  }
}

if(process.env['NODE_DEBUG']) {
  antoraArgs.push('--log-level', 'debug')
} else {
  console['debug'] = function(){};
  antoraArgs.push( '--log-level', 'info')
}

const playbookFilename = fs.existsSync('antora-playbook-local.yml')  ? 'antora-playbook-local.yml' : 'antora-playbook.yml'
antoraArgs.push('--playbook', playbookFilename)

const playbook = yaml.safeLoad(fs.readFileSync(playbookFilename, 'utf8'))
const outputDir = process.env['SITE_DIR'] || (playbook.output || {}).dir || 'build/site'
antoraArgs.push('--to-dir', outputDir)

const serverConfig = { name: 'Preview Site', livereload, port: 5000, root: outputDir }

const watchPatterns = playbook.content.sources.filter((source) => !source.url.includes(':')).reduce((accum, source) => {
  accum.push(`${source.url}/${source.start_path ? source.start_path + '/' : ''}antora.yml`)
  accum.push(`${source.url}/${source.start_path ? source.start_path + '/' : ''}modules`)
  return accum
}, [])

function readProperties () {
  if(fs.existsSync('env.yml')) {
    const env = yaml.safeLoad(fs.readFileSync('env.yml', 'utf8'))

    const propsFromFile = Object.assign({}, ...function _flatten(o, path=[]) {
      return []
      .concat(...Object.keys(o)
        .map(key => {
          return typeof o[key] === 'object' ?
            _flatten(o[key], path.concat(key.toUpperCase())) :
            ({[path.concat(key.toUpperCase()).join('_')]: o[key]})
        }))
      }(env)
    )

    process.env = Object.assign(propsFromFile, process.env)
  }
}

function generate (done) {
  console.debug(`ALGOLIA_API_ID: ${process.env['ALGOLIA_API_ID']}`)
  console.debug(`ALGOLIA_API_KEY: ${process.env['ALGOLIA_API_KEY']}`)
  console.debug(`ALGOLIA_INDEX_NAME: ${process.env['ALGOLIA_INDEX_NAME']}`)
  console.debug(`NODE_DEBUG: ${process.env['NODE_DEBUG']}`)
  console.debug(`SEARCH_ENABLED: ${process.env['SEARCH_ENABLED']}`)
  console.debug(`SEARCH_ENGINE: ${process.env['SEARCH_ENGINE']}`)
  
  console.log(`Using playbook [${playbookFilename}]`)

  generator(antoraArgs, process.env)
    .then(() => done())
    .catch((err) => {
      console.log(err)
      done()
    })
}

function serve (done) {
  connect.server(serverConfig, function () {
    this.server.on('close', done)
    watch(watchPatterns, generate)
    if (livereload) watch(this.root).on('change', (filepath) => src(filepath, { read: false }).pipe(livereload()))
  })
}

module.exports = { serve, generate, default: generate }
