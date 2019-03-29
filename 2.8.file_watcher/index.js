const fs = require("fs");
const events = require("events");

class Watcher extends events.EventEmitter {
  constructor(watchDir, processedDir) {
    super();
    this.watchDir = watchDir;
    this.processedDir = processedDir;
  }

  watch() {
    fs.readdir(this.watchDir, (err, files) => {
      if (err) throw err;
      for (const index in files) {
        this.emit("process", files[index]);
      }
    });
  }

  start() {
    fs.watchFile(this.watchDir, () => {
      this.watch();
    });
  }
}

const watchDir = `${__dirname}`;
const processedDir = `${__dirname}`;
const watcher = new Watcher(watchDir, processedDir);
watcher.on("process", file => {
  const watchFile = `${watchDir}/${file}`;
  const processFile = `${processedDir}/${file.toLowerCase()}`;
  fs.rename(watchFile, processFile, err => {
    if (err) throw err;
  });
});

watcher.start();
