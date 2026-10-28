/* ==========================================================================
   SARDOR & MADINA — VISOL OQSHOMI TAKLIFNOMASI
   Interactive JavaScript (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. CONFIGURATION & TARGET DATE ---
  // To'y sanasi: 2026-yil 25-Iyun, 18:00
  const WEDDING_DATE = new Date('2026-06-25T18:00:00');
  
  // DOM Elements
  const envelopeModal = document.getElementById('envelopeModal');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSeal = document.getElementById('waxSeal');
  const openButton = document.getElementById('openButton');
  const reopenEnvelopeBtn = document.getElementById('reopenEnvelopeBtn');
  const musicToggle = document.getElementById('musicToggle');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccessMsg = document.getElementById('rsvpSuccessMsg');
  const wishesWall = document.getElementById('wishesWall');
  const toast = document.getElementById('toast');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const copyAddressText = document.getElementById('copyAddressText');
  const telegramShareBtn = document.getElementById('telegramShareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const copyLinkText = document.getElementById('copyLinkText');

  // Attendance radio cards toggle styling
  const radioCards = document.querySelectorAll('.radio-card');
  radioCards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    radio.addEventListener('change', () => {
      radioCards.forEach(c => c.classList.remove('selected'));
      if (radio.checked) {
        card.classList.add('selected');
      }
    });
  });

  // --- 2. ENVELOPE OPENING INTERACTION ---
  let isEnvelopeOpened = false;

  function openEnvelope() {
    if (isEnvelopeOpened && !envelopeModal.classList.contains('active')) return;
    
    envelopeWrapper.classList.add('open');
    playGentleChime(); // Gentle sound effect on open
    startBackgroundMusic(); // Start ambient melody

    setTimeout(() => {
      envelopeModal.classList.remove('active');
      isEnvelopeOpened = true;
      showToast('Xush kelibsiz! Taklifnomamizga marhamat.');
    }, 1200);
  }

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (openButton) openButton.addEventListener('click', openEnvelope);

  // Allow clicking the envelope itself to open
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', (e) => {
      if (!envelopeWrapper.classList.contains('open')) {
        openEnvelope();
      }
    });
  }

  // Re-open envelope button
  if (reopenEnvelopeBtn) {
    reopenEnvelopeBtn.addEventListener('click', () => {
      envelopeModal.classList.add('active');
      envelopeWrapper.classList.remove('open');
      isEnvelopeOpened = false;
    });
  }

  // --- 3. AMBIENT MUSIC SYNTHESIZER (Web Audio API) ---
  // Hech qanday tashqi havola talab qilmaydi, 100% oflayn va mustaqil ishlaydi
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft acoustic chord note
  function playNote(freq, startTime, duration = 1.8) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // Soft warm sine + triangle blend
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth attack & long romantic decay
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.08, startTime + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn('Audio note error:', e);
    }
  }

  function playGentleChime() {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const chimeNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chimeNotes.forEach((f, idx) => {
      playNote(f, now + idx * 0.12, 1.5);
    });
  }

  // Romantic gentle loop (Cmaj9 - Am9 - Fmaj7 - Gsus4)
  const melodyChords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 261.63, 329.63, 349.23], // Fmaj7
    [196.00, 293.66, 392.00, 440.00]  // Gsus4
  ];

  let chordIndex = 0;

  function scheduleMelody() {
    if (!isMusicPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const chord = melodyChords[chordIndex % melodyChords.length];

    chord.forEach((freq, i) => {
      playNote(freq, now + i * 0.28, 2.8);
      // Subtle higher bell harmonic
      if (i === 3) {
        playNote(freq * 1.5, now + 1.2, 2.0);
      }
    });

    chordIndex++;
  }

  function startBackgroundMusic() {
    initAudioContext();
    if (isMusicPlaying) return;
    isMusicPlaying = true;
    musicToggle.classList.add('playing');
    scheduleMelody();
    musicInterval = setInterval(scheduleMelody, 3200);
  }

  function stopBackgroundMusic() {
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isMusicPlaying) {
        stopBackgroundMusic();
        showToast("Musiqa to'xtatildi");
      } else {
        startBackgroundMusic();
        showToast('Musiqa yangramoqda ♪');
      }
    });
  }

  // --- 4. LIVE COUNTDOWN TIMER ---
  function updateCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- 5. FLOATING GOLDEN SPARKLES & PETALS CANVAS ---
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = window.innerWidth < 680 ? 25 : 45;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : -20;
        this.type = Math.random() > 0.65 ? 'petal' : 'sparkle';
        this.size = this.type === 'petal' ? Math.random() * 8 + 6 : Math.random() * 3 + 1;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = Math.sin(Math.random() * 2) * 0.5;
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 1.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.6;
        this.angle += this.spin;

        if (this.y > canvas.height + 25 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;

        if (this.type === 'petal') {
          // Romantic rose petal / leaf shape
          ctx.fillStyle = '#d4af37';
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.quadraticCurveTo(this.size * 0.8, -this.size * 0.3, this.size * 0.4, this.size);
          ctx.quadraticCurveTo(0, this.size * 0.8, -this.size * 0.4, this.size);
          ctx.quadraticCurveTo(-this.size * 0.8, -this.size * 0.3, 0, -this.size);
          ctx.closePath();
          ctx.fill();
        } else {
          // Golden sparkle light
          ctx.fillStyle = '#fce588';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#d4af37';
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --- 6. DRESS CODE INTERACTION ---
  const colorCircles = document.querySelectorAll('.color-circle');
  colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      const color = circle.getAttribute('data-color') || 'Ushbu rang';
      showToast(`Tanlangan rang: ${color}`);
    });
  });

  // --- 7. ADD TO CALENDAR (.ICS FILE GENERATION) ---
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Sardor va Madina//Visol Oqshomi//UZ',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'SUMMARY:Sardor & Madina — Visol Oqshomi To\'yi',
        'DESCRIPTION:Sardor va Madinaning nikoh to\'yi tantanasi.',
        'LOCATION:Versal Grand Hall, Bunyodkor shox ko\'chasi 45, Toshkent',
        'DTSTART:20260625T130000Z', // 18:00 Tashkent time (UTC+5)
        'DTEND:20260625T180000Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'sardor-madina-toy-oqshomi.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Taqvim fayli (.ics) yuklab olindi!');
    });
  }

  // --- 8. COPY ADDRESS BUTTON ---
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = "Toshkent shahri, Chilonzor tumani, Bunyodkor shox ko'chasi, 45-uy. 'Versal Grand Hall'";
      navigator.clipboard.writeText(address).then(() => {
        if (copyAddressText) copyAddressText.textContent = 'Nusxalandi! ✓';
        showToast('To\'yxona manzili nusxalandi');
        setTimeout(() => {
          if (copyAddressText) copyAddressText.textContent = 'Manzilni nusxalash';
        }, 2500);
      }).catch(() => {
        showToast('Manzil: ' + address);
      });
    });
  }

  // --- 9. RSVP & GUESTBOOK WISHES ---
  const STORAGE_KEY = 'wedding_wishes_sardor_madina';

  // Initial demo wishes for a rich portfolio feel
  const defaultWishes = [
    {
      name: "Akmal va Feruza",
      count: "2 kishi",
      attendance: "yes",
      wish: "Qo'sha qaringlar! Ilohim bir umr qo'llaringiz bir-biringizdan uzilmasin, oilangizdan fayz va baxt arimasin!",
      date: "Kecha"
    },
    {
      name: "Jasur Rahmonov",
      count: "1 kishi",
      attendance: "yes",
      wish: "Dostim Sardor, uylanish muborak bo'lsin! Madina bilan eng baxtli juftliklardan biri bo'linglar!",
      date: "2 kun oldin"
    },
    {
      name: "Dilshodbek va Nilufar",
      count: "Oila a'zolari",
      attendance: "yes",
      wish: "Xonadoningizga doimo to'ylar yarashsin. Dunyodagi eng go'zal va totuv oila bo'lishingizni tilaymiz!",
      date: "3 kun oldin"
    }
  ];

  function getStoredWishes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : defaultWishes;
    } catch (e) {
      return defaultWishes;
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function renderWishes() {
    if (!wishesWall) return;
    const wishes = getStoredWishes();
    wishesWall.innerHTML = '';

    wishes.forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-card';

      const tagText = item.attendance === 'yes' ? '💐 Qatnashadi' : '🕊️ Uzrli';

      card.innerHTML = `
        <div>
          <div class="wish-header">
            <span class="wish-author">${escapeHtml(item.name)}</span>
            <span class="wish-tag">${tagText}</span>
          </div>
          <p class="wish-text">"${escapeHtml(item.wish || 'Baxt va omad tilaymiz!')}"</p>
        </div>
        <div class="wish-footer">
          <span>${escapeHtml(item.count || 'Mehmon')}</span>
          <span>${item.date || 'Hozirgina'}</span>
        </div>
      `;
      wishesWall.appendChild(card);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderWishes();

  // Handle RSVP Submit
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guestName').value.trim();
      const phone = document.getElementById('guestPhone').value.trim();
      const countEl = document.getElementById('guestCount');
      const count = countEl.options[countEl.selectedIndex].text;
      const attendance = rsvpForm.elements['attendance'].value;
      const wish = document.getElementById('guestWish').value.trim();

      if (!name) {
        showToast('Iltimos, ismingizni kiriting!');
        return;
      }

      const newWish = {
        name: name,
        phone: phone,
        count: count,
        attendance: attendance,
        wish: wish || "Sizga baxt va saodat tilaymiz!",
        date: "Hozirgina"
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();

      // Show animated alert
      if (rsvpSuccessMsg) {
        rsvpSuccessMsg.classList.remove('hidden');
      }

      // Play soft celebration chime
      playGentleChime();
      showToast('Tashakkur! Javobingiz qabul qilindi.');

      // Reset form fields
      rsvpForm.reset();
      radioCards.forEach(c => c.classList.remove('selected'));
      radioCards[0].classList.add('selected');

      // Scroll smoothly to wishes
      setTimeout(() => {
        wishesWall.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);
    });
  }

  // --- 10. SOCIAL SHARING & COPY LINK ---
  const pageUrl = window.location.href;
  const shareText = "Sardor & Madina — Visol Oqshomi To'y Taklifnomasi! Sizni lutfan taklif etamiz:";

  if (telegramShareBtn) {
    telegramShareBtn.addEventListener('click', () => {
      const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(tgUrl, '_blank');
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(pageUrl).then(() => {
        if (copyLinkText) copyLinkText.textContent = 'Nusxalandi! ✓';
        showToast('Taklifnoma havolasi nusxalandi');
        setTimeout(() => {
          if (copyLinkText) copyLinkText.textContent = 'Havolani nusxalash';
        }, 2500);
      }).catch(() => {
        showToast('Havola: ' + pageUrl);
      });
    });
  }

  // --- 11. TOAST HELPER ---
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

});
