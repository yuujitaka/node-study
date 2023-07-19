const fs = require('fs');
const path = require('path');
//more efficient for long text files
const rs = fs.createReadStream(path.join(__dirname, 'files', 'lorem.txt'), {
  encoding: 'utf-8',
});

const ws = fs.createWriteStream(path.join(__dirname, 'files', 'newLorem.txt'));

//listener
rs.on('data', (dataChunk) => {
  ws.write(dataChunk);
});

rs.pipe(ws);
