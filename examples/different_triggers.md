# Different triggers examples

This document shows different ways a workflow that uses this action can be triggered.

## Triggered by a push to a specific branch

```yaml
name: Upload screenshot
on:
  push:
    branches:
      - main
jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: karol-brejna-i/webpage-screenshot-action@v1
        with:
          url: https://github.com/karol-brejna-i/webpage-screenshot-action/blob/main/README.md
      - uses: actions/upload-artifact@v3
        with:
          name: simple-screenshot
          path: ${{ github.workspace }}/*.png
```


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
      - uses: karol-brejna-i/webpage-screenshot-action@v1
        with:
          url: https://github.com/karol-brejna-i/webpage-screenshot-action/blob/main/README.md
      - uses: actions/upload-artifact@v3
        with:
          name: simple-screenshot
          path: ${{ github.workspace }}/*.png
```

## Triggered periodically

```yaml
name: Upload screenshot
on:
  schedule:
    - cron: '0 0 * * *'
jobs:
    steps:
      - uses: karol-brejna-i/webpage-screenshot-action@v1
        with:
          url: https://github.com/karol-brejna-i/webpage-screenshot-action/blob/main/README.md
      - uses: actions/upload-artifact@v3
        with:
          name: simple-screenshot
          path: ${{ github.workspace }}/*.png
```