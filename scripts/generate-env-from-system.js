const fs = require('fs');

fs.writeFileSync('.env', JSON.stringify(process.env));
