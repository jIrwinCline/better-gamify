import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

async function filesIn(directory, prefix) {
  const entries = (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(directory, entry.name);
    const name = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await filesIn(full, name));
    else if (entry.isFile()) files.push({ name, bytes: await readFile(full) });
    else throw new Error(`Skill packages must contain regular files: ${name}`);
  }
  return files;
}

// Small standard ZIP archives, made with Node's built-ins. Stable timestamps
// make the same skill source produce the same downloadable archive.
export async function packageSkills(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const files = await filesIn(path.join(source, entry.name), entry.name);
    if (!files.some(file => file.name === `${entry.name}/SKILL.md`)) throw new Error(`Missing SKILL.md in ${entry.name}`);
    const localParts = [], centralParts = [];
    let offset = 0;
    for (const file of files) {
      const name = Buffer.from(file.name);
      const data = deflateRawSync(file.bytes);
      const crc = crc32(file.bytes);
      const local = Buffer.alloc(30);
      local.writeUInt32LE(0x04034b50, 0);
      local.writeUInt16LE(20, 4);
      local.writeUInt16LE(0x800, 6);
      local.writeUInt16LE(8, 8);
      local.writeUInt16LE(0x5021, 12); // January 1, 2020
      local.writeUInt32LE(crc, 14);
      local.writeUInt32LE(data.length, 18);
      local.writeUInt32LE(file.bytes.length, 22);
      local.writeUInt16LE(name.length, 26);
      const central = Buffer.alloc(46);
      central.writeUInt32LE(0x02014b50, 0);
      central.writeUInt16LE(20, 4);
      local.copy(central, 6, 4, 30);
      central.writeUInt32LE(offset, 42);
      localParts.push(local, name, data);
      centralParts.push(central, name);
      offset += local.length + name.length + data.length;
    }
    const directory = Buffer.concat(centralParts);
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(files.length, 8);
    end.writeUInt16LE(files.length, 10);
    end.writeUInt32LE(directory.length, 12);
    end.writeUInt32LE(offset, 16);
    await writeFile(path.join(destination, `${entry.name}.zip`), Buffer.concat([...localParts, directory, end]));
  }
}
