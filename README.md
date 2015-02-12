# Documark Table of Contents

Documark plugin for generating a table of contents.

### Usage

1. Add plugin to document configuration:

	```
	plugins:
	  - documark-table-of-contents
	```

2. Add the table of contents in `document.jade`:

	```jade
	tableofcontents.no-index
		h1 Index
	```

	The index `ul` will be automatically appended to the `tableofcontents` element.

__Note:__ Chapters with a `.no-index` class will be removed from the index. This requires ZeptoJS or jQuery.
