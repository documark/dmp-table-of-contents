var fs          = require('fs');
var path        = require('path');
var cacheHelper = require('documark-cache');
var xml2js      = require('xml2js');
var jade        = require('jade');
var parser      = new xml2js.Parser();

function toc2index(file) {
    var chapters = [];

    if (fs.existsSync(file)) {
        var data = fs.readFileSync(file, 'ascii');

        function findItemsRecursively(holder, node) {
            if ( ! node.item) return;
            node.item.forEach(function (item) {
                if (item['$'].title) {
                    var chapter = {
                        title: item['$'].title,
                        page: parseInt(item['$'].page, 10),
                        subChapters: []
                    };
                    holder.push(chapter);
                    findItemsRecursively(chapter.subChapters, item);
                    if ( ! chapter.subChapters.length) {
                        delete chapter.subChapters;
                    }
                } else {
                    findItemsRecursively(holder, item);
                }
            });
        }

        parser.parseString(data, function (err, result) {
            if (err) return;
            findItemsRecursively(chapters, result.outline);
        });
    }

    return chapters;
}

module.exports = function tableOfContents ($, document, cb) {
	var options = document.config().pdf;
	var $toc    = $('tableofcontents');

	if ($toc.length > 0) {
		var tocFilePath = cacheHelper(document).filePath('toc.xml');

		var html = jade.renderFile(path.join(__dirname, 'assets/toc.jade'), {
			chapters: toc2index(tocFilePath),
			depth: 3
		});

		$toc.append(html);
		options.dumpOutline = /*'file://' +*/ tocFilePath;
		$.root().append('<script src="file://' + path.join(__dirname, 'assets/remove-invalid-chapters.js') + '"/>');
	}

	cb();
};
