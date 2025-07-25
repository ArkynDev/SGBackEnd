const bcrypt = require('bcrypt');

// Defina a senha que deseja hashear
const senha = 'codenameGinaldo';
const saltRounds = 10;


bcrypt.hash(senha, saltRounds).then(hash => {
    console.log('Senha criptografada:', hash);
});