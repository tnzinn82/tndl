const downloadBtn = document.getElementById('downloadBtn');
const videoUrlInput = document.getElementById('videoUrl');
const statusEl = document.getElementById('status');

downloadBtn.addEventListener('click', () => {
  const url = videoUrlInput.value.trim();
  if (!url) {
    statusEl.textContent = 'Por favor, cole um link válido!';
    return;
  }

  statusEl.textContent = 'Processando... aguarde.';

  fetch('/download', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ url })
  })
  .then(async res => {
    if (!res.ok) throw new Error('Erro ao iniciar download');
    
    // pegar nome do arquivo do header
    const contentDisposition = res.headers.get('Content-Disposition');
    let filename = 'video.mp4';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match) filename = match[1];
    }
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    statusEl.textContent = 'Download iniciado!';
  })
  .catch(err => {
    statusEl.textContent = 'Erro: ' + err.message;
  });
});