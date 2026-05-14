import 'dotenv/config';
import bcrypt from 'bcrypt';

const pw = process.argv[2];
if (!pw) { console.error('Usage: node src/db/hashpw.js <password>'); process.exit(1); }
bcrypt.hash(pw, 12).then(console.log);
