const { Project } = require('ts-morph');
const resolve = require('resolve/sync');
const { getTsconfig } = require('get-tsconfig');
const { minimatch } = require('minimatch');
const { relative: relativePath, dirname } = require('path');

const tsconfig = getTsconfig();

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

const resolveFile = (importPath, basedir = `${__dirname}/src`) =>
  resolve(importPath, {
    basedir,
    extensions: ['.ts', '.tsx'],
  });

// Uses the tsconfig path aliases to resolve the path
const resolveAlias = (importPath) => {
  const alias = Object.keys(tsconfig.config.compilerOptions.paths).find((key) =>
    // The tsconfig globs handle the asterisk at the end of the alias slightly differently
    minimatch(importPath, key.replace('*', '**')),
  );
  if (!alias) {
    console.warn('Could not find alias for path', importPath);
    return importPath;
  }
  // We have to do this little dance here to account for the * at the end of the aliases
  const cleanAlias = alias.replace('*', '');
  const aliasPath = tsconfig.config.compilerOptions.paths[alias][0]
    .replace('*', '')
    .replace('src/', './');
  const realPath = importPath.replace(cleanAlias, aliasPath);
  const resolved = resolveFile(realPath);
  return resolved.replace(
    `${__dirname}/src/${aliasPath.replace('./', '')}`,
    cleanAlias,
  );
};

// Function to resolve module path using TypeScript's own resolution
const resolveModulePath = (filePath, importPath) => {
  if (importPath.startsWith('~')) {
    return resolveAlias(importPath);
  }
  const relPath = relativePath(
    dirname(filePath),
    resolveFile(importPath, dirname(filePath)),
  );
  if (relPath.startsWith('.')) {
    return relPath;
  }
  return `./${relPath}`;
};

const rewriteDeclaration = (declaration, filePath) => {
  const modulePath = declaration.getModuleSpecifierValue();
  if (!modulePath) {
    return;
  }
  // This is most likely a node module
  if (!modulePath.startsWith('.') && !modulePath.startsWith('~')) {
    return;
  }
  try {
    const resolvedPath = resolveModulePath(filePath, modulePath);
    declaration.setModuleSpecifier(resolvedPath);
  } catch (e) {
    console.warn(`Could not resolve ${modulePath} in ${filePath}:`, e);
  }
};

// Go through all files and all import statements
project.getSourceFiles().forEach((file) => {
  const filePath = file.getFilePath();
  if (filePath.endsWith('.d.ts')) {
    return;
  }
  file
    .getImportDeclarations()
    .forEach((declaration) => rewriteDeclaration(declaration, filePath));
  file
    .getExportDeclarations()
    .forEach((declaration) => rewriteDeclaration(declaration, filePath));
});

project.saveSync();
