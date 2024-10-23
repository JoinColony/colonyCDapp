const { build, context } = require('esbuild');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

// Define the glob pattern to find all index.ts files, excluding node_modules directories
const globPattern = 'amplify/backend/function/**/src/index.ts';
const excludeNodeModules = '**/node_modules/**';

const isWatchMode = process.argv.includes('--watch');

// Dynamically generate entry points using glob, ignoring node_modules
const entryFiles = glob.sync(globPattern, { ignore: excludeNodeModules });

// Helper function to find a tsconfig.json inside a Lambda directory
const findTsConfig = (filePath) => {
  const lambdaDir = path.dirname(path.dirname(filePath));
  const tsconfigPath = path.join(lambdaDir, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    return tsconfigPath;
  }
  return null;
};

// This will hold active esbuild contexts
let activeContexts = [];

async function runBuild() {
  for (const entryFile of entryFiles) {
    const tsconfigPath = findTsConfig(entryFile);

    const buildOptions = {
      entryPoints: [entryFile],
      bundle: true,
      minify: true,
      sourcemap: true,
      platform: 'node',
      target: ['node20'],
      tsconfig: tsconfigPath,
      external: ['/opt/nodejs/*'],
      outdir: path.dirname(entryFile), // Output to the same directory as the entry file
    };

    if (isWatchMode) {
      const ctx = await context(buildOptions);
      await ctx.watch();
      activeContexts.push(ctx);
      console.log(`Watching for changes in ${entryFile}...`);
    } else {
      await build(buildOptions);
      console.log(`Build completed for ${entryFile}`);
    }
  }
}

// Handle termination signals to clean up watchers
function cleanUp() {
  console.log('\nTerminating esbuild watchers...');
  activeContexts.forEach((ctx) => ctx.dispose()); // Properly stop all active watchers
  process.exit();
}

process.on('SIGINT', cleanUp);
process.on('SIGTERM', cleanUp);

runBuild().catch(() => process.exit(1));
