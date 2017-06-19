import http from 'http';

const IPGeolocation = ip => new Promise((resolve, reject) => {
  let url = 'http://ipinfo.io/';
  if (ip !== '::1' && ip !== '127.0.0.1' && ip !== '::ffff:127.0.0.1') {
    url += `${ip}/geo`;
  }
  http.get(url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type :
                      Expected application/json but received ${contentType}`);
    }
    if (error) {
      // consume response data to free up memory
      res.resume();
      reject(error.message);
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        let latitude;
        let longitude;
        if (parsedData && parsedData.loc) {
          [latitude, longitude] = parsedData.loc.split(',');
        } else {
          [latitude, longitude] = [49.038691, 2.385393];
        }
        resolve({ latitude, longitude });
      } catch (e) {
        reject(e.message);
      }
    });
  })
  .on('error', (e) => { reject(e.message); });
});

export default IPGeolocation;
