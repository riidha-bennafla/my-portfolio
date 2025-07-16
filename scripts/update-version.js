const fs = require("fs");
const path = require("path");

// 1. Read package.json
const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const [major, minor, patch] = packageJson.version.split(".").map(Number);

// 2. Bump patch version
const newPatch = patch + 1;
const newVersion = `${major}.${minor}.${newPatch}`;
packageJson.version = newVersion;

// 3. Write updated version back to package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// 4. Create metadata
const currentDate = new Date().toISOString().split("T")[0];
const buildDate = new Date().toISOString();

const versionData = {
  version: newVersion,
  lastUpdated: currentDate,
  buildDate,
};

// 5. Write version.json
const versionJsonPath = path.join(__dirname, "../version.json");
fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));

// 6. Write utils/version.ts
const versionTsContent = `// Auto-generated file - Do not edit manually
export const VERSION_INFO = {
  version: '${newVersion}',
  lastUpdated: '${currentDate}',
  buildDate: '${buildDate}'
} as const;
`;

const versionTsPath = path.join(__dirname, "../utils/version.ts");
fs.writeFileSync(versionTsPath, versionTsContent);

console.log(`✅ Version bumped to ${newVersion}`);
