The examples include:

- taking a screenshot of a whole web page
- taking a screenshot of a specific page element
- some DOM manipulation and validation:
  - checking if an element exist
  - counting paragraph tags


Let's consider the following use cases for the action:
- taking a screenshot of a web page
  - [whole page](#whole-page) screenshot and upload it as an artifact
  - Selected [element](#element) screenshot
- [Running a script](#running-a-script) before taking a screenshot
  - Returning a [value](#returning-a-value) from the script
  - Counting the number of elements on a page
  - Checking if given text is present in the page
  - Manipulating DOM (insert element before first \<h1\>)


```yaml
name: Upload screenshot
on:
  workflow_dispatch:
  push:
    branches:
      - master

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: karol-brejna-i/webpage-screenshot-action@develop
        with:
          url: file://${{github.workspace}}/examples/simple.html
      - uses: actions/upload-artifact@v3
        with:
          name: simple-screenshot
          path: ${{ github.workspace }}/*.png
```