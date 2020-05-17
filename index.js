#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const blessed = require('blessed');
const spawn = require('child_process').spawn;
const dirTree = require('dir-tree-creator');
const yargs = require('yargs').argv;

const intervalLenS = 2;
let renderedDate = new Date();

const dirToWatch = yargs._.length ? yargs._[0] : process.cwd();
let tree;

const screen = blessed.screen({
    smartCSR: true
});

const headerLeft = blessed.box({
    top: 'start',
    left: 'start',
    width: '50%',
    height: 1,
    content: `Every ${intervalLenS}s: tree`,
    tags: true,
});

const headerRight = blessed.box({
    top: 'start',
    right: '0',
    width: '50%',
    height: 2,
    content: renderedDate.toString(),
    tags: true,
});

const content = blessed.box({
    top: 2,
    left: 0,
    width: '100%',
    height: '100%',
    content: tree,
    tags: true,
});

screen.append(headerLeft);
screen.append(headerRight);
screen.append(content);

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

screen.key(['enter'], function (ch, key) {
    return process.exit(0);
});

screen.render();

const createDirTree = () => {


    dirTree(dirToWatch, (err, tr) => {
        if (err) return console.error(err)
        tree = tr;
        content.content = tree;
        // console.log(tree)
      })
};
 
const setRenderedDate = () => {
    renderedDate = (new Date()).toString();
    headerRight.content = renderedDate;
}

const renderDirTree = () => {
    createDirTree();
    setRenderedDate();
    //SET CONTENT FOR HEADERRIGHT AND CONTENT
    screen.render();
}

const renderDirTreeLoop = () => {
    setInterval(() => {
        renderDirTree();
    }, intervalLenS * 1000)
}

renderDirTree();
renderDirTreeLoop();


// (function main() {

//     if (process.env.process_restarting) {
//       delete process.env.process_restarting;
//       // Give old process one second to shut down before continuing ...
//       setInterval(main, 1000);
//       return;
//     }
  
//     // ...
  
//     // Restart process ...
//     spawn(process.argv[0], process.argv.slice(1), {
//       env: { process_restarting: 1 },
//       stdio: 'ignore'
//     }).unref();
//   })();