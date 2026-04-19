const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const buildDir = path.join(__dirname, "build");
const svgPath = path.join(buildDir, "icon.svg");

async function generateIcons() {
  if (!fs.existsSync(svgPath)) {
    console.error("Error: build/icon.svg not found. Please place your SVG icon file there.");
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(svgPath);

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(buildDir, "icon.png"));
  console.log("Generated: build/icon.png (512x512)");

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, "resources", "icon.png"));
  console.log("Generated: resources/icon.png (512x512)");

  const icoSizes = [16, 24, 32, 48, 64, 128, 256];
  const icoPngBuffers = [];
  for (const size of icoSizes) {
    const buf = await sharp(svgBuffer).resize(size, size).png().toBuffer();
    icoPngBuffers.push({ size, buf });
  }

  const icoHeaderSize = 6;
  const icoDirEntrySize = 16;
  const dataSize = icoPngBuffers.reduce((sum, entry) => sum + entry.buf.length, 0);
  const totalSize = icoHeaderSize + icoDirEntrySize * icoPngBuffers.length + dataSize;

  const ico = Buffer.alloc(totalSize);
  let offset = 0;

  ico.writeUInt16LE(0, offset);
  offset += 2;
  ico.writeUInt16LE(1, offset);
  offset += 2;
  ico.writeUInt16LE(icoPngBuffers.length, offset);
  offset += 2;

  let dataOffset = icoHeaderSize + icoDirEntrySize * icoPngBuffers.length;
  for (const entry of icoPngBuffers) {
    ico.writeUInt8(entry.size >= 256 ? 0 : entry.size, offset);
    offset += 1;
    ico.writeUInt8(entry.size >= 256 ? 0 : entry.size, offset);
    offset += 1;
    ico.writeUInt8(0, offset);
    offset += 1;
    ico.writeUInt8(0, offset);
    offset += 1;
    ico.writeUInt16LE(1, offset);
    offset += 2;
    ico.writeUInt16LE(32, offset);
    offset += 2;
    ico.writeUInt32LE(entry.buf.length, offset);
    offset += 4;
    ico.writeUInt32LE(dataOffset, offset);
    offset += 4;
    dataOffset += entry.buf.length;
  }

  offset = icoHeaderSize + icoDirEntrySize * icoPngBuffers.length;
  for (const entry of icoPngBuffers) {
    entry.buf.copy(ico, offset);
    offset += entry.buf.length;
  }

  fs.writeFileSync(path.join(buildDir, "icon.ico"), ico);
  console.log("Generated: build/icon.ico (multi-size)");

  console.log("\nAll icons generated successfully!");
}

generateIcons().catch(console.error);
