const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const packageJson = require("../package.json");
const packageName = packageJson.name;
const packageVersion = packageJson.version;
const tarballName = `${packageName}-${packageVersion}.tgz`;
const distDir = path.join(__dirname, "../dist");

function run(command) {
  execSync(command, { stdio: "inherit" });
}

console.log("Running build process...");
run("npm run prepack");
if (!fs.existsSync(distDir)) {
  console.error("Error: dist directory does not exist after build.");
  process.exit(1);
}

console.log(`Creating tarball package: ${tarballName}`);
run("npm pack");

if (!fs.existsSync(path.join(process.cwd(), tarballName))) {
  console.error("Error: tarball creation failed.");
  process.exit(1);
}

try {
  execSync("npm whoami", { stdio: "ignore" });
} catch {
  console.log("You are not logged into npm. Running `npm login`...");
  run("npm login");
}

console.log("Publishing package to npm...");
run(`npm publish ${tarballName}`);

console.log(`Package ${packageName}@${packageVersion} has been published successfully!`);
