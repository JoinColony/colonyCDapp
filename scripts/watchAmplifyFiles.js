/**
 * This script watches for changes in the amplify directory and copies the changed files to the `amplify` Docker container.
 */
/* eslint-disable no-console */
const { execSync } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

const watchDir = './amplify';
const targetDir = '/colonyCDapp';

const watcher = chokidar.watch(watchDir, {
  ignored: /^(?!.*\.env$).*\/\.[^/]+|\/node_modules\//, // Ignore dotfiles except .env and ignore node_modules
  ignoreInitial: true,
});

const copyToDockerContainer = (filePath) => {
  // Compute the relative path from the watched directory
  const relativePath = path.relative(process.cwd(), filePath);
  // Construct the target path inside the Docker container
  const targetPath = path.join(targetDir, relativePath);

  // Extract the directory and create it in the container (it might exist, but if it doesn't `docker cp` fill error)
  const targetDirPath = path.dirname(targetPath);
  const createDirectoryCommand = `docker exec amplify mkdir -p "${targetDirPath}"`;
  try {
    execSync(createDirectoryCommand);
    console.log(
      `Directory ${targetDirPath} was created in amplify container (or it existed before).`,
    );
  } catch (err) {
    console.error(`Error creating directory in amplify container: ${err}`);
    return;
  }

  const dockerCopyCommand = `docker cp "${filePath}" "amplify:${targetPath}"`;
  try {
    execSync(dockerCopyCommand);
    console.log(
      `File ${filePath} was copied to amplify container successfully.`,
    );
  } catch (err) {
    console.error(`Error copying file to amplify container: ${err}`);
  }
};

watcher
  .on('change', (filePath) => {
    console.log(`File ${filePath} has been changed`);
    copyToDockerContainer(filePath);
  })
  .on('add', (filePath) => {
    console.log(`File ${filePath} has been added`);
    copyToDockerContainer(filePath);
  });

console.log(`Watching for file changes in ${watchDir}`);
