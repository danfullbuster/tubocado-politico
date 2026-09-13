const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`\n✅  TBP local en: http://localhost:${PORT}`);
  console.log('   (las noticias necesitan el servidor completo con MongoDB)\n');
  try { require('child_process').exec(`start http://localhost:${PORT}`); } catch(e) {}
});
