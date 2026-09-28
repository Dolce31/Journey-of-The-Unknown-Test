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
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}

function playDialogueBeep() {
  if (isMuted) return;
  initAudioContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(460 + Math.random() * 40, now);

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
    bgm
      .play()
      .then(() => {
        isMusicStarted = true;
        if (btnAudio) btnAudio.innerText = "♫";
      })
      .catch(() => {});
  }
}

// ลำดับ 5 บท
const stageOrder = [
  "stage1",
  "stage2",
  "stage3",
  "stage4",
  "stage5",
];

// เก็บแท็บบทที่กำลังเลือกดู
let currentGlossaryTab = "stage1";

const gameData = {
  glossary: {
    stage1: [
      { jp: "何 (なに)", th: "อะไร" },
      { jp: "女神様 (めがみさま)", th: "ท่านเทพธิดา" },
      { jp: "お母さん (おかあさん)", th: "คุณแม่" },
      { jp: "痛い (いたい)", th: "เจ็บ / ปวด" },
      { jp: "息 (いき)", th: "ลมหายใจ" },
      { jp: "言葉 (ことば)", th: "คำพูด / ภาษา" },
      { jp: "一体何事 (いったいなにごと)", th: "เกิดเรื่องอะไรขึ้นกันแน่" },
      { jp: "降臨 (こうりん)", th: "การลงมาจุติ" },
      { jp: "天 (てん)", th: "สวรรค์ / ท้องฟ้า" },
      { jp: "意識 (いしき)", th: "สติสัมปชัญญะ" },
      { jp: "返事 (へんじ)", th: "การตอบรับ / คำตอบ" },
      { jp: "召喚 (しょうかん)", th: "การอัญเชิญ" },
      { jp: "魔力 (まりょく)", th: "พลังเวทมนตร์" }
    ],
    stage2: [
      { jp: "受付 (うけつけ)", th: "แผนกต้อนรับ / ประชาสัมพันธ์" },
      { jp: "名前 (なまえ)", th: "ชื่อ" },
      { jp: "者 (もの)", th: "ผู้... / คน" },
      { jp: "冒険者 (ぼうけんしゃ)", th: "นักผจญภัย" },
      { jp: "格好 (かっこう)", th: "รูปลักษณ์ / การแต่งกาย" },
      { jp: "身元 (みもと)", th: "ตัวตน / ภูมิหลัง" },
      { jp: "証明 (しょうめい)", th: "การยืนยัน / หลักฐาน" },
      { jp: "事故 (じこ)", th: "อุบัติเหตุ" }
    ],
    stage3: [],
    stage4: [],
    stage5: []
  },
  stages: {
    stage1: {
      name: "บทที่ 1",
      title: "บทที่ 1: ว้อดส์",
      easy: {
        dialogues: [
          {
            speaker: "บรรยาย",
            jp: "ตุบบบ\n..........",
            bg: "https://files.catbox.moe/0gn4hl.PNG",
          },
          {
            speaker: "เรา",
            jp: "โอ้ยยยยย!!!  เจ็บจะบ้า อะไรวะเนี่ย ตาลืมแทบไม่ขึ้นหูก็วิ้งฟังไม่รู้เรื่องเลย",
          },
          { speaker: "ชาวบ้าน A", jp: "おい、何があったんだ？" },
          { speaker: "ชาวบ้าน B", jp: "女神様じゃないのか？" },
          {
            speaker: "ชาวบ้าน C",
            jp: "お母さん、女神様も落ちて痛い痛いするの？",
          },
          { speaker: "เรา", jp: "ห้ะ" },
          {
            speaker: "บรรยาย",
            jp: "เมื่อภาพตรงหน้าชัดขึ้น สิ่งที่ปรากฏคือสิ่งมีชีวิตตัวเล็กประหลาดพูดได้อยู่เต็มรอบตัว",
            bg: "https://files.catbox.moe/hu81qp.JPG",
          },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                { text: "กรุงเทพเนทีฟเขามีสิ่งนี้หรอ", isCorrect: true },
                {
                  text: "อ้ายบ่อยากเชื่อสายตาว่าภาพตรงหน้าสิเป็นความจริง",
                  isCorrect: true,
                },
                { text: "กูเป็นบ้ามั้ยเนี่ย //ตบหน้าตัวเอง", isCorrect: true },
                { text: "ฝันดี //หลับตานอนใหม่", isCorrect: true },
              ],
            },
          },
          {
            speaker: "บรรยาย",
            jp: "ในขณะที่กำลังตกใจกับภาพตรงหน้าก็มีแมวตัวสีขาวเดินเข้ามาหา",
            bg: "https://files.catbox.moe/eqkghi.PNG",
          },
          {
            speaker: "???",
            jp: "おーい！息はあるか！？おいってば、あんたーーっ！",
          },
          { speaker: "เรา", jp: "....." },
          {
            speaker: "???",
            jp: "おーい！聞こえてるか？…あれ？言葉が通じないのか？",
          },
          { speaker: "???", jp: "นี่แกนะ ได้ยินที่ข้าพูดใช่ไหมเนี่ย" },
          {
            speaker: "เรา",
            jp: "พูดไทยอยู่หร๊ออออ เดี๋ยวไม่สิ สัตว์จะไปพูดได้ยังไงบ้าป่ะเนี่ย ",
          },
          { speaker: "???", jp: "เจ้านะสิบ้า" },
          { speaker: "???", jp: "แต่ยังไงก็ขอโทษทีนะ ข้าชื่อเฟลิส" },
          {
            speaker: "เฟลิส",
            jp: "ยินดีต้อนรับ พอดีทางพวกข้าทำพิธีอัญเชิญผิดพลาดเจ้าก็เลยถูกดึงมาที่นี่น่ะ",
          },
          { speaker: "เฟลิส", jp: "ตอนนี้เจ้าน่ะก็เลยอยู่ต่างโลก" },
          { speaker: "เรา", jp: "ห๊าาาาาาา" },
          {
            speaker: "เฟลิส",
            jp: "แต่ว่าไม่ต้องห่วงไปหรอกนะ พวกข้าส่งเจ้ากลับได้",
          },
          { speaker: "เรา", jp: "จริงหรอ งั้นทำเลย ก่อนที่จะเป็นลม" },
          { speaker: "เฟลิส", jp: "อ๊ะ แต่ว่า" },
          {
            speaker: "เฟลิส",
            jp: "พวกที่เตรียมพิธี มีภารกิจต้องไปทำงานช่วยเหลือชาวบ้านนี่สิ ลืมไปเลยแหะ ",
            bg: "https://files.catbox.moe/yai4fw.PNG",
          },
          { speaker: "เฟลิส", jp: "ก็คงต้องรอก่อนอะนะ" },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                { text: "ล้อกันเล่นป่ะเนี่ย", isCorrect: true },
                {
                  text: "จับกินซะดีมั้ย",
                  isCorrect: true,
                },
              ],
            },
          },
          { speaker: "เฟลิส", jp: "ใจเย็นน่าาาา" },
          { speaker: "เฟลิส", jp: "หรือว่า" },
          {
            speaker: "เฟลิส",
            jp: "เจ้าจะไปทำภารกิจแทนล่ะ",
            bg: "https://files.catbox.moe/25z9t1.PNG",
          },
          { speaker: "เรา", jp: "หํะ" },
          {
            speaker: "เฟลิส",
            jp: "โลกนี้น่ะนะมีสิ่งที่เรียกว่าเวทมนต์ แต่ก็ไม่ใช่ทุกคนจะใช้มันได้",
          },
          {
            speaker: "เฟลิส",
            jp: "คนที่มีพลังเลยได้รับภารกิจให้ช่วยซัพพอร์ตการใช้ชีวิตทั่วไปของผู้คนน่ะ",
          },
          {
            speaker: "เฟลิส",
            jp: "พลังเวทจะออกมาเมื่อจดจ่อและร่ายด้วยภาษาของโลกนี้",
          },
          {
            speaker: "เฟลิส",
            jp: "ข้าเองก็สัมผัสพลังเวทจากเจ้าได้ ถ้าทำตามที่ข้าบอกเจ้าใช้มันได้แน่ๆ",
          },
          {
            speaker: "เฟลิส",
            jp: "เอาไงล่ะ จะทนรอต่อไป หรืออยากรีบกลับโลกเดิม",
          },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                { text: "ก็มีแต่ต้องทำ", isCorrect: true },
                {
                  text: "จะทนอยู่ต่อก็ไม่ไหว ทำก็ได้ ",
                  isCorrect: true,
                },
                { text: "ถ้ามันทำให้กลับได้ไวฉันก็จะทำ ", isCorrect: true },
              ],
            },
          },
          {
            speaker: "เฟลิส",
            jp: "ตัดสินใจได้ดีนิ",
          },
          {
            speaker: "เฟลิส",
            jp: "อะนี่",
            bg: "https://files.catbox.moe/69e8nt.PNG",
          },
          {
            speaker: "เฟลิส",
            jp: "นี่คือภารกิจกับไม้กายสิทธิ์",
          },
          {
            speaker: "เรา",
            jp: "กำจัดฝุ่น เก็บสมุนไพร........ ",
          },
          {
            speaker: "เฟลิส",
            jp: "ไม่ยากใช่มั้ยละ แล้วข้าเองก็จะไปด้วย จะค่อยช่วยเหลือนิดๆหน่อยๆก็ละกัน",
          },
          {
            speaker: "เรา",
            jp: "เยอะอยู่นะเนี่ย แล้วทำไมเจ้าไม่ทำล่ะ",
          },
          {
            speaker: "เฟลิส",
            jp: "ห๊าา ก็ไม่ใช่หน้าที่ข้าสักหน่อย ข้าเองก็มีภาระหนักมากอยู่แล้ว",
          },
          {
            speaker: "เรา",
            jp: "ที่ไปด้วย เพราะกะจะอู้ใช่มั้ยเนี่ย",
          },
          {
            speaker: "เฟลิส",
            jp: "รู้ดีจริงๆ แต่ก็ตามนั้นแหละ",
          },
          {
            speaker: "เฟลิส",
            jp: "งั้น ถ้าพร้อมแล้วเราก็ไปกันเถอะ ",
          },
        ],
      },
      hard: {
        dialogues: [
          {
            speaker: "บรรยาย",
            jp: "ตุบบบ\n..........",
            bg: "https://files.catbox.moe/0gn4hl.PNG",
          },
          {
            speaker: "เรา",
            jp: "โอ้ยยยยย!!!  เจ็บจะบ้า อะไรวะเนี่ย ตาลืมแทบไม่ขึ้นหูก็วิ้งฟังไม่รู้เรื่องเลย",
          },
          { speaker: "ชาวบ้าน A", jp: "おい、一体何事だ！？空から何かが落ちてきたぞ！" },
          {
            speaker: "ชาวบ้าน B",
            jp: "空より降臨あそばされた女神様…というわけではなさそうだな。",
          },
          {
            speaker: "ชาวบ้าน C",
            jp: "おかあさん、天から落ちてきた神様も痛がるものなの？",
          },
          { speaker: "เรา", jp: "ห้ะ" },
          {
            speaker: "บรรยาย",
            jp: "เมื่อภาพตรงหน้าชัดขึ้น สิ่งที่ปรากฏคือสิ่งมีชีวิตตัวเล็กประหลาดพูดได้อยู่เต็มรอบตัว",
            bg: "https://files.catbox.moe/hu81qp.JPG",
          },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                { text: "กรุงเทพเนทีฟเขามีสิ่งนี้หรอ", isCorrect: true },
                {
                  text: "อ้ายบ่อยากเชื่อสายตาว่าภาพตรงหน้าสิเป็นความจริง",
                  isCorrect: true,
                },
                { text: "กูเป็นบ้ามั้ยเนี่ย //ตบหน้าตัวเอง", isCorrect: true },
                { text: "ฝันดี //หลับตานอนใหม่", isCorrect: true },
              ],
            },
          },
          {
            speaker: "บรรยาย",
            jp: "ในขณะที่กำลังตกใจกับภาพตรงหน้าก็มีแมวตัวสีขาวเดินเข้ามาหา",
            bg: "https://files.catbox.moe/eqkghi.PNG",
          },
          {
            speaker: "???",
            jp: "おい！息災か！？意識はあるのか？返事をせんか、あんたーーっ！",
          },
          { speaker: "เรา", jp: "....." },
          {
            speaker: "???",
            jp: "おい、聞こえておるか？…む、さては言語が通じておらんのか？",
          },
          { speaker: "???", jp: "นี่แกนะ ได้ยินที่ข้าพูดใช่ไหมเนี่ย" },
          {
            speaker: "เรา",
            jp: "พูดไทยอยู่หร๊ออออ เดี๋ยวไม่สิ สัตว์จะไปพูดได้ยังไงบ้าป่ะเนี่ย ",
          },
          { speaker: "???", jp: "เจ้านะสิบ้า" },
          { speaker: "???", jp: "แต่ยังไงก็ขอโทษทีนะ ข้าชื่อเฟลิส" },
          {
            speaker: "เฟลิส",
            jp: "ยินดีต้อนรับ พอดีทางพวกข้าทำพิธีอัญเชิญผิดพลาดเจ้าก็เลยถูกดึงมาที่นี่น่ะ",
          },
          { speaker: "เฟลิส", jp: "ตอนนี้เจ้าน่ะก็เลยอยู่ต่างโลก" },
          { speaker: "เรา", jp: "ห๊าาาาาาา" },
          {
            speaker: "เฟลิส",
            jp: "แต่ว่าไม่ต้องห่วงไปหรอกนะ พวกข้าส่งเจ้ากลับได้",
          },
          { speaker: "เรา", jp: "จริงหรอ งั้นทำเลย ก่อนที่จะเป็นลม" },
          { speaker: "เฟลิส", jp: "อ๊ะ แต่ว่า" },
          {
            speaker: "เฟลิส",
            jp: "พวกที่เตรียมพิธี มีภารกิจต้องไปทำงานช่วยเหลือชาวบ้านนี่สิ ลืมไปเลยแหะ ",
            bg: "https://files.catbox.moe/yai4fw.PNG",
          },
          { speaker: "เฟลิส", jp: "ก็คงต้องรอก่อนอะนะ" },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                { text: "ล้อกันเล่นป่ะเนี่ย", isCorrect: true },
                {
                  text: "จับกินซะดีมั้ย",
                  isCorrect: true,
                },
              ],
            },
          },
          { speaker: "เฟลิส", jp: "ใจเย็นน่าาาา" },
          { speaker: "เฟลิส", jp: "หรือว่า" },
          {
            speaker: "เฟลิส",
            jp: "เจ้าจะไปทำภารกิจแทนล่ะ",
            bg: "https://files.catbox.moe/25z9t1.PNG",
          },
          { speaker: "เรา", jp: "หํะ" },
          {
            speaker: "เฟลิส",
            jp: "โลกนี้น่ะนะมีสิ่งที่เรียกว่าเวทมนต์ แต่ก็ไม่ใช่ทุกคนจะใช้มันได้",
          },
          {
            speaker: "เฟลิส",
            jp: "คนที่มีพลังเลยได้รับภารกิจให้ช่วยซัพพอร์ตการใช้ชีวิตทั่วไปของผู้คนน่ะ",
          },
          {
            speaker: "เฟลิส",
            jp: "พลังเวทจะออกมาเมื่อจดจ่อและร่ายด้วยภาษาของโลกนี้",
          },
          {
            speaker: "เฟลิส",
            jp: "ข้าเองก็สัมผัสพลังเวทจากเจ้าได้ ถ้าทำตามที่ข้าบอกเจ้าใช้มันได้แน่ๆ",
          },
          {
            speaker: "เฟลิส",
            jp: "เอาไงล่ะ จะทนรอต่อไป หรืออยากรีบกลับโลกเดิม",
          },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                { text: "ก็มีแต่ต้องทำ", isCorrect: true },
                {
                  text: "จะทนอยู่ต่อก็ไม่ไหว ทำก็ได้ ",
                  isCorrect: true,
                },
                { text: "ถ้ามันทำให้กลับได้ไวฉันก็จะทำ ", isCorrect: true },
              ],
            },
          },
          {
            speaker: "เฟลิส",
            jp: "ตัดสินใจได้ดีนิ",
          },
          {
            speaker: "เฟลิส",
            jp: "อะนี่",
            bg: "https://files.catbox.moe/69e8nt.PNG",
          },
          {
            speaker: "เฟลิส",
            jp: "นี่คือภารกิจกับไม้กายสิทธิ์",
          },
          {
            speaker: "เรา",
            jp: "กำจัดฝุ่น เก็บสมุนไพร........ ",
          },
          {
            speaker: "เฟลิส",
            jp: "ไม่ยากใช่มั้ยละ แล้วข้าเองก็จะไปด้วย จะค่อยช่วยเหลือนิดๆหน่อยๆก็ละกัน",
          },
          {
            speaker: "เรา",
            jp: "เยอะอยู่นะเนี่ย แล้วทำไมเจ้าไม่ทำล่ะ",
          },
          {
            speaker: "เฟลิส",
            jp: "ห๊าา ก็ไม่ใช่หน้าที่ข้าสักหน่อย ข้าเองก็มีภาระหนักมากอยู่แล้ว",
          },
          {
            speaker: "เรา",
            jp: "ที่ไปด้วย เพราะกะจะอู้ใช่มั้ยเนี่ย",
          },
          {
            speaker: "เฟลิส",
            jp: "รู้ดีจริงๆ แต่ก็ตามนั้นแหละ",
          },
          {
            speaker: "เฟลิส",
            jp: "งั้น ถ้าพร้อมแล้วเราก็ไปกันเถอะ ",
          },
        ],
      },
    },
    stage2: {
      name: "บทที่ 2",
      title: "บทที่ 2: ว้อดส์ 2",
      easy: {
        dialogues: [
          { speaker: "ギルド受付", jp: "いらっしゃいませ！お名前は何ですか？" },
          {
            speaker: "あなた",
            jp: "……",
            quiz: {
              choices: [
                { text: "私はタイから来た者です。", isCorrect: true },
                {
                  text: "タイは私です。",
                  isCorrect: false,
                  deathReason:
                    "เรียงไวยากรณ์ผิดจนพูดว่า 'ประเทศเทศไทยคือฉัน' พนักงานคิดว่าเป็นคนบ้า ยามกิลด์เลยหวดด้วยกระบองจนสลบ!",
                },
              ],
            },
          },
        ],
      },
      hard: {
        dialogues: [
          {
            speaker: "ギルドマスター",
            jp: "見慣れない格好だな。身元を証明できるものはあるか？",
          },
          {
            speaker: "あなた",
            jp: "……",
            quiz: {
              choices: [
                {
                  text: "タイから参りました。事故で迷い込みました。",
                  isCorrect: true,
                },
                {
                  text: "タイ人だけど、知らんわ。",
                  isCorrect: false,
                  deathReason:
                    "ใช้ภาษาห้วนใส่หัวหน้ากิลด์ระดับสูง! ถูกเข้าใจผิดว่าเป็นสายลับจากอาณาจักรศัตรู โดนเวทมนตร์ไฟเผาวูบไปเลย!",
                },
              ],
            },
          },
        ],
      },
    },
    stage3: { name: "บทที่ 3", title: "บทที่ 3: ว้อดส์ 3" },
    stage4: { name: "บทที่ 4", title: "บทที่ 4: ว้อดส์ 4" },
    stage5: { name: "บทที่ 5", title: "บทที่ 5: ว้อดส์ 5" },
  },
};

/* ==========================================================================
   ใส่ลิงก์รูปตัวละครของคุณที่นี่
   ========================================================================== */
const characterImages = {
  เรา: "https://files.catbox.moe/2csuu8.PNG",
  เฟลิส: "https://files.catbox.moe/ioyavk.PNG",
  "ชาวบ้าน A": "",
  "ชาวบ้าน B": "",
  "ชาวบ้าน C": "",
  "???": "https://files.catbox.moe/ioyavk.PNG",
  บรรยาย: "",
};

let currentDifficulty = "easy";
let currentStageId = "stage1";
let currentDialogueIndex = 0;
let currentDialogueList = [];
let unlockedStageIndex = 0;

try {
  unlockedStageIndex = parseInt(localStorage.getItem("savedStageIndex")) || 0;
} catch (e) {
  unlockedStageIndex = 0;
}

let typewriterTimer = null;
let isTyping = false;
let fullCurrentText = "";

function showGameNotification(text) {
  const toast = document.getElementById("game-toast");
  if (!toast) return;
  toast.innerText = text;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function showScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
    target.scrollTop = 0;
  }
}

function selectDifficulty(diff) {
  currentDifficulty = diff;
  const badge = document.getElementById("diff-badge");
  if (badge) badge.innerText = diff === "easy" ? "ระดับง่าย" : "ระดับยาก";
  updateStageMapUI();
  showScreen("screen-stage");
}

function updateStageMapUI() {
  stageOrder.forEach((stageKey, index) => {
    const nodeEl = document.getElementById(`node-${stageKey}`);
    if (!nodeEl) return;
    const lockIcon = nodeEl.querySelector(".lock-icon");
    if (index <= unlockedStageIndex) {
      nodeEl.classList.remove("locked");
      nodeEl.classList.add("unlocked");
      if (lockIcon) lockIcon.innerText = "";
    } else {
      nodeEl.classList.add("locked");
      nodeEl.classList.remove("unlocked");
      if (lockIcon) lockIcon.innerText = "ล็อก";
    }
  });
}

function startStage(stageKey) {
  const targetIndex = stageOrder.indexOf(stageKey);
  if (targetIndex > unlockedStageIndex) {
    showGameNotification("บทนี้ยังถูกล็อกอยู่ เคลียร์บทก่อนหน้าก่อนนะ!");
    return;
  }
  currentStageId = stageKey;
  currentDialogueIndex = 0;
  const stage = gameData.stages[stageKey];
  if (!stage || (!stage.dialogues && !stage[currentDifficulty]?.dialogues)) {
    showGameNotification("บทนี้กำลังพัฒนาบทพูดอยู่!");
    return;
  }
  currentDialogueList =
    stage.dialogues || stage[currentDifficulty]?.dialogues || [];
  showScreen("screen-gameplay");
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
  const textEl = document.getElementById("dialogue-jp");
  if (textEl) textEl.innerText = fullCurrentText;
  isTyping = false;
  const dialogue = currentDialogueList[currentDialogueIndex];
  if (dialogue && dialogue.quiz) showQuizChoices(dialogue.quiz);
}

function showQuizChoices(quiz) {
  const quizContainer = document.getElementById("quiz-choices");
  const btnNext = document.getElementById("btn-next");
  if (!quizContainer || !btnNext) return;
  quizContainer.innerHTML = "";
  quizContainer.classList.remove("hidden");
  btnNext.classList.add("hidden");
  quiz.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "btn-choice";
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

  const bgImg = document.getElementById("scene-bg-img");
  const guideBox = document.querySelector(".bg-placeholder-guide");

  if (dialogue.bg) {
    if (bgImg) {
      bgImg.src = dialogue.bg;
      bgImg.classList.remove("hidden");
    }
    if (guideBox) guideBox.style.display = "none";
  }

  const speakerEl = document.getElementById("speaker-name");
  if (speakerEl) speakerEl.innerText = dialogue.speaker;

  const portraitBox = document.querySelector(".portrait-box");
  const portraitFrame = document.querySelector(".portrait-frame");
  const portraitImg = document.getElementById("portrait-img");

  if (portraitBox) {
    portraitBox.style.display = dialogue.speaker === "บรรยาย" ? "none" : "flex";
  }

  const imgSrc = characterImages[dialogue.speaker];

  if (portraitFrame && portraitImg) {
    if (imgSrc) {
      portraitFrame.style.display = "flex";
      portraitImg.src = imgSrc;
      portraitImg.classList.remove("hidden");
    } else {
      portraitFrame.style.display = "none";
      portraitImg.removeAttribute("src");
      portraitImg.classList.add("hidden");
    }
  }

  const textEl = document.getElementById("dialogue-jp");
  const quizContainer = document.getElementById("quiz-choices");
  const btnNext = document.getElementById("btn-next");
  if (quizContainer) quizContainer.classList.add("hidden");
  if (btnNext) btnNext.classList.remove("hidden");

  if (textEl) {
    typeWriter(dialogue.jp, textEl, () => {
      if (dialogue.quiz) showQuizChoices(dialogue.quiz);
    });
  }
}

function handleChoice(choice, clickedBtn) {
  if (choice.isCorrect) {
    document
      .querySelectorAll(".btn-choice")
      .forEach((b) => (b.disabled = true));
    if (clickedBtn) {
      clickedBtn.style.backgroundColor = "#d8e8b0";
      clickedBtn.style.borderColor = "#24472e";
      clickedBtn.style.color = "#24472e";
    }
    setTimeout(() => {
      currentDialogueIndex++;
      renderDialogue();
    }, 600);
  } else {
    triggerGameOver(
      choice.deathReason || "ใช้ไวยากรณ์ผิดพลาดจนเกิดเรื่องใหญ่!",
    );
  }
}

function triggerGameOver(reasonText) {
  const reasonEl = document.getElementById("gameover-reason");
  if (reasonEl) reasonEl.innerText = reasonText;
  showScreen("screen-gameover");
}

function completeCurrentStage() {
  const currentIndex = stageOrder.indexOf(currentStageId);
  const isFinalStage = currentIndex >= stageOrder.length - 1;
  if (currentIndex === unlockedStageIndex && !isFinalStage) {
    unlockedStageIndex++;
    try {
      localStorage.setItem("savedStageIndex", unlockedStageIndex);
    } catch (e) {}
  }
  updateStageMapUI();

  const stageInfo = gameData.stages[currentStageId];
  const stageName = stageInfo?.name || "บทนี้";
  const clearedTitle = document.getElementById("cleared-title");
  const clearedSubtitle = document.getElementById("cleared-subtitle");
  if (clearedTitle) clearedTitle.innerText = `${stageName} สำเร็จ!`;
  if (clearedSubtitle) clearedSubtitle.innerText = stageInfo?.title || "";

  const btnNextChapter = document.getElementById("btn-next-chapter");
  if (btnNextChapter) {
    if (isFinalStage) {
      btnNextChapter.innerText = "พิชิตครบทุกภารกิจแล้ว";
      btnNextChapter.onclick = () =>
        showGameNotification("คุณผ่านการทดสอบครบทั้งหมดแล้ว!");
    } else {
      btnNextChapter.innerText = "ตอนถัดไป";
      btnNextChapter.onclick = () => {
        const nextStageKey = stageOrder[currentIndex + 1];
        startStage(nextStageKey);
      };
    }
  }
  showScreen("screen-cleared");
}

// สลับแท็บบทในคลังคันจิ
function switchGlossaryTab(stageKey) {
  currentGlossaryTab = stageKey;
  document.querySelectorAll(".tab-btn").forEach((btn, index) => {
    const isTarget = stageOrder[index] === stageKey;
    btn.classList.toggle("active", isTarget);
  });
  updateGlossaryUI();
}

function updateGlossaryUI() {
  const listEl = document.getElementById("glossary-list");
  if (!listEl) return;
  listEl.innerHTML = "";
  
  const kanjiList = gameData.glossary[currentGlossaryTab] || [];
  if (kanjiList.length === 0) {
    listEl.innerHTML = '<li class="empty-vocab-msg">ยังไม่มีคำศัพท์คันจิในบทนี้</li>';
    return;
  }

  kanjiList.forEach((item) => {
    const li = document.createElement("li");
    li.className = "vocab-item";
    li.innerHTML = `<strong>${item.jp}</strong> <span>${item.th}</span>`;
    listEl.appendChild(li);
  });
}

function initGame() {
  bgm = document.getElementById("bgm-player");
  btnAudio = document.getElementById("btn-audio");

  document.addEventListener("click", startAudioOnUserGesture, { once: true });
  document.addEventListener("touchstart", startAudioOnUserGesture, {
    once: true,
  });

  if (btnAudio) {
    btnAudio.onclick = (e) => {
      e.stopPropagation();
      initAudioContext();
      isMuted = !isMuted;
      btnAudio.innerText = isMuted ? "✕" : "♫";
      if (bgm) {
        bgm.muted = isMuted;
        if (!isMusicStarted && !isMuted) {
          bgm.play().catch(() => {});
          isMusicStarted = true;
        }
      }
    };
  }

  const btnStart = document.getElementById("btn-start");
  if (btnStart) btnStart.onclick = () => showScreen("screen-difficulty");

  const btnEasy = document.getElementById("btn-diff-easy");
  if (btnEasy) btnEasy.onclick = () => selectDifficulty("easy");

  const btnHard = document.getElementById("btn-diff-hard");
  if (btnHard) btnHard.onclick = () => selectDifficulty("hard");

  const btnDiffBack = document.getElementById("btn-diff-back");
  if (btnDiffBack) btnDiffBack.onclick = () => showScreen("screen-title");

  const btnStageBack = document.getElementById("btn-stage-back");
  if (btnStageBack)
    btnStageBack.onclick = () => showScreen("screen-difficulty");

  const btnNext = document.getElementById("btn-next");
  if (btnNext) {
    btnNext.onclick = () => {
      if (isTyping) finishTypingInstantly();
      else {
        currentDialogueIndex++;
        renderDialogue();
      }
    };
  }

  const btnRetry = document.getElementById("btn-retry");
  if (btnRetry) btnRetry.onclick = () => startStage(currentStageId);

  const btnGameOverBack = document.getElementById("btn-gameover-back");
  if (btnGameOverBack)
    btnGameOverBack.onclick = () => showScreen("screen-stage");

  const btnBackMap = document.getElementById("btn-back-map");
  if (btnBackMap) btnBackMap.onclick = () => showScreen("screen-stage");

  stageOrder.forEach((stageKey) => {
    const node = document.getElementById(`node-${stageKey}`);
    if (node) node.onclick = () => startStage(stageKey);
  });

  const btnGlossary = document.getElementById("btn-glossary");
  const btnCloseGlossary = document.getElementById("btn-close-glossary");
  const modalGlossary = document.getElementById("modal-glossary");

  if (btnGlossary && modalGlossary) {
    btnGlossary.onclick = () => {
      switchGlossaryTab("stage1");
      modalGlossary.classList.remove("hidden");
    };
  }
  if (btnCloseGlossary && modalGlossary) {
    btnCloseGlossary.onclick = () => modalGlossary.classList.add("hidden");
  }

  updateGlossaryUI();
  updateStageMapUI();
}

initGame();
