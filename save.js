const fs = require('fs');
const client = require('https');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
}

function getLookNumber(index) {
  return (index + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 })
}

function getImageURL(index) {
  const url =
    `https://assets.hermes.com/is/image/hermesedito/` +
    `3x4_RUNWAY_HERMES_DEFILE_PAPHPE23_FILIPPOFIOR_` +
    `${getLookNumber(index)}?fit=wrap%2C0&wid=1440`
  return url;
}

async function save(count = 53, show = 'hermes/SS23', ext = 'webp') {
  const urls = Array(count).fill(null).map((_, index) => getImageURL(index));
  return Promise.all(urls.map((url, index) => downloadImage(url, `shows/${show}/${getLookNumber(index)}.${ext}`)));
}

void save();
