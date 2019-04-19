import { unlinkSync, createWriteStream } from "fs";
import MultiProgress from "multi-progress";
import getReleases from "./get-releases";
import download from "./download";
import _extractZip from "extract-zip";
import { promisify } from "util";
import { join } from "path";
import { ensureDir } from "fs-extra";

const extract = promisify(_extractZip);

function pass() {
  return true;
}

export default async function downloadReleases(
  user: string,
  repo: string,
  outputDir: string,
  filterRelease = pass,
  filterAsset = pass,
  unzip = false,
  consoleLogs = false,
) {
  const releases = await getReleases(user, repo);

  const filteredReleases = releases.filter(filterRelease)
    .map((release: any) => {
      const filteredAssets = release.assets.filter(filterAsset);
      return { ...release, assets: filteredAssets };
    });

  const bigResult = await Promise.all(filteredReleases.map(async (release: any) => {
    if (!release) {
      throw new Error(`could not find a release for ${user}/${repo}`);
    }

    if (consoleLogs) {
      console.log(`Downloading ${user}/${repo}@${release.tag_name}...`);
      console.log(`there are ${release.assets.length} assets to download`);
    }

    const promises = release.assets.map(async (asset: any) => {
      if (consoleLogs) {
        console.log("downloading asset: ", asset.name);
      }

      const destd = join(outputDir, release.tag_name);
      await ensureDir(destd);
      const destf = join(destd, asset.name);
      const dest = createWriteStream(destf);

      await download(asset.browser_download_url, dest);

      if (unzip && /\.zip$/.exec(destf)) {
        await extract(destf, { dir: destd });
        await unlinkSync(destf);
      }
      return asset.name;
    });

    const result = await Promise.all(promises);

    return result;
  }));

  return bigResult;
}
