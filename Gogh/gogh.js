document.addEventListener("DOMContentLoaded", () => {
    // 1. DATA DE INÍCIO DO CONTADOR
    const dataInicio = new Date(2025, 6, 1, 0, 0, 0); 
    
    // 2. LÓGICA DO CONTADOR
    setInterval(() => {
        const diff = new Date() - dataInicio;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff / 3600000) % 24).toString().padStart(2, '0');
        const m = Math.floor((diff / 60000) % 60).toString().padStart(2, '0');
        const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
        const ms = Math.floor(diff % 1000).toString().padStart(3, '0');
        const contadorElement = document.getElementById("contador");
        if(contadorElement) {
            contadorElement.innerHTML = `${d}d ${h}:${m}:${s}<small style="font-size:16px; opacity:0.7">.${ms}</small>`;
        }
    }, 10);

    // 3. LÓGICA DO BOTÃO SEGREDO
    const secretDoor = document.getElementById('secretDoor');
    function openSecretPage() { window.location.href = "Segredo.html"; }

    if (secretDoor) {
        let clicks = 0;
        secretDoor.addEventListener('click', () => {
            clicks++;
            if (clicks === 3) openSecretPage();
            setTimeout(() => { clicks = 0; }, 2000);
        });
        let pressTimer;
        const startPress = () => { pressTimer = setTimeout(openSecretPage, 5000); };
        const endPress = () => { clearTimeout(pressTimer); };
        secretDoor.addEventListener('mousedown', startPress);
        secretDoor.addEventListener('mouseup', endPress);
        secretDoor.addEventListener('touchstart', (e) => { e.preventDefault(); startPress(); });
        secretDoor.addEventListener('touchend', endPress);
    }

    // 4. SISTEMA DE ESTRELAS (MISTO + RASTRO + MENSAGENS)
    const canvas = document.getElementById('starCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let moveStars = [];
        let bgStars = [];
        let trailStars = []; // Rastro do mouse
        const duration = 30000; 
        const startTime = Date.now();
        
        const mensagens = ["Amo você!", "Minha estrela", "Para sempre", "Melissa & Eu", "Minha obra-prima", "Vida minha", "✧", "Amor eterno"];

        const resize = () => { 
            canvas.width = window.innerWidth; 
            canvas.height = window.innerHeight; 
            initStars(); 
        };
        
        window.addEventListener('resize', resize);

        // Rastro do Mouse
        window.addEventListener('mousemove', (e) => {
            for(let i=0; i<2; i++) {
                trailStars.push({
                    x: e.clientX, y: e.clientY,
                    vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2,
                    size: Math.random()*3, opacity: 1
                });
            }
        });

        // Clique para Mensagens
        canvas.addEventListener('click', (e) => {
            const msg = document.createElement('div');
            msg.className = 'star-message';
            msg.innerText = mensagens[Math.floor(Math.random() * mensagens.length)];
            msg.style.left = e.clientX + 'px';
            msg.style.top = e.clientY + 'px';
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 2000);
        });

        function initStars() {
            moveStars = []; bgStars = [];
            for(let i = 0; i < 150; i++) {
                bgStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.8,
                    opacity: Math.random(),
                    speed: 0.005 + Math.random() * 0.01
                });
            }
            const text = "EU TE AMO";
            const fontSize = Math.min(canvas.width / 9, 100); 
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const posY = fontSize * 1.5; 
            ctx.fillText(text, canvas.width / 2, posY);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            for (let y = 0; y < canvas.height; y += 4) {
                for (let x = 0; x < canvas.width; x += 4) {
                    const index = (y * canvas.width + x) * 4;
                    if (imageData[index + 3] > 128) {
                        moveStars.push({
                            startX: Math.random() * canvas.width,
                            startY: Math.random() * canvas.height,
                            destX: x + (Math.random() * 2), destY: y + (Math.random() * 2),
                            size: Math.random() * 2.2, opacity: Math.random(),
                            speed: 0.01 + Math.random() * 0.02
                        });
                        const s = moveStars[moveStars.length - 1];
                        s.currentX = s.startX; s.currentY = s.startY;
                    }
                }
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const elapsed = Date.now() - startTime;
            let progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            ctx.fillStyle = "#f1c40f";

            bgStars.forEach(s => {
                s.opacity += s.speed;
                if(s.opacity > 1 || s.opacity < 0.2) s.speed *= -1;
                ctx.globalAlpha = s.opacity;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
            });

            moveStars.forEach(s => {
                const curX = s.startX + (s.destX - s.startX) * ease;
                const curY = s.startY + (s.destY - s.startY) * ease;
                s.opacity += s.speed;
                if(s.opacity > 1 || s.opacity < 0.3) s.speed *= -1;
                ctx.globalAlpha = s.opacity;
                ctx.beginPath(); ctx.arc(curX, curY, s.size, 0, Math.PI * 2); ctx.fill();
            });

            trailStars.forEach((s, i) => {
                s.x += s.vx; s.y += s.vy; s.opacity -= 0.02;
                if(s.opacity <= 0) trailStars.splice(i, 1);
                else {
                    ctx.globalAlpha = s.opacity;
                    ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
                }
            });
            requestAnimationFrame(drawStars);
        }
        resize(); drawStars();
    }

    // 5. EFEITO DE DIGITAÇÃO (PARALLAX REMOVIDO PARA FIXAR O FUNDO)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const paragraphs = entry.target.querySelectorAll('.digitar');
                paragraphs.forEach((p, index) => {
                    if(!p.classList.contains('feito')) {
                        setTimeout(() => {
                            p.classList.add('feito');
                            let fullText = p.innerText; p.innerText = "";
                            let charIndex = 0;
                            let timer = setInterval(() => {
                                if(charIndex < fullText.length) { 
                                    p.innerText += fullText[charIndex]; charIndex++; 
                                } else clearInterval(timer);
                            }, 35);
                        }, index * 1200); 
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.art-section').forEach(s => observer.observe(s));

    // 6. CONTROLE DA MÚSICA
    const playBtn = document.getElementById("playBtn");
    const musica = document.getElementById("musica");
    if (playBtn && musica) {
        playBtn.onclick = () => {
            if(musica.paused) { musica.play(); playBtn.innerHTML = "♫"; }
            else { musica.pause(); playBtn.innerHTML = "✧"; }
        };
    }
});

// 7. FUNÇÕES DE OVERLAY
function ampliarMidia(el) {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('overlayContent');
    const media = el.querySelector('img:not(.frame-custom-img), video');
    if (media) {
        const clone = media.cloneNode(true);
        content.innerHTML = "";
        if(clone.tagName === "VIDEO") { clone.controls = true; clone.play(); }
        content.appendChild(clone);
        overlay.style.display = "flex";
    }
}
function fecharMidia() { 
    document.getElementById('overlay').style.display = "none"; 
    document.getElementById('overlayContent').innerHTML = ""; 
}