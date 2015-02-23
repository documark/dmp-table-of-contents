# Documark Table of Contents

Documark plugin for generating a table of contents.

This plugin uses wkhtmltopdf its `--dump-outline` flag to generate the chapter index,
which means that the table of contents is always one compilation behind.
__Compiling twice will ensure you have the latest table of contents.__

## Usage

1. Install plugin with `npm install documark-table-of-contents --save`.

2. Load plugin in document configuration:

	```yaml
	plugins:
	  - documark-table-of-contents
	```

3. Add the table of contents in `document.jade`:

	```jade
	chapter.no-index
		h1 Index
		table-of-contents(depth=2)
	```

	The index element (`ul`) will be automatically appended to the `table-of-contents` element.

	__Note:__ This plugin does no chapter numbering, use the [chapter numbering][documark-chapter-numbering] plugin for this.

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

	__Note:__ This requires [ZeptoJS][zeptojs] or [jQuery][jquery] in order to work. Add this to your `document.jade`:

	```jade
	script(src='https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.4/zepto.min.js')
	```

## Configuration

The index depth (default: 3) can be configured with a `depth` attribute:

```jade
table-of-contents(depth=2)
```

## Output

The final HTML structure will look something like this:

```html
<chapter class="no-index">
	<h1>Index</h1>
	<table-of-contents depth="2">
		<ul class="index-1">
			<li class="page-1">
				<span class="chapter-title">1. Chapter X</span>
				<span class="page-number">1</span>
			</li>
			<li class="page-2">
				<span class="chapter-title">2. Chapter Y</span>
				<span class="page-number">2</span>
				<ul class="index-2">
					<li class="page-2">
						<span class="chapter-title">2.1. Subchapter Z</span>
						<span class="page-number">2</span>
					</li>
				</ul>
			</li>
		</ul>
	</table-of-contents>
</chapter>
```

[documark-chapter-numbering]: https://github.com/mauvm/documark-chapter-numbering
[zeptojs]: http://zeptojs.com/
[jquery]: http://jquery.com/
