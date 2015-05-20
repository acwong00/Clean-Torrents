var fs = require("fs"),
    path = require('path'),
    nt = require("nt"),
    parseTorrent = require('parse-torrent');

function main(argv) {
    argv.forEach(function(item) {
        fs.stat(item, function(err, stats) {
            if (err) {
                console.log(item + " 文件或目录路径无效");
                return;
            }
            if (stats.isFile()) {
                changeToMargnet(item);
            } else if (stats.isDirectory()) {
                fs.readdir(item, function (err, files) {
                    if (err) {
                        return;
                    }
                    files.forEach(function (file) {
                        if (fs.statSync(path.resolve(item, file)).isFile()) {
                            changeToMargnet(path.resolve(item, file));
                        }
                    });
                });
            }
        });

    });
}

function changeToMargnet(torrentPath) {
    nt.read(torrentPath, function(err, torrent) {
        if (err) {
            console.log(torrentPath + "无效");
            return;
        }
        var url = parseTorrent.toMagnetURI({
            infoHash: torrent.infoHash()
        });
        console.log(url);
    });
}

main(process.argv.slice(2));