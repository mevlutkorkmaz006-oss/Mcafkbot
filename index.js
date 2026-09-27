const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Render'ı uyanık tutmak için mini web sunucusu
app.get('/', (req, res) => {
  res.send('AFK Bot aktif ve sunucuyu uyanik tutuyor!');
});

app.listen(PORT, () => {
  console.log(`Web sunucusu ${PORT} portunda dinleniyor.`);
});

// SUNUCU BİLGİLERİ (Buraları senin için hazırladım!)
const SERVER_HOST = '163.5.201.9'; 
const SERVER_PORT = 10124;              
const BOT_NAME = 'AFK_Bot_Tunc';        

function startBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_NAME,
    version: false // Otomatik sürüm algılama
  });

  bot.on('spawn', () => {
    console.log('Bot başarıyla sunucuya girdi!');
    
    // Anti-AFK: Her 2 saniyede bir eğilip (sneak) kalkar
    let isSneaking = false;
    setInterval(() => {
      isSneaking = !isSneaking;
      bot.setControlState('sneak', isSneaking);
    }, 2000);
  });

  // Sunucudan düşerse veya kick yerse otomatik tekrar girer
  bot.on('end', () => {
    console.log('Bot sunucudan düştü. 10 saniye sonra tekrar bağlanıyor...');
    setTimeout(startBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('Hata oluştu:', err.message);
  });
}

startBot();
