var fs = require("fs"),
    parseTorrent = require('parse-torrent'),
    md5 = require('MD5');

function main (argv) {
    var cleanInfos = [],
        dir = "./.new";
    for (var i = 0; i < argv.length; i++) {
        info = parseTorrent(fs.readFileSync(argv[i])).info;
        console.log(info);
        cleanInfos.push(cleanInfo(info));
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    for (var i = 0; i < cleanInfos.length; i++) {
        var buf = parseTorrent.toTorrentFile({
            info: cleanInfos[i]
        });
        var a = fs.writeFile(dir + "/" + cleanInfos[i].name + ".torrent", buf);
    };
}

function cleanInfo (info) {
    info.name = md5(info.name);
    info['name.utf-8'] = md5(info['name.utf-8']);
    var files = info.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        for (var key in file) {
            if (key == "path" || key == "path.utf-8") {
                for (var j = 0; j < file[key].length; j++) {
                    var text = file[key][j].toString();
                    var dotIndex = text.lastIndexOf(".");
                    file[key][j] = md5(text.slice(0,dotIndex)) + text.slice(dotIndex,text.length);
                }
            }
        }
    }
    return info;
}

main(process.argv.slice(2));