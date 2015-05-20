var path = require('path'),
    fs = require('fs');
    nt = require('nt'),
    md5 = require('MD5'),
    Metadata = require('./lib/Metadata.js');

function main (argv) {
    argv.forEach(function (item) {
        var dir = path.resolve(path.dirname(item), "New");
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir);
        }
        nt.read(item, function (err, torrent) {
            if (err) {
                console.log(item + '无效');
                return;
            }
            var metadata = new Metadata(torrent.metadata);
            torrent.metadata = metadata.cleanMetadata();
            torrent.createWriteStream(path.resolve(dir, metadata.getName() + ".torrent"));
        });
    });
}

main(process.argv.slice(2));