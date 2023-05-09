# Run

```
npm i
npm run watch
```
in another instance of shell:
```
npm start
```

CMD+R to reload, changes should apply imediatly.


# Build CheckList:

 - Merge in master

 - Test App thouroughly in Dev mod

 - Add change logs to `update_logs.html` 

 - Change Version in `package.json`

 - Build the app with `npm run watch`

 - Build the binary files with `npm run dist` (they end up in ./dist folder)

 - Try installing the app and make sure it works (hopefully in windows and mac-os)

 - Create a release in github, make sure to match version, and upload binaries (files only, no folders).