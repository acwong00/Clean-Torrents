var fs = require("fs"),
    parseTorrent = require('parse-torrent');

function main() {
    var dir = "./.new/";
    var files = fs.readdir(dir, function(err, files) {
        if (!err) {
            for (var i = 0; i < files.length; i++) {
                var infoHash = parseTorrent(fs.readFileSync(dir + files[i])).infoHash;
                console.log(parseTorrent.toMagnetURI({
                    infoHash: infoHash
                }));
            }
        }
    })
}

main();