# **Denote App**

## Introduction
Note-taking app for College Students, enhanced by AI

<img width="1065" alt="image" src="https://github.com/ouragan84/denote-app/assets/77756530/f9b3e157-a48f-4679-a377-3e1a535c4785">


## Details

* Easy to use math fields
* AI based prompt responses
* Fill in the blanks using GPT
* Beautify notes using a button!


## Preview
##### Main view:
![main](https://user-images.githubusercontent.com/77756530/146632339-d08d5ba3-887b-4977-9f8b-0c26cc60ff9f.jpeg)

##### Easy to use math fields:

[![Watch the video](<img src="https://github.com/ouragan84/denote-app/assets/77756530/93ef08df-10e6-4a78-9d90-9d6fb09e9a09" alt="Image" style="width: 60%;">
)](https://github.com/ouragan84/denote-app/assets/77756530/a5caa278-936c-4da5-a0df-c5413a44fcc5)


##### AI - Question:

<img src="https://github.com/ouragan84/denote-app/assets/77756530/59c2e58c-341c-4e20-8eae-d50415deb192" alt="image"  style="width: 60%;">

##### AI - Fill Blanks \[..\]
Before:

<img src="https://github.com/ouragan84/denote-app/assets/77756530/c63023b3-ab4c-4f85-b907-78884623971a" alt="Image 1" style="width: 60%;">

After:

<img src="https://github.com/ouragan84/denote-app/assets/77756530/7f889f14-b229-41ce-af2d-522636b1b249" alt="Image 2" style="width: 60%;">


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

 - Create a file called `gh_token`, and paste in your token there

<br>
<br>

### **Everytime you deploy a release:**

 - Merge in master

 - Add change logs to `update_logs.html` 

 - Change Version in `package.json`

 - Commit and Push your changes, please include version name inside commit message.

 - Build the binary files with `npm run build` (they end up in ./dist folder)

 - Try installing the app and make sure it works (hopefully in windows AND mac-os)

 - Create a release in github (can only be done with Apple Developper ID, so only Edgar can deploy for now). You have two options:

   1. Deploy Automatically:

      - run `npm run deploy`

      - Make sure that the release was published in the `denote-releases` github repo. If not, do #2

      - Edit the release and publish it!

   2. Delpoy Manually:

      - Draft a new release in the `denote-releases` github repo

      - Make the **title** be the SAME version as in `package.json`, i.e. `0.1.4`

      - Make the **tag** be the SAME version as in `package.json`, i.e. `v0.1.4`

      - Upload binaries from `./dist` (just the files, not the folders).

      - Hit Publish!

 - Make sure that when you download from the website, you're getting the latest version, if not contact Edgar. 

 - Change Version in .env of website
