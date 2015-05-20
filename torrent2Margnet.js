var nt = require("nt"),
    parseTorrent = require('parse-torrent');

function main(argv) {
    argv.forEach(function (item) {
        nt.read(item, function (err, torrent) {
            if (err) {
                console.log(item + "无效");
                return;
            }
            var url = parseTorrent.toMagnetURI({
                infoHash: torrent.infoHash()
            });
            console.log(url);
        });
    })
}

main(process.argv.slice(2));