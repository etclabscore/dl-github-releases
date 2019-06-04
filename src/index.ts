import { unlinkSync, createWriteStream } from "fs";
import getReleases, { Releases } from "./get-releases";
import download from "./download";
import _extractZip from "extract-zip";
import { promisify } from "util";
import { join } from "path";
import { ensureDir } from "fs-extra";
import { flatten } from "lodash";

const extract = promisify(_extractZip);

function pass() {
  return true;
}

const getFilteredReleases = async (
  user: string,
  repo: string,
  filterRelease = pass,
  filterAsset = pass,
): Promise<Releases> => {
  const releases = await getReleases(user, repo);
  const filteredReleases = releases.filter(filterRelease)
    .map((release) => {
      const filteredAssets = release.assets.filter(filterAsset);
      return { ...release, assets: filteredAssets };
    });

  return filteredReleases;
};

/**
 * Gives a list of the releases made for a repository, optionally filtered by release
 * and/or based on inclusion of a particular asset.
 *
 * @param user the name of the user or organization that owns the repo
 * @param repo the name of the repository that you want to list releases of
 * @param filterRelease the release filter function
 * @param filterAsset the asset filter function
 */
export async function listReleases(
  user: string,
  repo: string,
  filterRelease = pass,
  filterAsset = pass,
): Promise<string[]> {
  const releases = await getFilteredReleases(user, repo, filterRelease, filterAsset);

  return releases.map(({ tag_name }) => tag_name);
}

/**
 * Downloads the releases for a particular repo,  optionally filtered by release
 * and/or based on inclusion of a particular asset.
 *
 * @param user the name of the user or organization that owns the repo
 * @param repo the name of the repository that you want to list releases of
 * @param outputDir the relative path to a directory to write the downloaded releases to
 * @param filterRelease the release filter function
 * @param filterAsset the asset filter function
 * @param unzip pass true if you want it the result to be unzipped as well.
 */
export default async function downloadReleases(
  user: string,
  repo: string,
  outputDir: string,
  filterRelease = pass,
  filterAsset = pass,
  unzip = false,
): Promise<string[]> {
  const releases = await getFilteredReleases(user, repo, filterRelease, filterAsset);

  const bigResult = await Promise.all(releases.map(async (release: any) => {
    if (!release) {
      throw new Error(`could not find a release for ${user}/${repo}`);
    }

    const promises = release.assets.map(async (asset: any): Promise<string> => {
      const destd = join(outputDir, release.tag_name);
      await ensureDir(destd);
      const destf = join(destd, asset.name);
      const dest = createWriteStream(destf);

      await download(asset.browser_download_url, dest);

      if (unzip && /\.zip$/.exec(destf)) {
        await extract(destf, { dir: destd });
        await unlinkSync(destf);
      }
      return asset.name as string;
    });

    const result = await Promise.all(promises) as string[];

    return result;
  }));

  return flatten(bigResult) as string[];
}
