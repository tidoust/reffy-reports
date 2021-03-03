const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

const rootDir = path.resolve(__dirname, '..');

const packages = [
  {
    srcDir: path.join(rootDir, 'ed/idl'),
    dstDir: path.join(rootDir, 'packages/idl'),
    patchDir: path.join(rootDir, 'ed/idlpatches'),
    fileExt: 'idl'
  },
  {
    srcDir: path.join(rootDir, 'ed/css'),
    dstDir: path.join(rootDir, 'packages/css'),
    fileExt: 'json'
  },
];


async function main() {
  for (const { srcDir, dstDir, patchDir, fileExt } of packages) {
    // rm dstDir/*.${fileExt}
    const dstFiles = await fs.readdir(dstDir);
    for (const file of dstFiles) {
      if (file.endsWith('.' + fileExt) && (file !== 'package.json')) {
        await fs.unlink(path.join(dstDir, file));
      }
    }

    // cp srcDir/*.${fileExt} dstDir/
    const srcFiles = await fs.readdir(srcDir);
    for (const file of srcFiles) {
      if (file.endsWith('.' + fileExt)) {
        await fs.copyFile(path.join(srcDir, file), path.join(dstDir, file));
      }
    }

    // The patches are against srcDir and can be applied there using `git am`,
    // but apply them in dstDir instead using `git apply`.
    if (patchDir) {
      const patchFiles = await fs.readdir(patchDir);
      for (const file of patchFiles) {
        if (file.endsWith('.patch')) {
          const patch = path.join(patchDir, file);
          console.log(`Applying ${file}`);
          await execFile('git', ['apply', '--directory=packages/idl', '-p3', patch], {
            cwd: rootDir
          });
        }
      }
    }
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1)
});
