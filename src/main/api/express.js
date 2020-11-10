const { log } = require("console");

(function() {
  const express = require("express");

  const fs = require("fs");

  const app = express();

  app.get("/video", function(req, res) {
    let pathSrc = req.query.video;

    let stat = fs.statSync(pathSrc);
    let fileSize = stat.size;
    let range = req.headers.range;
    // fileSize 3332038

    if (range) {
      //有range头才使用206状态码
      let parts = range.replace(/bytes=/, "").split("-");
      let start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;

      // end 在最后取值为 fileSize - 1
      end = end > fileSize - 1 ? fileSize - 1 : end;

      let chunksize = end - start + 1;
      let file = fs.createReadStream(pathSrc, {
        start,
        end,
      });
      let head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      let head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(pathSrc).pipe(res);
    }
  });

  app.listen(6789, () => {
    console.log("localhost:6789");
  });
})();
