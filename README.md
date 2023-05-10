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

 - Commit and Push your changes

 - Build the binary files with `npm run dist` (they end up in ./dist folder)

 - Try installing the app and make sure it works (hopefully in windows and mac-os)

 - Create a release in github: 

    - Add SAME version for title, like `0.1.4`

    - Add SAME verstion for title

    - Upload binaries (files only, no folders).

 - Publish!