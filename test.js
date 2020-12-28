// Hashovanje lozinke
const bcrypt = require('bcrypt');

var lozinka = 'Nikola';

var hasovanaLozinka = bcrypt.hashSync(lozinka,3);

console.log(hasovanaLozinka);