const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/download', (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).send('URL não fornecida');

  const tempDir = os.tmpdir();
  const outputFile = path.join(tempDir, `video_${Date.now()}.mp4`);

  // Comando para baixar vídeo com yt-dlp
  // --no-playlist para garantir só 1 vídeo
  execFile('yt-dlp', ['-f', 'mp4', '-o', outputFile, '--no-playlist', url], (error) => {
    if (error) {
      console.error('Erro no yt-dlp:', error);
      return res.status(500).send('Erro ao baixar vídeo');
    }

    // Enviar arquivo para o cliente
    res.download(outputFile, 'video.mp4', (err) => {
      if (err) console.error('Erro ao enviar arquivo:', err);
      // Apagar arquivo temporário depois de enviar
      fs.unlink(outputFile, () => {});
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});