import downloadReleases from ".";
import { stat, emptyDir } from "fs-extra";

describe("dl-gh-release", () => {
  afterAll(async () => await emptyDir("./test"));
  it("downloads releases of spec", async () => {
    await downloadReleases(
      "open-rpc",
      "spec",
      "./test",
    );
    expect(stat("./test")).toBeTruthy();
  });
});
