const http = require('http');
const https = require('https');
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;':,./<>?";

checkUploadSpeed(options, fileSizeInBytes = 2000000) {
    let startTime;
    const defaultData = this.generateTestData(fileSizeInBytes / 1000);
    const data = JSON.stringify({ defaultData });
    return new Promise((resolve, _) => {
      var req = http.request(options, res => {
        res.setEncoding("utf8");
        res.on('data', () => {});
        res.on("end", () => {
          const endTime = new Date().getTime();
          const duration = (endTime - startTime) / 1000;
          const bitsLoaded = fileSizeInBytes * 8;
          const bps = (bitsLoaded / duration).toFixed(2);
          const kbps = (bps / 1000).toFixed(2);
          const mbps = (kbps / 1000).toFixed(2);
          resolve({ bps, kbps, mbps });
        });
      });
      startTime = new Date().getTime();
      req.on('error', error => {
        console.error(error);
      });
      req.write(data)
      req.end()
    }).catch(error => {
      console.log(error);
    });
  }