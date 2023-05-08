const fs = require('fs');
const path = require('path');

function getTree(dirPath) {
  const name = path.basename(dirPath);
  const stats = fs.statSync(dirPath);
  const tree = { id: Math.floor(Math.random() * 1000), name, path:dirPath ,isFolder: stats.isDirectory(), items: [] };
  if (stats.isDirectory()) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      tree.items.push(getTree(filePath));
    }
  }
  return tree;
}


function findNodeById(tree, id) {
    if (tree.id === id) {
        return tree;
    }

    for (const item of tree.items) {
        const node = findNodeById(item, id);
        if (node) {
            return node;
        }
    }

    return null;
}

function generateUniqueId() {
    return Math.floor(Math.random() * 1000000);
}


const useTraverseTree = () => {
    function insertNode(tree, _id, item, isFolder){
        const parent = findNodeById(tree, _id);

    if (!parent || !parent.isFolder) {
        console.error(`Parent with id ${_id} is not a folder.`);
        return;
    }

    const name = item
    const id = generateUniqueId();
    const path = `${parent.path}/${name}`;
    const items = [];

    const newNode = { id, name, path, isFolder, items };

    if (isFolder) {
        fs.mkdir(path, { recursive: true }, (error) => {
        if (error) {
            console.error(`Failed to create directory ${path}.`);
        } else {
            console.log(`Directory ${path} created.`);
            parent.items.push(newNode);
        }
        });

        
    } else {
        fs.writeFile(path, '', (error) => {
        if (error) {
            console.error(`Failed to create file ${path}.`);
        } else {
            console.log(`File ${path} created.`);
            parent.items.push(newNode);
        }
        });
    }

    // tree.items.unshift(newNode)
    return tree;

        // if(tree.id === _id && tree.isFolder){
        //     tree.items.unshift({
        //         id: new Date().getTime(),
        //         name: item,
        //         isFolder,
        //         items: []
        //     })
        //     return tree
        // }
        
        // let latestNode = []
        // latestNode = tree.items.map((obj) => {
        //     return insertNode(obj, _id, item, isFolder)
        // })

        // return {...tree, item:latestNode}

    }
    return {insertNode}
}

export default useTraverseTree