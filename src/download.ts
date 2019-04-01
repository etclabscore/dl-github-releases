import http from "http";
import https from "https";

export default (url: string, w: any, progress = (...args: any) => { }) => {
  return new Promise((resolve, reject) => {
    let protocol = /^https:/.exec(url) ? https : http;

    progress(0);

    protocol
      .get(url, (res1: any) => {
        protocol = /^https:/.exec(res1.headers.location) ? https : http;

        protocol
          .get(res1.headers.location, (res2: any) => {
            const total = parseInt(res2.headers["content-length"], 10);
            let completed = 0;
            res2.pipe(w);
            res2.on("data", (data: any) => {
              completed += data.length;
              progress(completed / total);
            });
            res2.on("progress", progress);
            res2.on("error", reject);
            res2.on("end", resolve);
          })
          .on("error", reject);
      })
      .on("error", reject);
  });
};
