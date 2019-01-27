// Generate random DNA sequence
const fs = require('fs');
const { promisify } = require('util');
const { StringDecoder } = require('string_decoder');

const decoder = new StringDecoder('utf8');

const dictionary = ['G', 'A', 'T', 'C'];
const read = promisify(fs.read);

const memory = new Uint8Array(2 ** 24);

let totalBytes = 0;

const _buffer = new Uint8Array(1024);
async function test(fd) {
  const {bytesRead, buffer} = await read(fd, _buffer, 0, 1024, null);

  memory.set(buffer, totalBytes); // first fill buffer then calculate total
  totalBytes += bytesRead;

  if (!bytesRead) {
    console.log(decoder.end(Buffer.from(memory.buffer, 0, totalBytes)));
    console.log(totalBytes);
    fs.close(fd, () => {});
    return;
  }
  await test(fd);
}
const fd = fs.openSync('protein.txt', 'r');
test(fd);
