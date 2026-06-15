const bcrypt = require('bcryptjs');
const hash = '$2a$12$SlgkV0nsyK6MQ0opb6kURelOJRB5qJ37UWBoCCSclk5YmD/.VGJ/W';
console.log('Hash:', hash);
bcrypt.compare('naver2026!', hash).then(r => {
  console.log('Match naver2026!:', r);
});
// 새 해시 생성
bcrypt.hash('naver2026!', 12).then(newHash => {
  console.log('New hash:', newHash);
  bcrypt.compare('naver2026!', newHash).then(r2 => {
    console.log('New hash match:', r2);
  });
});
