const fs = require("fs");
const client = require("https");
const ProgressBar = require("progress");

function downloadImage(uri, filepath) {
  const url = new URL(uri);
  return new Promise((resolve, reject) => {
    client.get(
      {
        hostname: url.hostname,
        path: `${url.pathname}${url.search}`,
        protocol: url.protocol,
        headers: {
          "Accept": "image/avif,image/webp,*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.5",
          "Host": "www.isabelmarant.com",
          "Referer": "https://www.isabelmarant.com/us/lookbooks/isabel-marant/isabel-marant-fall-winter-2023/",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0",
        },
      },
      (res) => {
        if (res.statusCode === 200) {
          res
            .pipe(fs.createWriteStream(filepath))
            .on("error", reject)
            .once("close", () => resolve(filepath));
        } else {
          // Consume response data to free up memory
          res.resume();
          reject(
            new Error(`Request Failed With a Status Code: ${res.statusCode}`)
          );
        }
      }
    );
  });
}

function getLookNumber(index) {
  return (index + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 });
}

function getImageURL(index) {
  const url =
    `https://www.isabelmarant.com/app/uploads/2023/02/Isabel-Marant-FW23-` +
    `${getLookNumber(index)}-1.jpg`;
  return url;
}

async function save(count = 53, show = "hermes/SS23", ext = "webp") {
  const urls = Array(count)
    .fill(null)
    .map((_, index) => getImageURL(index));
  const bar = new ProgressBar(
    "saving [:bar] :rate/pps :current/:total :percent :etas",
    {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: urls.length,
    }
  );
  for await (const url of urls) {
    const index = urls.indexOf(url);
    await downloadImage(url, `shows/${show}/${getLookNumber(index)}.${ext}`);
    bar.tick();
  }
}

void save(59, "isabel-marant/FW23", "jpg");
