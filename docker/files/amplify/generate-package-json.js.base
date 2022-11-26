/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const cdappPackage = require('./package.colonyCDapp.json');
const packageJsonBase = require('./package.base.json');

const generatePackage = async () => {
  console.log(`Generating amplify's package.json...`);

  const dependenciesFile = fs.readFileSync(
    path.join(process.cwd(), 'dependencies'),
  );

  const output = {
    ...packageJsonBase,
  };

  dependenciesFile
    .toString()
    .split(/\r?\n/)
    .forEach((dependency) => {
      const version =
        cdappPackage.dependencies[dependency] ||
        cdappPackage.devDependencies[dependency];
      if (!version) {
        console.error(
          `Package ${dependency} specified in amplify's dependencies is not present in cdapp's package.json`,
        );

        return;
      }

      output.dependencies = {
        ...output.dependencies,
        [dependency]: version,
      };
    });

  fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    JSON.stringify(output),
  );
};

generatePackage();
