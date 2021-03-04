# DL Github Releases

<center>
  <span>
    <img alt="CircleCI branch" src="https://img.shields.io/circleci/project/github/etclabscore/dl-github-releases/master.svg">
    <img alt="Dependabot status" src="https://api.dependabot.com/badges/status?host=github&repo=etclabscore/dl-github-releases" />
    <img alt="npm" src="https://img.shields.io/npm/dt/@etclabscore/dl-github-releases.svg" />
    <img alt="GitHub release" src="https://img.shields.io/github/release/etclabscore/dl-github-releases.svg" />
    <img alt="GitHub commits since latest release" src="https://img.shields.io/github/commits-since/etclabscore/dl-github-releases/latest.svg" />
  </span>
</center>

A node module to download Github assets for Github releases. It will also uncompress zip files.

## Command line

```
$ npm install -g @etclabscore/dl-github-releases


$ dl-github-releases --help

Usage: download-github-releases [options] <user> <repo>

Options:
  -V, --version                      output the version number
  -o, --outputDir [output]           output directory [output] (default: "/Users/zb/Code/etclabs/dl-github-releases")
  -p, --includePre                   download prerelease
  -d, --includeDraft                 download draft releases
  -a, --filterAssetsByName <rexexp>  filter assets name
  -z, --zipped                       don't extract zip files
  -h, --help                         output usage information
Usage: download-github-release [options] <user> <repo> [outputdir]

Options:

  -h, --help             output usage information
  -V, --version          output the version number
  -p, --prerelease       download prerelease
  -s, --search <regexp>  filter assets name


$ dl-github-releases -a *.md open-rpc spec

Downloading open-rpc/spec@1.0.0...
spec.md                  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 0.0s
spec.pdf                 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇--------- 0.1s
```

## Javascript API

### Installation

```bash
npm install --save @etclabscore/dl-github-releases
```

### Usage

```javascript
var downloadReleases = require('@etclabscore/dl-github-releases');

var user = 'some user';
var repo = 'some repo';
var outputdir = 'some output directory';

// Define a function to filter releases.
function filterRelease(release) {
  // Filter out prereleases.
  return release.prerelease === false;
}

// Define a function to filter assets.
function filterAsset(asset) {
  // Select assets that contain the string 'windows'.
  return asset.name.indexOf('windows') >= 0;
}

downloadReleases(user, repo, outputdir, filterRelease, filterAsset)
  .then(function() {
    console.log('All done!');
  })
  .catch(function(err) {
    console.error(err.message);
  });
```
