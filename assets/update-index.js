(function () {
	// Updating index requires ZeptoJS/jQuery
	if (typeof $ === 'undefined') {
		return;
	}

	// Support multiple table-of-contents
	$('table-of-contents').each(function () {
		var occurences = {};
		function getOccurenceCount (text) {
			return (occurences[text] = (occurences[text] || 0) + 1);
		}
		
		$(this).find('ul.index-1 li[title]').each(function () {
			var $item      = $(this);
			var headerType = 'h' + $item.data('index');
			var text       = $item.attr('title');
			var $header    = $(headerType).filter(function () {
				return $(this).text() === text;
			}).eq(getOccurenceCount(text) - 1);

			// Remove invalid chapters
			if ( ! $header.length || $header.hasClass('no-index') || $header.parents('.no-index').length) {
				$item.remove();
				return;
			}
		});
	});
})();
