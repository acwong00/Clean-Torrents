var md5 = require('MD5');

function Metadata(metadata) {
    this.metadata = metadata;
}

module.exports = Metadata;

Metadata.prototype.cleanMetadata = function() {
    if (this.hasComment()) {
        this.metadata.comment = md5(this.metadata.comment);
    }

    if (this.hasPublisher()) {
        this.metadata.info.publisher = md5(this.metadata.info.publisher);
        if (this.metadata.info["publisher.utf-8"]) {
            this.metadata.info["publisher.utf-8"] = md5(this.metadata.info["publisher.utf-8"]);
        }
    }
    if (this.isMultiFile()) {
        this.metadata.info.name = md5(this.metadata.info.name);
        if (this.metadata.info["name.utf-8"]) {
            this.metadata.info["name.utf-8"] = md5(this.metadata.info["name.utf-8"]);
        }
        this.metadata.info.files.forEach(function(file) {
            for (var key in file) {
                if (key === "path" || key === "path.utf-8") {
                    var text = file[key][0];
                    var dotIndex = text.lastIndexOf(".");
                    file[key][0] = md5(text.slice(0, dotIndex)) + text.slice(dotIndex);
                }
            }
        });
    } else {
        var text = this.metadata.info.name;
        var dotIndex = text.lastIndexOf(".");
        this.metadata.info.name = md5(text.slice(0, dotIndex)) + text.slice(dotIndex);
    }
    return this.metadata;
}

Metadata.prototype.getName = function() {
    return this.metadata.info.name;
}

Metadata.prototype.hasComment = function () {
    return this.metadata.comment ? true : false;
}

Metadata.prototype.hasPublisher = function () {
    return this.metadata.info.publisher ? true : false;
}

Metadata.prototype.isMultiFile = function () {
    return this.metadata.info.files ? true : false;
}