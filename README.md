# **Denote App**

## **Get Started**

### **To Run Locally:**

```
npm i
npm run watch
```

in another instance of shell:

```
npm start
```

CMD+R to reload, although changes should apply imediatly.

<br>
<br>

### **Some troubleshooting:**

Depending on the libraries you're using, you might need to change the `npm run watch` script in `package.json`:

This one runs much faster:

`    "watch": "webpack --config webpack.common.js --watch",`

This one may help resolve some libraries like `excalidraw` for example:

`    "watch": "webpack --mode production --config webpack.common.js --watch",`

<br>
<br>

--- 

<br>
<br>


## **Build and Deploy Checklist:**

### **Do this once:**

 - In github, go to profile, go to dev options, create a fine-grained personal access token

 - Add read/write commit options for `denote-releases` repository

 - Create a file called `electron-builder.yml`, and add this:

```
appId: com.denote.app
publish:
  provider: github
  token: PASTE_TOKEN_HERE
```

<br>
<br>

## **Everytime you deploy a release:**

 - Merge in master

 - Add change logs to `update_logs.html` 

 - Change Version in `package.json`

 - Commit and Push your changes

 - Build the binary files with `npm run build` (they end up in ./dist folder)

 - Try installing the app and make sure it works (hopefully in windows AND mac-os)

 - Create a release in github. You have two options:

    1. Deploy Automatically:

      - run `npm run deploy`

      - Make sure that the release was published in the `denote-releases` github repo. If not, do #2

   2. Delpoy Manually:

      - Draft a new release in the `denote-releases` github repo

      - Make the **title** be the SAME version as in `package.json`, i.e. `0.1.4`

      - Make the **tag** be the SAME version as in `package.json`, i.e. `0.1.4`

      - Upload binaries from `./dist` (just the files, not the folders).

      - Hit Publish!

 - Make sure that when you download from the website, you're getting the latest version, if not contact Edgar. 