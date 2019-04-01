#!/usr/bin/env node

const commander = require('commander');
const downloadReleases = require("../build/").default;

commander
  .version(require('./get-version'))
  .arguments('<user> <repo>')
  .option('-o, --outputDir [output]', 'output directory [output]', process.cwd())
  .option('-p, --includePre', 'download prerelease', false)
  .option('-d, --includeDraft', 'download draft releases', false)
  .option('-a, --filterAssetsByName <rexexp>', 'filter assets name')
  .option('-z, --zipped', 'don\'t extract zip files')
  .parse(process.argv);

const user = commander.args[0];
const repo = commander.args[1];

if (!user || !repo) {
  commander.help();
}

function filterRelease(release) {
  return release.draft === !!commander.includingDraft && release.prerelease === !!commander.prerelease;
}

function filterAsset(asset) {
  if (!commander.filterAssetsByName) {
    return true;
  }

  return new RegExp(commander.search).exec(asset.name);
}

downloadReleases(user, repo, commander.outputDir, filterRelease, filterAsset, !!commander.zipped)
  .catch(err => console.error(err.message));
