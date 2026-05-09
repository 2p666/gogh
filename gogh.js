document.addEventListener("DOMContentLoaded", () => {
    // 1. DATA OFICIAL (01/06/2025)
    const dataInicio = new Date(2025, 6, 1, 0, 0, 0); // Junho é mês 5 (Janeiro é 0)
    
    // 2. CURSOR PADRÃO (Girassol removido conforme solicitado)
    // O cursor agora seguirá o estilo definido no seu CSS padrão.

    // 3. LÓGICA DO CONTADOR
    setInterval(() => {
        const diff = new Date() - dataInicio;
        if(diff < 0) return;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff / 3600000) % 24).toString().padStart(2, '0');
        const m = Math.floor((diff / 60000) % 60).toString().padStart(2, '0');
        const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
        const ms = Math.floor(diff % 1000).toString().padStart(3, '0');
        const el = document.getElementById("contador");
        if(el) el.innerHTML = `${d}d ${h}:${m}:${s}<small style="font-size:16px; opacity:0.7">.${ms}</small>`;
    }, 10);

    // 4. PORTA SECRETA COM FADE-OUT
    const secretDoor = document.getElementById('secretDoor');
    if (secretDoor) {
        let clicks = 0;
        secretDoor.addEventListener('click', () => {
            clicks++;
            if (clicks === 3) {
                document.body.classList.add('fade-out');
                setTimeout(() => { window.location.href = "Segredo.html"; }, 1500);
            }
            setTimeout(() => { clicks = 0; }, 2000);
        });
    }

    // 5. SISTEMA DE ESTRELAS E CARTAS NO TÍTULO
    const canvas = document.getElementById('starCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let moveStars = [], bgStars = [], trailStars = [];
        const duration = 25000;
        const startTime = Date.now();
        
        const frasesLetras = {
            "E": "É de Estrela, que é como você brilha.",
            "U": "Um ano de muitos que virão.",
            "T": "Todo meu amor é seu.",
            "A": "Além do horizonte, eu te encontro.",
            "M": "Melissa, minha obra-prima.",
            "O": "Onde você estiver, meu coração está."
        };

        const resize = () => { 
            canvas.width = window.innerWidth; 
            canvas.height = window.innerHeight; 
            initStars(); 
        };
        
        window.addEventListener('resize', resize);

        // Rastro de estrelas ao mexer o mouse (opcional, mantive por ser estético)
        window.addEventListener('mousemove', (e) => {
            for(let i=0; i<2; i++) {
                trailStars.push({ 
                    x: e.clientX, 
                    y: e.clientY, 
                    vx: (Math.random()-0.5)*2, 
                    vy: (Math.random()-0.5)*2, 
                    size: Math.random()*2, 
                    opacity: 1 
                });
            }
        });

        function initStars() {
            moveStars = []; bgStars = [];
            for(let i = 0; i < 200; i++) {
                bgStars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.5, opacity: Math.random(), speed: 0.005 + Math.random() * 0.015 });
            }
            const fontSize = Math.min(canvas.width / 10, 120);
            ctx.font = `bold ${fontSize}px Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillText("EU TE AMO", canvas.width / 2, fontSize * 1.5);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            for (let y = 0; y < canvas.height; y += 4) {
                for (let x = 0; x < canvas.width; x += 4) {
                    const index = (y * canvas.width + x) * 4;
                    if (imageData[index + 3] > 128) {
                        moveStars.push({ startX: Math.random()*canvas.width, startY: Math.random()*canvas.height, destX: x, destY: y, size: Math.random()*2, opacity: Math.random(), speed: 0.01+Math.random()*0.03, currentX: 0, currentY: 0 });
                        moveStars[moveStars.length-1].currentX = moveStars[moveStars.length-1].startX;
                        moveStars[moveStars.length-1].currentY = moveStars[moveStars.length-1].startY;
                    }
                }
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const elapsed = Date.now() - startTime;
            let progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            ctx.fillStyle = "#f1c40f";

            bgStars.forEach(s => {
                s.opacity += s.speed; if(s.opacity > 1 || s.opacity < 0.2) s.speed *= -1;
                ctx.globalAlpha = s.opacity; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
            });

            moveStars.forEach(s => {
                const curX = s.startX + (s.destX - s.startX) * ease;
                const curY = s.startY + (s.destY - s.startY) * ease;
                s.opacity += s.speed; if(s.opacity > 1 || s.opacity < 0.2) s.speed *= -1;
                ctx.globalAlpha = s.opacity; ctx.beginPath(); ctx.arc(curX, curY, s.size, 0, Math.PI * 2); ctx.fill();
            });

            trailStars.forEach((s, i) => {
                s.x += s.vx; s.y += s.vy; s.opacity -= 0.02;
                if(s.opacity <= 0) trailStars.splice(i, 1);
                else { ctx.globalAlpha = s.opacity; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill(); }
            });
            requestAnimationFrame(drawStars);
        }

        // CORREÇÃO DO CLIQUE: Listener unificado para Desktop e Mobile
        const handleSecretClick = (e) => {
            const clickY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            
            // Área de clique: topo da tela até 400px (onde fica o texto de estrelas)
            if(clickY < 400) {
                // Remove modais antigos para não acumular
                const oldModal = document.querySelector('.modal-carta');
                if(oldModal) oldModal.remove();

                const modal = document.createElement('div');
                modal.className = 'modal-carta';
                const letras = Object.keys(frasesLetras);
                const letra = letras[Math.floor(Math.random() * letras.length)];
                
                modal.innerHTML = `<h3>${letra}</h3><p>${frasesLetras[letra]}</p>`;
                document.body.appendChild(modal);
                
                setTimeout(() => modal.classList.add('active'), 10);
                setTimeout(() => { 
                    modal.classList.remove('active'); 
                    setTimeout(() => modal.remove(), 500); 
                }, 4000);
            }
        };

        canvas.addEventListener('click', handleSecretClick);
        resize(); 
        drawStars();
    }

    // 6. CÁPSULA DO TEMPO
    window.enviarCapsula = function(btn) {
        const input = btn.previousElementSibling;
        if(input.value.trim() === "") return;
        const rect = btn.getBoundingClientRect();
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'star-particle';
            p.style.left = rect.left + 'px'; p.style.top = rect.top + 'px';
            p.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
            p.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1500);
        }
        btn.parentElement.innerHTML = "<p style='color:var(--gogh-yellow);'>Mensagem guardada para 2026... ✨</p>";
    };

    // 7. REVELAÇÃO E DIGITAÇÃO
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                const p = entry.target.querySelector('.digitar');
                if(p && !p.dataset.feito) {
                    p.dataset.feito = "true";
                    let text = p.innerText; p.innerText = "";
                    let i = 0;
                    let timer = setInterval(() => { if(i < text.length) { p.innerText += text[i]; i++; } else clearInterval(timer); }, 40);
                }
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.text-platform').forEach(tp => observer.observe(tp));

    // 8. MÚSICA
    const playBtn = document.getElementById("playBtn");
    const musica = document.getElementById("musica");
    if (playBtn && musica) {
        playBtn.onclick = () => { if(musica.paused) { musica.play(); playBtn.innerHTML = "♫"; } else { musica.pause(); playBtn.innerHTML = "✧"; } };
    }
});

// FUNÇÕES DE OVERLAY
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
function fecharMidia() { document.getElementById('overlay').style.display = "none"; document.getElementById('overlayContent').innerHTML = ""; }

const fsBtn = document.getElementById('fullscreenBtn');

fsBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Erro ao tentar ativar tela cheia: ${err.message}`);
        });
        fsBtn.innerHTML = "✖"; // Muda o ícone ao entrar
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fsBtn.innerHTML = "⛶"; // Volta o ícone ao sair
        }
    }
});