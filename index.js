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

function slugify (text) {
	return text
		.toLowerCase()
		.replace(/[^\w]+/g, '-') // Replace invalid characters
		.replace(/^-+|-+$/g, '') // Trim
		;
}

module.exports = function dmpTableOfContents ($, document, done) {
	var $tables = $('table-of-contents');

	if ($tables.length > 0) {
		var tocFilePath   = cacheHelper(document).filePath('toc.xml');
		var config        = document.config();
		var chapters      = toc2index(tocFilePath);
		var pageIncrement = parseInt(config.startPageCountOn) - 1 || 0;

		config.pdf.dumpOutline = tocFilePath;

		$tables.each(function () {
			var $toc       = $(this);
			var occurences = {};

			var getOccurenceCount = function (text) {
				return (occurences[text] = (occurences[text] || 0) + 1);
			};

			var $table = $(jade.renderFile(path.join(__dirname, 'assets/toc.jade'), {
				chapters: toc2index(tocFilePath),
				depth: (parseInt($toc.attr('depth'), 10) || 3),
				pageIncrement: pageIncrement,
			}));

			$toc.append($table);

			$table.find('ul.index-1 li[title]').each(function () {
				var $item      = $(this);
				var headerType = 'h' + $item.attr('data-index');
				var text       = $item.attr('title');
				var occurence  = getOccurenceCount(text);
				var $header    = $(headerType).filter(function () {
					return $(this).text() === text;
				}).eq(occurence - 1);

				// Remove invalid chapters
				if ( ! $header.length || $header.hasClass('no-index') || $header.parents('.no-index').length) {
					$item.remove();
					return;
				}

				// Determine unique ID
				var id = slugify('chapter-' + text);

				if (occurence > 1) {
					id += '-' + occurence;
				}

				// Make index item clickable (jumps to chapter)
				$header.attr('name', id);
				$item.children('a').attr('href', '#' + id);
			});
		});
	}

	done();
};
