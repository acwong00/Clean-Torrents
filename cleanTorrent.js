var path = require('path'),
    fs = require('fs'),
    nt = require('nt'),
    Metadata = require('./lib/Metadata.js');

function main(argv) {
    argv.forEach(function (item) {
        fs.stat(item, function (err, stats) {
            if (err) {
                console.log(item + " 文件或目录路径无效");
                return;
            }
            if (stats.isFile()) {
                createCleanTorrent(item);
            } else if (stats.isDirectory()) {
                fs.readdir(item, function (err, files) {
                    if (err) {
                        return;
                    }
                    files.forEach(function (file) {
                        // 忽略子文件夹
                        if (fs.statSync(path.resolve(item, file)).isFile()) {
                            createCleanTorrent(path.resolve(item, file));
                        }
                    });
                });
            }
        });
    });
}

function createCleanTorrent(torrentPath) {
    var dir = path.resolve(path.dirname(torrentPath), "New");
    nt.read(torrentPath, function (err, torrent) {
        if (err) {
            console.log(item + ' 无效');
            return;
        }
        var metadata = new Metadata(torrent.metadata);
        torrent.metadata = metadata.cleanMetadata();
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        torrent.createWriteStream(path.resolve(dir, metadata.getName() + ".torrent"));
        console.log(metadata.getName() + ".torrent " + "success!");
    });
}

main(process.argv.slice(2));
