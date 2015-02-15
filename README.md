# Documark Table of Contents

Documark plugin for generating a table of contents.

This plugin uses WkHTMLToPDF its `--dump-outline` flag to generate the chapter index,
which means that the table of contents is always one compilation behind.
Compiling twice will ensure you have the latest table of contents.

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

3. Add a `.no-index` class to headers (or one of their parent elements) to skip the index:

	```jade
	chapter
		h1.no-index This will not appear in the TOC!
	
	//- Or:
	chapter.no-index
		h1 One
		h2 Two
		h3 Three
	```

	__Note:__ This requires [ZeptoJS][zeptojs] or [jQuery][jquery] in order to work.

[zeptojs]: http://zeptojs.com/
[jquery]: http://jquery.com/
