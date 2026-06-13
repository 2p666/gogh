document.addEventListener('DOMContentLoaded', () => {
  const dataInicio = new Date(2025, 6, 1, 0, 0, 0);
  const deviceChoice = document.getElementById('deviceChoice');
  const mainSite = document.getElementById('mainSite');

  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.add(btn.dataset.mode === 'mobile' ? 'mobile' : 'pc');
      deviceChoice.classList.add('hidden');
      mainSite.classList.remove('hidden');
      createHeartStorm(55);
    });
  });

  setInterval(() => {
    const diff = new Date() - dataInicio;
    if (diff < 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24).toString().padStart(2, '0');
    const m = Math.floor((diff / 60000) % 60).toString().padStart(2, '0');
    const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
    const el = document.getElementById('contador');
    if (el) el.innerHTML = `${d}d ${h}:${m}:${s}`;
  }, 1000);

  const secretDoor = document.getElementById('secretDoor');
  if (secretDoor) {
    let clicks = 0;
    secretDoor.addEventListener('click', () => {
      clicks++;
      createHeartStorm(18);
      if (clicks === 3) {
        document.body.classList.add('fade-out');
        setTimeout(() => { window.location.href = 'Segredo.html'; }, 1200);
      }
      setTimeout(() => { clicks = 0; }, 2000);
    });
  }

  const canvas = document.getElementById('starCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let moveStars = [], bgStars = [], trailStars = [];
    let startTime = Date.now();
    const duration = 18000;
    const frasesLetras = {
      E: 'É de estrela: a forma como você ilumina meus dias.',
      U: 'Um universo inteiro parece menor quando penso em nós.',
      T: 'Todo meu carinho encontra caminho até você.',
      A: 'Amar você virou uma das minhas formas de continuar.',
      M: 'Melissa, minha obra-prima favorita.',
      O: 'Onde você estiver, meu coração reconhece casa.'
    };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      moveStars = [];
      bgStars = [];
      for (let i = 0; i < 180; i++) {
        bgStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.6 + .3,
          opacity: Math.random(),
          speed: .005 + Math.random() * .015
        });
      }

      const fontSize = Math.min(canvas.width / 8.8, 116);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText('EU TE AMO', canvas.width / 2, Math.max(120, fontSize * 1.35));
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      for (let y = 0; y < Math.min(canvas.height, 310); y += 5) {
        for (let x = 0; x < canvas.width; x += 5) {
          const idx = (y * canvas.width + x) * 4;
          if (data[idx + 3] > 128) {
            moveStars.push({
              startX: Math.random() * canvas.width,
              startY: Math.random() * canvas.height,
              destX: x,
              destY: y,
              size: Math.random() * 2 + .4,
              opacity: Math.random(),
              speed: .01 + Math.random() * .025
            });
          }
        }
      }
      startTime = Date.now();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
      for (let i = 0; i < 2; i++) {
        trailStars.push({ x: e.clientX, y: e.clientY, vx: (Math.random()-.5)*2, vy: (Math.random()-.5)*2, size: Math.random()*2, opacity: 1 });
      }
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      bgStars.forEach(s => {
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < .18) s.speed *= -1;
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = '#ffc3dd';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff7abf';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill();
      });

      moveStars.forEach(s => {
        const x = s.startX + (s.destX - s.startX) * ease;
        const y = s.startY + (s.destY - s.startY) * ease;
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < .25) s.speed *= -1;
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = '#ff9ccc';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff7abf';
        ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI*2); ctx.fill();
      });

      trailStars.forEach((s, i) => {
        s.x += s.vx; s.y += s.vy; s.opacity -= .02;
        if (s.opacity <= 0) trailStars.splice(i, 1);
        else { ctx.globalAlpha = s.opacity; ctx.fillStyle = '#ffd9ea'; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill(); }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    function handleSecretClick(e) {
      const y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      if (y > 390) return;
      const old = document.querySelector('.modal-carta');
      if (old) old.remove();
      const letras = Object.keys(frasesLetras);
      const letra = letras[Math.floor(Math.random() * letras.length)];
      const modal = document.createElement('div');
      modal.className = 'modal-carta';
      modal.innerHTML = `<h3>${letra}</h3><p>${frasesLetras[letra]}</p>`;
      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
      setTimeout(() => { modal.classList.remove('active'); setTimeout(() => modal.remove(), 500); }, 4300);
    }

    canvas.addEventListener('click', handleSecretClick);
    canvas.addEventListener('touchstart', handleSecretClick);
    resize(); draw();
  }

  window.enviarCapsula = function(btn) {
    const input = btn.previousElementSibling;
    if (!input.value.trim()) return;
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 45; i++) {
      const p = document.createElement('div');
      p.className = 'star-particle';
      p.style.left = rect.left + rect.width/2 + 'px';
      p.style.top = rect.top + rect.height/2 + 'px';
      p.style.setProperty('--tx', (Math.random()-.5)*330 + 'px');
      p.style.setProperty('--ty', (Math.random()-.5)*330 + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
    btn.parentElement.innerHTML = `<p style="color:var(--rose-soft);text-align:center;">Mensagem guardada no céu do nosso Dia dos Namorados. ♡</p>`;
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        const p = entry.target.querySelector('.digitar:not(.done)');
        if (p && !p.dataset.feito) {
          p.dataset.feito = 'true';
          const text = p.innerText;
          p.innerText = '';
          let i = 0;
          const timer = setInterval(() => {
            if (i < text.length) p.innerText += text[i++];
            else clearInterval(timer);
          }, 28);
        }
      }
    });
  }, { threshold: .2 });
  document.querySelectorAll('.text-platform').forEach(tp => observer.observe(tp));

  const playBtn = document.getElementById('playBtn');
  const musica = document.getElementById('musica');
  if (playBtn && musica) {
    playBtn.onclick = () => {
      if (musica.paused) { musica.play(); playBtn.innerHTML = '♫'; }
      else { musica.pause(); playBtn.innerHTML = '♡'; }
    };
  }

  const fsBtn = document.getElementById('fullscreenBtn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        fsBtn.innerHTML = '✖';
      } else {
        document.exitFullscreen(); fsBtn.innerHTML = '⛶';
      }
    });
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) fsBtn.innerHTML = '⛶'; });
  }

  function createHeartStorm(count) {
    const layer = document.getElementById('heartLayer');
    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'float-heart';
      h.textContent = Math.random() > .5 ? '❤' : '♡';
      h.style.left = Math.random()*100 + 'vw';
      h.style.fontSize = (Math.random()*24 + 15) + 'px';
      h.style.animationDelay = Math.random()*1 + 's';
      layer.appendChild(h);
      setTimeout(() => h.remove(), 3600);
    }
  }
});

function ampliarMidia(el) {
  const overlay = document.getElementById('overlay');
  const content = document.getElementById('overlayContent');
  const media = el.querySelector('img:not(.frame-custom-img), video');
  if (!media) return;
  const clone = media.cloneNode(true);
  content.innerHTML = '';
  if (clone.tagName === 'VIDEO') { clone.controls = true; clone.muted = false; clone.play().catch(()=>{}); }
  content.appendChild(clone);
  overlay.style.display = 'flex';
}
function fecharMidia() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('overlayContent').innerHTML = '';
}
