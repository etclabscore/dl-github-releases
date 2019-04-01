declare function pass(): boolean;
export default function downloadReleases(user: string, repo: string, outputDir: string, filterRelease?: typeof pass, filterAsset?: typeof pass, unzip?: boolean): Promise<void>;
export {};
