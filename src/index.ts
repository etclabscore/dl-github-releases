import { unlinkSync, createWriteStream } from "fs";
import MultiProgress from "multi-progress";
import getReleases from "./get-releases";
import download from "./download";
import rpad from "./rpad";
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
) {
  await ensureDir(outputDir);
  const bars = new MultiProgress(process.stdout);

  const releases = await getReleases(user, repo);

  const filteredReleases = releases.filter(filterRelease)
    .map((release: any) => {
      const filteredAssets = release.assets.filter(filterAsset);
      return { ...release, assets: filteredAssets };
    });

  await Promise.all(filteredReleases.map((release: any) => {
    if (!release) {
      throw new Error(`could not find a release for ${user}/${repo}`);
    }

    console.log(`Downloading ${user}/${repo}@${release.tag_name}...`);

    const promises = release.assets.map((asset: any) => {
      const width = process.stdout.columns as number - 36;
      const bar = bars.newBar(`${rpad(asset.name, 24)} :bar :etas`, {
        complete: "▇",
        incomplete: "-",
        width,
        total: 100,
      });

      const progress = process.stdout.isTTY ? bar.update.bind(bar) : pass;

      const destf = join(outputDir, asset.name);
      const dest = createWriteStream(destf);

      return download(asset.browser_download_url, dest, progress)
        .then((): any => {
          if (unzip && /\.zip$/.exec(destf)) {
            return extract(destf, { dir: outputDir }).then(() => unlinkSync(destf));
          }

          return null;
        });
    });

    return Promise.all(promises);
  }));
}
