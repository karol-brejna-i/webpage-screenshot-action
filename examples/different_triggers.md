# Different triggers examples

This document shows different ways a workflow that uses this action can be triggered.

## Triggered by a push to a specific branch

```yaml
name: On push
on:
  push:
    branches:
      - test
jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: karol-brejna-i/webpage-screenshot-action@develop
        with:
          url: https://github.com/karol-brejna-i/webpage-screenshot-action/blob/{{ github.ref_name }}/README.md
      - uses: actions/upload-artifact@v3
        with:
          name: simple-screenshot
          path: ${{ github.workspace }}/*.png
```

This workflow is triggered by a push to the `test` branch. 
It simply creates a screenshot of the README.md file in the test branch and uploads it to the artifacts.

The interesting part here is how the URL (of the page to be captured) is constructed.
First of all, we want to "see" the page, as the user would see it -- that's why we are showing a web page, not a raw markdown file.
The pattern here is: "github.com/`user`/`repo`/blob/`branch`/`file`"
Then, we want to see the README.md file from the branch that triggered the workflow.
We use the `github.ref_name` value (available in the workflow context) to get the name of the branch.

## Triggered by a push to a specific branch and a specific file

```yaml
name: Upload screenshot
on:
  push:
    branches:
      - main
    paths:
      - README.md
jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: karol-brejna-i/webpage-screenshot-action@develop
        with:
          url: https://github.com/karol-brejna-i/webpage-screenshot-action/blob/{{ github.ref_name }}/README.md
```



## Triggered periodically
The following code creates a GitHub Actions workflow that runs every day at midnight (0:00 UTC),
takes a screenshot of the `README.md` in main branch and uploads it to the GitHub Actions artifacts storage.

```yaml
name: Upload screenshot
on:
  schedule:
    - cron: '0 0 * * *'
jobs:
    steps:
      - uses: karol-brejna-i/webpage-screenshot-action@develop
        with:
          url: https://github.com/karol-brejna-i/webpage-screenshot-action/blob/main/README.md
      - uses: actions/upload-artifact@v3
        with:
          name: simple-screenshot
          path: ${{ github.workspace }}/*.png
```

