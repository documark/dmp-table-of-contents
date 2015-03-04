var fs          = require('fs');
var path        = require('path');
var cacheHelper = require('documark-cache');
var xml2js      = require('xml2js');
var jade        = require('jade');
var parser      = new xml2js.Parser();

function toc2index(file) {
    var chapters = [];

    if (fs.existsSync(file)) {
        var data = fs.readFileSync(file, 'UTF-8');

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

module.exports = function dmpTableOfContents ($, document, done) {
	var options = document.config().pdf;
	var $toc    = $('table-of-contents');

	if ($toc.length > 0) {
		var tocFilePath = cacheHelper(document).filePath('toc.xml');

		var html = jade.renderFile(path.join(__dirname, 'assets/toc.jade'), {
			chapters: toc2index(tocFilePath),
			depth: (parseInt($toc.attr('depth'), 10) || 3)
		});

		$toc.append(html);
		$.root().append('<script src="file://' + path.join(__dirname, 'assets/update-index.js') + '"/>');

		options.dumpOutline = /*'file://' +*/ tocFilePath;
	}

	done();
};
