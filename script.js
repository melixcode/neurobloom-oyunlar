/* ===========================
   NEUROBLOOM — script.js
   =========================== */

/* ── Background Particles ─────────────────────────────────── */
(function spawnParticles() {
  const container = document.getElementById('bgParticles');
  const colors = ['#7b2ff7','#f72585','#4cc9f0','#ffd166','#06d6a0','#b983ff'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 10 + Math.random() * 40;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${8 + Math.random()*18}s;
      animation-delay:${Math.random()*12}s;
    `;
    container.appendChild(p);
  }
})();

/* ── Screen Navigation ────────────────────────────────────── */
const screens = document.querySelectorAll('.screen');

function navigate(target) {
  const current = document.querySelector('.screen.active');
  const next    = document.getElementById('screen-' + target);
  if (!next || current === next) return;

  current.classList.add('out');
  current.classList.remove('active');

  setTimeout(() => current.classList.remove('out'), 420);

  requestAnimationFrame(() => {
    next.classList.add('active');
    next.scrollTop = 0;
  });

  // Reset exercise state when leaving exercises
  if (target !== 'exercises') {
    resetExercises();
  }
}

/* ── NeuroBot Message Rotator (Home) ─────────────────────── */
const homeMessages = [
  "Hello! I'm NeuroBot! Ready to learn and play? 🎉",
  "You're doing amazing! Keep going! 🌟",
  "Every word you practice makes you stronger! 💪",
  "Let's have fun and learn together! 🎈",
  "I believe in you! You can do it! 🚀",
  "Practice every day to become a speech star! ⭐",
];
let homeIdx = 0;
setInterval(() => {
  const bubble = document.getElementById('homeBubble');
  if (!bubble) return;
  homeIdx = (homeIdx + 1) % homeMessages.length;
  bubble.style.opacity = '0';
  bubble.style.transform = 'scale(0.9)';
  setTimeout(() => {
    bubble.textContent = homeMessages[homeIdx];
    bubble.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    bubble.style.opacity = '1';
    bubble.style.transform = 'scale(1)';
  }, 350);
}, 4500);

/* ── Eye Tracking (Home Bot) ─────────────────────────────── */
document.addEventListener('mousemove', (e) => {
  const pupils = document.querySelectorAll('.pupil');
  pupils.forEach(pupil => {
    const eye = pupil.parentElement;
    const rect = eye.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
    const dist  = Math.min(3.5, rect.width * 0.2);
    pupil.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`;
  });
});

/* ── Games ────────────────────────────────────────────────── */
const gameData = {
  balloon: {
    icon: '🎈',
    title: 'Balloon Game',
    body: `Pop colorful balloons by saying the correct word out loud!<br><br>
           🎯 <b>Goal:</b> Match your voice to pop matching balloons<br>
           🏆 <b>Reward:</b> Earn stars and unlock new balloon packs<br>
           🔊 <b>Skill:</b> Vowel sounds & clear pronunciation<br><br>
           <em>Coming Soon — stay tuned! 🚀</em>`
  },
  train: {
    icon: '🚂',
    title: 'Train Game',
    body: `Build word wagons and drive your speech train forward!<br><br>
           🎯 <b>Goal:</b> Connect syllables to form whole words<br>
           🏆 <b>Reward:</b> Unlock new train cars and routes<br>
           🔊 <b>Skill:</b> Syllable recognition & blending<br><br>
           <em>Coming Soon — stay tuned! 🚀</em>`
  },
  syllable: {
    icon: '🧩',
    title: 'Syllable Steps',
    body: `Hop across stepping stones by clapping syllables!<br><br>
           🎯 <b>Goal:</b> Count syllables to cross the river<br>
           🏆 <b>Reward:</b> Collect gems and unlock harder levels<br>
           🔊 <b>Skill:</b> Phonological awareness & rhythm<br><br>
           <em>Coming Soon — stay tuned! 🚀</em>`
  }
};

function showGameModal(gameKey) {
  const data = gameData[gameKey];
  document.getElementById('modalIcon').textContent  = data.icon;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalBody').innerHTML    = data.body;
  document.getElementById('gameModal').classList.add('open');
}

function closeModal() {
  document.getElementById('gameModal').classList.remove('open');
}

/* ── Exercise Tabs ────────────────────────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');

  // Start talking animation for lip tab
  if (tab === 'lip') {
    setTimeout(() => runMouthAnim('open'), 300);
  } else {
    stopMouthAnim();
  }
}

/* ── Speech Exercise Selection ────────────────────────────── */
const exerciseMessages = [
  "Let's do this! 🎤",
  "Great choice! Try your best! ⭐",
  "I'll guide you! Ready? 🤖",
  "You've got this! Speak clearly! 💫",
];

function startExercise(card, message) {
  // Remove previous active
  document.querySelectorAll('.exercise-card').forEach(c => c.classList.remove('active-ex'));
  card.classList.add('active-ex');

  // Update bot message
  const msgEl = document.getElementById('exerciseMessage');
  msgEl.style.opacity = '0';
  setTimeout(() => {
    msgEl.textContent = message;
    msgEl.style.opacity = '1';
    msgEl.style.transition = 'opacity 0.3s ease';
  }, 200);

  // Bounce the mini bot
  const bot = document.querySelector('#screen-exercises .bot-mini');
  bot.style.animation = 'none';
  bot.offsetHeight; // reflow
  bot.style.animation = 'botBob 3s ease-in-out infinite';
}

function resetExercises() {
  document.querySelectorAll('.exercise-card').forEach(c => c.classList.remove('active-ex'));
  const msgEl = document.getElementById('exerciseMessage');
  if (msgEl) msgEl.textContent = 'Great job! Practice makes perfect! 💪';
  stopMouthAnim();
}

/* ── Mouth / Lip Animations ───────────────────────────────── */
let mouthTimeout = null;
let talkInterval = null;

const mouthLabels = {
  open:   '😮 Open your mouth wide!',
  smile:  '😄 Show your biggest smile!',
  tongue: '👅 Stick out your tongue!',
  kiss:   '😗 Round your lips!',
};

function runMouthAnim(type) {
  const mouth = document.getElementById('mouthAnim');
  const label = document.getElementById('mouthLabel');
  const msg   = document.getElementById('exerciseMessage');

  // Clear previous
  clearTimeout(mouthTimeout);
  clearInterval(talkInterval);
  mouth.className = 'mouth-animated';

  const botMessages = {
    open:   'Open wide! Follow me! 😮',
    smile:  'Big smile! Show your teeth! 😄',
    tongue:'Tongue out! Wiggle it! 👅',
    kiss:   'Round lips! Like blowing a kiss! 😗',
  };

  if (msg) {
    msg.style.opacity = '0';
    setTimeout(() => {
      msg.textContent = botMessages[type];
      msg.style.opacity = '1';
    }, 200);
  }

  label.textContent = mouthLabels[type];

  // Apply animation class after brief pause for transition feel
  requestAnimationFrame(() => {
    mouth.classList.add('anim-' + type);
  });

  // Auto talking sequence after 1.5s
  mouthTimeout = setTimeout(() => {
    mouth.className = 'mouth-animated';
    requestAnimationFrame(() => {
      mouth.classList.add('anim-talking');
      if (label) label.textContent = '🎤 Now you try!';
    });
    // Reset after 3s of talking
    mouthTimeout = setTimeout(() => {
      mouth.className = 'mouth-animated';
      label.textContent = 'Follow Me! 👇';
    }, 3000);
  }, 2000);
}

function stopMouthAnim() {
  clearTimeout(mouthTimeout);
  clearInterval(talkInterval);
  const mouth = document.getElementById('mouthAnim');
  if (mouth) mouth.className = 'mouth-animated';
  const label = document.getElementById('mouthLabel');
  if (label) label.textContent = 'Follow Me! 👇';
}

/* ── Mood Analysis ────────────────────────────────────────── */
const moodResponses = {
  happy: {
    msg:   "That's wonderful! Your smile makes the whole world brighter! Keep shining! ☀️🌟",
    stars: '⭐⭐⭐⭐⭐',
    color: '#ffd166',
  },
  okay: {
    msg:   "That's perfectly fine! Every day is a new adventure. Let's make it a great one together! 🌈",
    stars: '⭐⭐⭐',
    color: '#4cc9f0',
  },
  sad: {
    msg:   "I'm sorry you're feeling sad 💙 It's okay to feel this way. I'm right here with you. Want to play a game to cheer up?",
    stars: '💜💜💜',
    color: '#7b2ff7',
  },
  angry: {
    msg:   "I hear you! It's okay to feel upset sometimes. Take a big deep breath with me... in... and out... You're safe here! 🌬️💙",
    stars: '💙💙💙',
    color: '#4361ee',
  },
};

function selectMood(mood) {
  // Highlight selected button
  document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
  event.currentTarget.classList.add('selected');

  const data   = moodResponses[mood];
  const card   = document.getElementById('moodCard');
  const resp   = document.getElementById('moodResponse');
  const stars  = document.getElementById('moodStars');
  const botMsg = document.getElementById('moodMessage');
  const mouth  = document.querySelector('#screen-mood .bot-mouth');

  // Update bot message
  botMsg.style.opacity = '0';
  setTimeout(() => {
    botMsg.textContent = data.msg;
    botMsg.style.opacity = '1';
    botMsg.style.transition = 'opacity 0.35s ease';
  }, 200);

  // Change bot mouth for sad/angry
  if (mouth) {
    mouth.style.borderRadius = (mood === 'sad' || mood === 'angry')
      ? '0 0 0 0 / 0 0 0 0' : '';
    mouth.style.borderTop = (mood === 'sad' || mood === 'angry')
      ? '3px solid rgba(255,255,255,0.9)' : 'none';
    mouth.style.borderBottom = (mood === 'sad' || mood === 'angry')
      ? 'none' : '3px solid rgba(255,255,255,0.9)';
    if (mood === 'sad' || mood === 'angry') {
      mouth.style.borderRadius = '20px 20px 0 0';
    } else {
      mouth.style.borderRadius = '0 0 20px 20px';
    }
  }

  // Show response card
  card.style.display = 'none';
  card.offsetHeight; // reflow
  card.style.display = 'block';
  resp.textContent   = data.msg;
  stars.textContent  = data.stars;
  card.style.borderColor = data.color + '88';
  card.style.background  = `linear-gradient(135deg, ${data.color}22, ${data.color}11)`;
}

/* ── Keyboard Shortcut: Escape closes modal ──────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ── Touch feedback for all buttons ─────────────────────── */
document.addEventListener('touchstart', (e) => {
  if (e.target.closest('button, .game-card, .exercise-card, .emoji-btn')) {
    e.target.closest('button, .game-card, .exercise-card, .emoji-btn')
      .style.opacity = '0.85';
  }
}, { passive: true });

document.addEventListener('touchend', (e) => {
  document.querySelectorAll('button, .game-card, .exercise-card, .emoji-btn')
    .forEach(el => el.style.opacity = '');
}, { passive: true });

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure home screen is active
  document.getElementById('screen-home').classList.add('active');

  // Stagger animate home elements in
  const homeContent = document.querySelector('.home-content');
  if (homeContent) {
    homeContent.style.opacity = '0';
    homeContent.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      homeContent.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      homeContent.style.opacity = '1';
      homeContent.style.transform = 'translateY(0)';
    });
  }
});
