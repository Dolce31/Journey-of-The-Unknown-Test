/* ==========================================================================
   AUDIO & LOGIC CONTROLLER
   ========================================================================== */
let bgm = null;
let btnAudio = null;
let isMusicStarted = false;
let isMuted = false;
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function playDialogueBeep() {
  if (isMuted) return;
  initAudioContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(460 + (Math.random() * 40), now);

    // ปรับระดับความดังขึ้นให้ชัดเจน (0.45) พร้อมจังหวะตัดเสียงที่คมชัด
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch (e) {}
}

function startAudioOnUserGesture() {
  initAudioContext();
  if (!isMusicStarted && bgm) {
    bgm.volume = 0.4;
    bgm.play().then(() => {
      isMusicStarted = true;
      if (btnAudio) btnAudio.innerText = '♫';
    }).catch(() => {});
  }
}

const stageOrder = ['prelude', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5'];

const gameData = {
  glossary: {
    easy: [
      { jp: "女神様 (めがみさま)", th: "ท่านเทพธิดา" },
      { jp: "冒険者 (ぼうけんしゃ)", th: "นักผจญภัย" },
      { jp: "ギルド", th: "กิลด์ / สมาคม" },
      { jp: "そうじ (掃除)", th: "การทำความสะอาด" },
      { jp: "やくそう (薬草)", th: "สมุนไพร" },
      { jp: "言葉が通じない (ことばがつうじない)", th: "คุยกันไม่รู้เรื่อง / สื่อสารไม่ได้" }
    ],
    hard: [
      { jp: "一体何事 (いったいなにごと)", th: "เกิดเรื่องอะไรขึ้นกันแน่" },
      { jp: "降臨 (こうりん)", th: "การลงมาจุติ" },
      { jp: "登録手続き (とうろくてつづき)", th: "ขั้นตอนการลงทะเบียน" },
      { jp: "依頼 (いらい)", th: "คำขอร้อง / เควส" },
      { jp: "恐縮ですが (きょうしゅくですが)", th: "ขอประทานอภัยอย่างยิ่ง (Keigo)" },
      { jp: "報酬 (ほうしゅう)", th: "ค่าตอบแทน" }
    ]
  },
  stages: {
    prelude: {
      name: "บทนำ",
      title: "บทนำ: ว้อดส์",
      easy: {
        dialogues: [
          { 
            speaker: "บรรยาย", 
            jp: "ตุบบบ\n..........",
            bg: "https://files.catbox.moe/0gn4hl.PNG" // ลิงก์ฉากหลัง
          },
          { speaker: "เรา", jp: "โอ้ยยยยย!!!  เจ็บจะบ้า อะไรวะเนี่ย ตาลืมแทบไม่ขึ้นหูก็วิ้งฟังไม่รู้เรื่องเลย" },
          { speaker: "ชาวบ้าน A", jp: "おい、何があったんだ？" },
          { speaker: "ชาวบ้าน B", jp: "女神様じゃないのか？" },
          { speaker: "ชาวบ้าน C", jp: "お母さん、女神様も落ちて痛い痛いするの？" },
          { speaker: "???", jp: "おーい！大丈夫か？おい、君ーーっ！" },
          { speaker: "เรา", jp: "ห้ะ" },
          { speaker: "บรรยาย", jp: "// ลืมตา //\nเมื่อภาพตรงหน้าชัดขึ้น สิ่งที่ปรากฏคือสิ่งมีชีวิตตัวเล็กประหลาดพูดได้ลอยสูงจากพื้นจนอยู่ในระดับสายตา" },
          { 
            speaker: "เรา", 
            jp: ".............",
            quiz: {
              choices: [
                { text: "กรุงเทพเนทีฟเขามีสิ่งนี้หรอ", isCorrect: true },
                { text: "อ้ายบ่อยากเชื่อสายตาว่าภาพตรงหน้าสิเป็นความจริง", isCorrect: true },
                { text: "กูเป็นบ้ามั้ยเนี่ย //ตบหน้าตัวเอง", isCorrect: true },
                { text: "ฝันดี //หลับตานอนใหม่", isCorrect: true }
              ]
            }
          },
          { speaker: "???", jp: "おーい！聞こえてるか？…あれ？言葉が通じないのか？" },
          { speaker: "???", jp: "นี่แกนะ ได้ยินที่ข้าพูดใช่ไหมเนี่ย" },
          { speaker: "เรา", jp: "กำลังพูดไทยอยู่หรอ!!?!?!" },
          { speaker: "เรา", jp: "เดี๋ยวมาต่อท้อคักพี่ๆ ใครคิดได้ช่วยด้วย" }
        ]
      },
      hard: {
        dialogues: [
          { 
            speaker: "บรรยาย", 
            jp: "ตุบบบ\n..........",
            bg: "https://i.postimg.cc/RFxrJHTw/IMG-5717.png"
          },
          { speaker: "เรา", jp: "โอ้ยยยยย!!!  เจ็บจะบ้า อะไรวะเนี่ย ตาลืมแทบไม่ขึ้นหูก็วิ้งฟังไม่รู้เรื่องเลย" },
          { speaker: "ชาวบ้าน A", jp: "おい、一体何事だ！？" },
          { speaker: "ชาวบ้าน B", jp: "空から降臨なさるはずของ女神様…ではないのか？" },
          { speaker: "ชาวบ้าน C", jp: "おかあさん、天から落ちてきた女神様も痛がるの？" },
          { speaker: "???", jp: "おーい！息はあるか！？おいってば、あんたーーっ！" },
          { speaker: "เรา", jp: "ห้ะ" },
          { speaker: "บรรยาย", jp: "// ลืมตา //\nเมื่อภาพตรงหน้าชัดขึ้น สิ่งที่ปรากฏคือสิ่งมีชีวิตตัวเล็กประหลาดพูดได้ลอยสูงจากพื้นจนอยู่ในระดับสายตา" },
          { 
            speaker: "เรา", 
            jp: ".............",
            quiz: {
              choices: [
                { text: "กรุงเทพเนทีฟเขามีสิ่งนี้หรอ", isCorrect: true },
                { text: "อ้ายบ่อยากเชื่อสายตาว่าภาพตรงหน้าสิเป็นความจริง", isCorrect: true },
                { text: "กูเป็นบ้ามั้ยเนี่ย //ตบหน้าตัวเอง", isCorrect: true },
                { text: "ฝันดี //หลับตานอนใหม่", isCorrect: true }
              ]
            }
          },
          { speaker: "???", jp: "おいおい！話を聞いてるのか？…む、さては言葉が通じておらんのか？" },
          { speaker: "???", jp: "นี่แกนะ ได้ยินที่ข้าพูดใช่ไหมเนี่ย" },
          { speaker: "เรา", jp: "กำลังพูดไทยอยู่หรอ!!?!?!" },
          { speaker: "เรา", jp: "เดี๋ยวมาต่อท้อคักพี่ๆ ใครคิดได้ช่วยด้วย" }
        ]
      }
    },
    stage1: {
      name: "ตอนที่ 1",
      title: "ตอนที่ 1: ว้อดส์1",
      easy: {
        dialogues: [
          { speaker: "ギルド受付", jp: "いらっしゃいませ！お名前は何ですか？" },
          {
            speaker: "あなた",
            jp: "……",
            quiz: {
              choices: [
                { text: "私はタイから来た者です。", isCorrect: true },
                { text: "タイは私です。", isCorrect: false, deathReason: "เรียงไวยากรณ์ผิดจนพูดว่า 'ประเทศเทศไทยคือฉัน' พนักงานคิดว่าเป็นคนบ้า ยามกิลด์เลยหวดด้วยกระบองจนสลบ!" }
              ]
            }
          }
        ]
      },
      hard: {
        dialogues: [
          { speaker: "ギルドマスター", jp: "見慣れない格好だな。身元を証明できるものはあるか？" },
          {
            speaker: "あなた",
            jp: "……",
            quiz: {
              choices: [
                { text: "タイから参りました。事故で迷い込みました。", isCorrect: true },
                { text: "タイ人だけど、知らんわ。", isCorrect: false, deathReason: "ใช้ภาษาห้วนใส่หัวหน้ากิลด์ระดับสูง! ถูกเข้าใจผิดว่าเป็นสายลับจากอาณาจักรศัตรู โดนเวทมนตร์ไฟเผาวูบไปเลย!" }
              ]
            }
          }
        ]
      }
    },
    stage2: { name: "ตอนที่ 2", title: "ตอนที่ 2: ว้อดส์2" },
    stage3: { name: "ตอนที่ 3", title: "ตอนที่ 3: ว้อดส์3" },
    stage4: { name: "ตอนที่ 4", title: "ตอนที่ 4: ว้อดส์4" },
    stage5: { name: "ตอนที่ 5", title: "ตอนที่ 5: ว้อดส์5" }
  }
};

/* ==========================================================================
   ใส่ลิงก์รูปตัวละครของคุณที่นี่
   ========================================================================== */
const characterImages = {
  "เรา": "",           // ตัวอย่าง: "https://.../me.png"
  "ชาวบ้าน A": "",    // ตัวอย่าง: "https://.../villagerA.png"
  "ชาวบ้าน B": "",
  "ชาวบ้าน C": "",
  "???": "",
  "บรรยาย": ""        // ปล่อยว่างไว้ ระบบจะซ่อนกรอบอัตโนมัติ
};

let currentDifficulty = 'easy';
let currentStageId = 'prelude';
let currentDialogueIndex = 0;
let currentDialogueList = [];
let unlockedStageIndex = 0;

try {
  unlockedStageIndex = parseInt(localStorage.getItem('savedStageIndex')) || 0;
} catch (e) {
  unlockedStageIndex = 0;
}

let typewriterTimer = null;
let isTyping = false;
let fullCurrentText = "";

function showGameNotification(text) {
  const toast = document.getElementById('game-toast');
  if (!toast) return;
  toast.innerText = text;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 2500);
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
  }
}

function selectDifficulty(diff) {
  currentDifficulty = diff;
  const badge = document.getElementById('diff-badge');
  if (badge) badge.innerText = diff === 'easy' ? 'ระดับง่าย' : 'ระดับยาก';
  updateGlossaryUI();
  updateStageMapUI();
  showScreen('screen-stage');
}

function updateStageMapUI() {
  stageOrder.forEach((stageKey, index) => {
    const nodeEl = document.getElementById(`node-${stageKey}`);
    if (!nodeEl) return;
    const lockIcon = nodeEl.querySelector('.lock-icon');
    if (index <= unlockedStageIndex) {
      nodeEl.classList.remove('locked');
      nodeEl.classList.add('unlocked');
      if (lockIcon) lockIcon.innerText = '';
    } else {
      nodeEl.classList.add('locked');
      nodeEl.classList.remove('unlocked');
      if (lockIcon) lockIcon.innerText = 'ล็อก';
    }
  });
}

function startStage(stageKey) {
  const targetIndex = stageOrder.indexOf(stageKey);
  if (targetIndex > unlockedStageIndex) {
    showGameNotification("ด่านนี้ยังถูกล็อกอยู่ เคลียร์ด่านก่อนหน้าก่อนนะ!");
    return;
  }
  currentStageId = stageKey;
  currentDialogueIndex = 0;
  const stage = gameData.stages[stageKey];
  if (!stage || (!stage.dialogues && !stage[currentDifficulty]?.dialogues)) {
    showGameNotification("ด่านนี้กำลังพัฒนาบทพูดอยู่!");
    return;
  }
  currentDialogueList = stage.dialogues || stage[currentDifficulty]?.dialogues || [];
  showScreen('screen-gameplay');
  renderDialogue();
}

function typeWriter(text, element, onComplete) {
  if (typewriterTimer) clearInterval(typewriterTimer);
  isTyping = true;
  fullCurrentText = text;
  element.innerText = "";
  let i = 0;
  typewriterTimer = setInterval(() => {
    if (i < text.length) {
      const char = text.charAt(i);
      element.innerText += char;
      if (char !== " " && char !== "\n") playDialogueBeep();
      i++;
    } else {
      clearInterval(typewriterTimer);
      isTyping = false;
      if (onComplete) onComplete();
    }
  }, 35);
}

function finishTypingInstantly() {
  if (typewriterTimer) clearInterval(typewriterTimer);
  const textEl = document.getElementById('dialogue-jp');
  if (textEl) textEl.innerText = fullCurrentText;
  isTyping = false;
  const dialogue = currentDialogueList[currentDialogueIndex];
  if (dialogue && dialogue.quiz) showQuizChoices(dialogue.quiz);
}

function showQuizChoices(quiz) {
  const quizContainer = document.getElementById('quiz-choices');
  const btnNext = document.getElementById('btn-next');
  if (!quizContainer || !btnNext) return;
  quizContainer.innerHTML = '';
  quizContainer.classList.remove('hidden');
  btnNext.classList.add('hidden');
  quiz.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.innerText = choice.text;
    btn.onclick = () => handleChoice(choice, btn);
    quizContainer.appendChild(btn);
  });
}

function renderDialogue() {
  const dialogue = currentDialogueList[currentDialogueIndex];
  if (!dialogue) {
    completeCurrentStage();
    return;
  }

  // สลับรูปฉากหลังผ่านแท็ก <img> เพื่อข้ามการบล็อก Hotlink
  const bgImg = document.getElementById('scene-bg-img');
  const guideBox = document.querySelector('.bg-placeholder-guide');

  if (dialogue.bg && bgImg) {
    bgImg.src = dialogue.bg;
    bgImg.classList.remove('hidden');
    if (guideBox) guideBox.style.display = 'none';
  }

  const speakerEl = document.getElementById('speaker-name');
  if (speakerEl) speakerEl.innerText = dialogue.speaker;

  // จัดการซ่อน/แสดงกรอบรูป: ถ้า "บรรยาย" ซ่อนทิ้ง
  const portraitBox = document.querySelector('.portrait-box');
  const portraitImg = document.getElementById('portrait-img');

  if (portraitBox) {
    portraitBox.style.display = (dialogue.speaker === "บรรยาย") ? "none" : "flex";
  }

  // แสดงภาพตัวละคร
  if (portraitImg) {
    const imgSrc = characterImages[dialogue.speaker];
    if (imgSrc) {
      portraitImg.src = imgSrc;
      portraitImg.classList.remove('hidden');
    } else {
      portraitImg.removeAttribute('src');
      portraitImg.classList.add('hidden');
    }
  }

  const textEl = document.getElementById('dialogue-jp');
  const quizContainer = document.getElementById('quiz-choices');
  const btnNext = document.getElementById('btn-next');
  if (quizContainer) quizContainer.classList.add('hidden');
  if (btnNext) btnNext.classList.remove('hidden');

  if (textEl) {
    typeWriter(dialogue.jp, textEl, () => {
      if (dialogue.quiz) showQuizChoices(dialogue.quiz);
    });
  }
}

function handleChoice(choice, clickedBtn) {
  if (choice.isCorrect) {
    document.querySelectorAll('.btn-choice').forEach(b => b.disabled = true);
    if (clickedBtn) {
      clickedBtn.style.backgroundColor = '#d8e8b0';
      clickedBtn.style.borderColor = '#24472e';
      clickedBtn.style.color = '#24472e';
    }
    setTimeout(() => {
      currentDialogueIndex++;
      renderDialogue();
    }, 600);
  } else {
    triggerGameOver(choice.deathReason || "ใช้ไวยากรณ์ผิดพลาดจนเกิดเรื่องใหญ่!");
  }
}

function triggerGameOver(reasonText) {
  const reasonEl = document.getElementById('gameover-reason');
  if (reasonEl) reasonEl.innerText = reasonText;
  showScreen('screen-gameover');
}

function completeCurrentStage() {
  const currentIndex = stageOrder.indexOf(currentStageId);
  const isFinalStage = (currentIndex >= stageOrder.length - 1);
  if (currentIndex === unlockedStageIndex && !isFinalStage) {
    unlockedStageIndex++;
    try { localStorage.setItem('savedStageIndex', unlockedStageIndex); } catch (e) {}
  }
  updateStageMapUI();

  const stageInfo = gameData.stages[currentStageId];
  const stageName = stageInfo?.name || "ด่านนี้";
  const clearedTitle = document.getElementById('cleared-title');
  const clearedSubtitle = document.getElementById('cleared-subtitle');
  if (clearedTitle) clearedTitle.innerText = `${stageName} สำเร็จ!`;
  if (clearedSubtitle) clearedSubtitle.innerText = stageInfo?.title || "";

  const btnNextChapter = document.getElementById('btn-next-chapter');
  if (btnNextChapter) {
    if (isFinalStage) {
      btnNextChapter.innerText = "พิชิตครบทุกภารกิจแล้ว";
      btnNextChapter.onclick = () => showGameNotification("คุณผ่านการทดสอบครบทั้งหมดแล้ว!");
    } else {
      btnNextChapter.innerText = "ตอนถัดไป";
      btnNextChapter.onclick = () => {
        const nextStageKey = stageOrder[currentIndex + 1];
        startStage(nextStageKey);
      };
    }
  }
  showScreen('screen-cleared');
}

function updateGlossaryUI() {
  const listEl = document.getElementById('vocab-list') || document.getElementById('glossary-list');
  if (!listEl) return;
  listEl.innerHTML = '';
  const vocabs = gameData.glossary[currentDifficulty] || [];
  vocabs.forEach(item => {
    const li = document.createElement('li');
    li.className = 'vocab-item';
    li.innerHTML = `<strong>${item.jp}</strong> <span>${item.th}</span>`;
    listEl.appendChild(li);
  });
}

function initGame() {
  bgm = document.getElementById('bgm-player');
  btnAudio = document.getElementById('btn-audio');

  document.addEventListener('click', startAudioOnUserGesture, { once: true });
  document.addEventListener('touchstart', startAudioOnUserGesture, { once: true });

  if (btnAudio) {
    btnAudio.onclick = (e) => {
      e.stopPropagation();
      initAudioContext();
      isMuted = !isMuted;
      btnAudio.innerText = isMuted ? '✕' : '♫';
      if (bgm) {
        bgm.muted = isMuted;
        if (!isMusicStarted && !isMuted) {
          bgm.play().catch(() => {});
          isMusicStarted = true;
        }
      }
    };
  }

  const btnStart = document.getElementById('btn-start');
  if (btnStart) btnStart.onclick = () => showScreen('screen-difficulty');

  const btnEasy = document.getElementById('btn-diff-easy');
  if (btnEasy) btnEasy.onclick = () => selectDifficulty('easy');

  const btnHard = document.getElementById('btn-diff-hard');
  if (btnHard) btnHard.onclick = () => selectDifficulty('hard');

  const btnDiffBack = document.getElementById('btn-diff-back');
  if (btnDiffBack) btnDiffBack.onclick = () => showScreen('screen-title');

  const btnStageBack = document.getElementById('btn-stage-back');
  if (btnStageBack) btnStageBack.onclick = () => showScreen('screen-difficulty');

  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.onclick = () => {
      if (isTyping) finishTypingInstantly();
      else { currentDialogueIndex++; renderDialogue(); }
    };
  }

  const btnRetry = document.getElementById('btn-retry');
  if (btnRetry) btnRetry.onclick = () => startStage(currentStageId);

  const btnBackMap = document.getElementById('btn-back-map');
  if (btnBackMap) btnBackMap.onclick = () => showScreen('screen-stage');

  stageOrder.forEach(stageKey => {
    const node = document.getElementById(`node-${stageKey}`);
    if (node) node.onclick = () => startStage(stageKey);
  });

  const btnGlossary = document.getElementById('btn-glossary');
  const btnCloseGlossary = document.getElementById('btn-close-glossary');
  const modalGlossary = document.getElementById('modal-glossary');

  if (btnGlossary && modalGlossary) btnGlossary.onclick = () => modalGlossary.classList.remove('hidden');
  if (btnCloseGlossary && modalGlossary) btnCloseGlossary.onclick = () => modalGlossary.classList.add('hidden');

  updateGlossaryUI();
  updateStageMapUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
