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

// SUNUCU BİLGİLERİ
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
    
    // Sürekli eğili tutma (Hep sneak modunda kalır)
    bot.setControlState('sneak', true);

    // Anti-AFK: Sunucunun 'hareketsiz duruyor' diye kick atmaması için 15 sn'de bir hafifçe bakış açısını değiştirir
    setInterval(() => {
      bot.look(bot.entity.yaw + 0.1, bot.entity.pitch, true);
    }, 15000);
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
