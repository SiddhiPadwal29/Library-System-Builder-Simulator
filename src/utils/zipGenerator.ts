// Pure TypeScript lightweight Stored (.zip) compression generator.
// Created to safely avoid heavy dependency compilation errors in Vite environments.

function crc32(str: string): number {
  let crcTable = (window as any)._crcTable;
  if (!crcTable) {
    crcTable = [];
    let c;
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crcTable[n] = c;
    }
    (window as any)._crcTable = crcTable;
  }

  let crc = 0 ^ -1;
  const bytes = new TextEncoder().encode(str);
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc & 255) ^ bytes[i]];
  }
  return (crc ^ -1) >>> 0;
}

export function downloadProjectZip(files: Array<{ path: string; content: string }>) {
  const records: Uint8Array[] = [];
  let currentOffset = 0;
  const centralDirectoryHeaders: Uint8Array[] = [];

  const textEncoder = new TextEncoder();

  for (const file of files) {
    const filenameBytes = textEncoder.encode(file.path);
    const contentBytes = textEncoder.encode(file.content);
    const crc = crc32(file.content);
    const size = contentBytes.length;

    // Local File Header (LFH) size: 30 + filename length + data length
    const lfh = new Uint8Array(30 + filenameBytes.length + size);

    // LFH Signature: 0x04034b50 (little endian: 50 4b 03 04)
    lfh[0] = 0x50;
    lfh[1] = 0x4b;
    lfh[2] = 0x03;
    lfh[3] = 0x04;

    // Version needed to extract: 10
    lfh[4] = 10;
    lfh[5] = 0;

    // General purpose flag: 0x0800 (bit 11 set: UTF-8 filenames)
    lfh[6] = 0x00;
    lfh[7] = 0x08;

    // Compression method: Stored (0)
    lfh[8] = 0;
    lfh[9] = 0;

    // Mod time & Mod date: 0
    lfh[10] = 0;
    lfh[11] = 0;
    lfh[12] = 0;
    lfh[13] = 0;

    // CRC-32
    lfh[14] = crc & 0xff;
    lfh[15] = (crc >> 8) & 0xff;
    lfh[16] = (crc >> 16) & 0xff;
    lfh[17] = (crc >> 24) & 0xff;

    // Compressed size
    lfh[18] = size & 0xff;
    lfh[19] = (size >> 8) & 0xff;
    lfh[20] = (size >> 16) & 0xff;
    lfh[21] = (size >> 24) & 0xff;

    // Uncompressed size
    lfh[22] = size & 0xff;
    lfh[23] = (size >> 8) & 0xff;
    lfh[24] = (size >> 16) & 0xff;
    lfh[25] = (size >> 24) & 0xff;

    // Filename length
    lfh[26] = filenameBytes.length & 0xff;
    lfh[27] = (filenameBytes.length >> 8) & 0xff;

    // Extra field length: 0
    lfh[28] = 0;
    lfh[29] = 0;

    // Set filename and data fields
    lfh.set(filenameBytes, 30);
    lfh.set(contentBytes, 30 + filenameBytes.length);

    records.push(lfh);

    // Central Directory File Header (CDFH) size: 46 + filename length
    const cdh = new Uint8Array(46 + filenameBytes.length);

    // CDFH Signature: 0x02014b50 (little endian: 50 4b 01 02)
    cdh[0] = 0x50;
    cdh[1] = 0x4b;
    cdh[2] = 0x01;
    cdh[3] = 0x02;

    // Version made by: 2.0 (20)
    cdh[4] = 20;
    cdh[5] = 0;

    // Version needed to extract: 1.0 (10)
    cdh[6] = 10;
    cdh[7] = 0;

    // General purpose flag: 0x0800 (UTF-8 filename flag)
    cdh[8] = 0x00;
    cdh[9] = 0x08;

    // Compression: Stored
    cdh[10] = 0;
    cdh[11] = 0;

    // Mod time & Mod date: 0
    cdh[12] = 0;
    cdh[13] = 0;
    cdh[14] = 0;
    cdh[15] = 0;

    // CRC-32
    cdh[16] = crc & 0xff;
    cdh[17] = (crc >> 8) & 0xff;
    cdh[18] = (crc >> 16) & 0xff;
    cdh[19] = (crc >> 24) & 0xff;

    // Compressed size
    cdh[20] = size & 0xff;
    cdh[21] = (size >> 8) & 0xff;
    cdh[22] = (size >> 16) & 0xff;
    cdh[23] = (size >> 24) & 0xff;

    // Uncompressed size
    cdh[24] = size & 0xff;
    cdh[25] = (size >> 8) & 0xff;
    cdh[26] = (size >> 16) & 0xff;
    cdh[27] = (size >> 24) & 0xff;

    // Filename length
    cdh[28] = filenameBytes.length & 0xff;
    cdh[29] = (filenameBytes.length >> 8) & 0xff;

    // Extra, comment, disk, attrs: 0
    cdh[30] = 0;
    cdh[31] = 0; // extra length
    cdh[32] = 0;
    cdh[33] = 0; // comment length
    cdh[34] = 0;
    cdh[35] = 0; // disk index start
    cdh[36] = 0;
    cdh[37] = 0; // internal file attrs
    cdh[38] = 0;
    cdh[39] = 0;
    cdh[40] = 0;
    cdh[41] = 0; // external file attrs

    // Local Header Offset from beginning of file
    cdh[42] = currentOffset & 0xff;
    cdh[43] = (currentOffset >> 8) & 0xff;
    cdh[44] = (currentOffset >> 16) & 0xff;
    cdh[45] = (currentOffset >> 24) & 0xff;

    cdh.set(filenameBytes, 46);
    centralDirectoryHeaders.push(cdh);

    currentOffset += lfh.length;
  }

  // Count size of all Central Directory Headers
  let centralDirectoryLength = 0;
  for (const cdh of centralDirectoryHeaders) {
    centralDirectoryLength += cdh.length;
  }

  // End of Central Directory Header Record (EOCD) size: 22 bytes
  const eocd = new Uint8Array(22);

  // EOCD Signature: 0x06054b50 (little endian: 50 4b 05 06)
  eocd[0] = 0x50;
  eocd[1] = 0x4b;
  eocd[2] = 0x05;
  eocd[3] = 0x06;

  // Disk indices: 0
  eocd[4] = 0;
  eocd[5] = 0;
  eocd[6] = 0;
  eocd[7] = 0;

  // Record counts inside central directory (number of files)
  const filesCount = files.length;
  eocd[8] = filesCount & 0xff;
  eocd[9] = (filesCount >> 8) & 0xff;
  eocd[10] = filesCount & 0xff;
  eocd[11] = (filesCount >> 8) & 0xff;

  // Size of entire Central Directory Block
  eocd[12] = centralDirectoryLength & 0xff;
  eocd[13] = (centralDirectoryLength >> 8) & 0xff;
  eocd[14] = (centralDirectoryLength >> 16) & 0xff;
  eocd[15] = (centralDirectoryLength >> 24) & 0xff;

  // Central Directory Offset relative to start of file
  eocd[16] = currentOffset & 0xff;
  eocd[17] = (currentOffset >> 8) & 0xff;
  eocd[18] = (currentOffset >> 16) & 0xff;
  eocd[19] = (currentOffset >> 24) & 0xff;

  // Zip Archive Comment Length: 0
  eocd[20] = 0;
  eocd[21] = 0;

  // Combine binary blocks, package blob, and save download
  const blobParts: Uint8Array[] = [...records, ...centralDirectoryHeaders, eocd];
  const blob = new Blob(blobParts, { type: "application/zip" });

  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.href = url;
  element.download = "week3-library-system.zip";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
}
