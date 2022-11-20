# Webpage Screenshot Action

This action takes a screenshot of a webpage. 
It also allows running some arbitrary JavaScript code on the 
page before taking the screenshot (for example for navigation, DOM validation, etc.). 

Its initial purpose was to help ensure PR quality
(by  attaching a screenshot of the contributed documentation and doing some basic HTML checks), 
but there may be much more applications of this action. 

## Usage

Here are the inputs you can use to configure the action:

| Name         | Description                                                                                               | Default            |
|--------------|-----------------------------------------------------------------------------------------------------------|--------------------|
| url          | The URL of the webpage to screenshot                                                                      | required parameter |
| output       | The output file name                                                                                      | `screenshot.png`   |
| mode         | The operating mode for the action. Possible values are: 'page', 'wholePage', 'scrollToElement', 'element' | `wholePage`        |
| selector     | The CSS selector of the element to screenshot. Only used if _mode_ is 'element' or 'scrollToElement'      |                    |
| xpath        | The XPath selector of the element to screenshot. Only used if _mode_ is 'element' or 'scrollToElement'    |                    |
| scriptBefore | A script to execute before taking the screenshot. Only used if _mode_ is 'element' or 'scrollToElement'   |                    |

<!--
Not implemented yet:
| width | The width of the screenshot | `1920` |
| height | The height of the screenshot | `1080` |
-->

### url
Required parameter. A fully qualified URL of the webpage to screenshot.
It can be an external web page, it can be a file from a PR, or it can be a page served by your workflow (served locally, on GitHub action runner).

### output
The path of the output file (including the name). It can be relative to the current working directory, or absolute.
If not provided, the screenshot will be written to `./screenshot.png`.

### mode
The operating mode for the action. Possible values are:
- `page`: takes a screenshot of the page in a browser window
- `wholePage`: takes a screenshot of the whole page( default)
- `scrollToElement`: scrolls the page to the element specified by `selector` or `xpath`
   and takes a screenshot of the page in a browser window
- `element`: takes a screenshot of the DOM element specified by `selector` or `xpath`

Please, take a look at the [examples](#examples) below for more details.

### selector
CSS selector of an HTML page element, i.e. `#www-wikipedia-org > div.search-container` (see [CSS selector syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)). 

Only used if _mode_ is `element` or `scrollToElement`.

### xpath
XPath selector of an HTML page element, i.e. `//*[@id="www-wikipedia-org"]/div[1]` (see [XPath syntax](https://developer.mozilla.org/en-US/docs/Web/XPath)).

Only used if _mode_ is `element` or `scrollToElement`.

## Examples


## License

The scripts and documentation in this project are released under the [Apache 2.0](LICENSE).

## Contributing

## To Do
The following features are not implemented yet, but may be added in the future:
1. Simulate a device (i.e.mobile phone; see https://pptr.dev/api/puppeteer.knowndevices/)
2. Allow for multiple screenshots (i.e. for different devices)
3. Allow for multiple URLs (i.e. for different pages)
4. Capture the browser console output (if required)
