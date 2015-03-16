# Documark Table of Contents

[![npm version](https://badge.fury.io/js/dmp-table-of-contents.svg)](http://badge.fury.io/js/dmp-table-of-contents)
[![dependency status](https://david-dm.org/mauvm/dmp-table-of-contents.svg)](https://david-dm.org/mauvm)

> Documark plugin for generating a table of contents.

This plugin uses wkhtmltopdf its `--dump-outline` flag to generate the chapter index,
which means that the table of contents is always one compilation behind.
__Compiling twice will ensure you have the latest table of contents.__

## Usage

1. Install plugin with `npm install dmp-table-of-contents --save`.

2. Load plugin in document configuration:

	```yaml
	plugins:
	  - dmp-table-of-contents
	```

3. Add the table of contents in `document.jade`:

	```jade
	chapter.no-index
		h1 Index
		table-of-contents(depth=2)
	```

	The index element (`ul`) will be automatically appended to the `table-of-contents` element.

	__Tip:__ Use the [chapter numbering plugin][dmp-chapter-numbering] for automatic chapter numbering.

4. Additionally add a `.no-index` class to headers (or one of their parent elements) to skip the index:

	```jade
	chapter
		h1.no-index This will not appear in the TOC!

	//- Or:
	chapter.no-index
		h1 One
		h2 Two
		h3 Three
	```

## Configuration

The index depth (default: 3) can be configured with a `depth` attribute:

```jade
table-of-contents(depth=2)
```

## Output

The final structure will look like this:

```jade
chapter.no-index
	h1 Index
	table-of-contents(depth=2)
		ul.index-1
			li.page-1
				a.chapter-link(href='#chapter-1-subject-x')
					span.chapter-title 1. Subject X
					span.page-number 1
			li.page-2
				a.chapter-link(href='#chapter-2-subject-y')
					span.chapter-title 2. Subject Y
					span.page-number 2
				ul.index-2
					li.page-2
						a.chapter-link(href='#chapter-2-1-subject-z')
							span.chapter-title 2.1. Subject Z
							span.page-number 2
```

__Note:__ Chapter anchors are the slugified title, prepended with `chapter-` and appended with `-2`, `-3`, etc. (if necessary).

[dmp-chapter-numbering]: https://www.npmjs.com/package/dmp-chapter-numbering
[zeptojs]: http://zeptojs.com/
[jquery]: http://jquery.com/
