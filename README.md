# Webpage Screenshot Action

This action takes a screenshot of a webpage.
It can be an existing/external webpage. It could be a page that is served by your worklow (i.e. by starting a local
webserver).

## Inputs

| Name         | Description                                                        | Default            |
|--------------|--------------------------------------------------------------------|--------------------|
| url          | The URL of the webpage to screenshot                               | required parameter |
| output       | The output file name                                            | `screenshot.png`   |
| mode         | The operating mode for the action. Possible values are: 'page', 'wholePage', 'scrollToElement', 'element' | `wholePage`        |
| selector     | The CSS selector of the element to screenshot. Only used if mode is 'element' or 'scrollToElement' |                    |
| xpath        | The XPath selector of the element to screenshot. Only used if mode is 'element' or 'scrollToElement' |                    |
| scriptBefore | A script to execute before taking the screenshot. Only used if mode is 'element' or 'scrollToElement' |                    |


<!--
Not implemented yet:
| width | The width of the screenshot | `1920` |
| height | The height of the screenshot | `1080` |
-->

It uses [puppeteer](