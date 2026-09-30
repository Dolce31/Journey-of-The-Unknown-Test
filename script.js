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

// ระบบพลังชีวิต (ปรับตามความยาก: ง่าย = 2, ยาก = 1)
let maxLives = 2;
let playerLives = 2;

const gameData = {
  glossary: {
    stage1: {
      easy: [
        { kanji: "何", furi: "なに", th: "อะไร" },
        { kanji: "空", furi: "そら", th: "ท้องฟ้า" },
        { kanji: "天", furi: "てん", th: "สวรรค์ / ท้องฟ้า" },
        { kanji: "母", furi: "はは / おかあさん", th: "แม่ / คุณแม่" },
        { kanji: "痛い", furi: "いたい", th: "เจ็บ / ปวด" },
        { kanji: "聞こえる", furi: "きこえる", th: "ได้ยิน" },
        { kanji: "言葉", furi: "ことば", th: "คำพูด / ภาษา" }
      ],
      hard: [
        { kanji: "一体何事", furi: "いったいなにごと", th: "เกิดเรื่องอะไรขึ้นกันแน่" },
        { kanji: "降臨", furi: "こうりん", th: "การเสด็จลงมา / จุติ" },
        { kanji: "女神様", furi: "めがみさま", th: "ท่านเทพธิดา" },
        { kanji: "息", furi: "いき", th: "ลมหายใจ" },
        { kanji: "神様", furi: "かみさま", th: "พระเจ้า / เทพเจ้า" },
        { kanji: "痛がる", furi: "いたがる", th: "รู้สึกเจ็บปวด / แสดงอาการเจ็บ" },
        { kanji: "息災", furi: "そくさい", th: "ความปลอดภัย / สุขสบายดี" },
        { kanji: "意識", furi: "いしき", th: "สติสัมปชัญญะ" },
        { kanji: "返事", furi: "へんじ", th: "การตอบรับ / คำตอบ" },
        { kanji: "落ちる", furi: "おちる", th: "ตก" },
        { kanji: "言語", furi: "げんご", th: "ภาษา" }
      ]
    },
    stage2: {
      easy: [
        { kanji: "海", furi: "うみ", th: "ทะเล" },
        { kanji: "雨", furi: "あめ", th: "ฝน" },
        { kanji: "水", furi: "みず", th: "น้ำ" },
        { kanji: "火", furi: "ひ", th: "ไฟ" },
        { kanji: "洗う", furi: "あらう", th: "ล้าง" },
        { kanji: "綺麗", furi: "きれい", th: "สวย / สะอาด" },
        { kanji: "家", furi: "いえ", th: "บ้าน" },
        { kanji: "手伝って", furi: "てつだって", th: "ช่วยเหลือ (て-form)" },
        { kanji: "本当", furi: "ほんとう", th: "จริง / แท้จริง" }
      ],
      hard: [
        { kanji: "会議", furi: "かいぎ", th: "การประชุม (เวทพูดคุย)" },
        { kanji: "燃える", furi: "もえる", th: "เผาไหม้ / ลุกไหม้" },
        { kanji: "湯", furi: "ゆ", th: "น้ำร้อน" },
        { kanji: "掃除", furi: "そうじ", th: "การทำความสะอาด" },
        { kanji: "洗濯", furi: "せんたく", th: "การซักผ้า" },
        { kanji: "皆", furi: "みな", th: "ทุกคน" },
        { kanji: "助かりました", furi: "たすかりました", th: "รอดตัวแล้ว / ได้รับความช่วยเหลือ" },
        { kanji: "世話", furi: "せわ", th: "การดูแลเอาใจใส่" },
        { kanji: "遠慮", furi: "えんりょ", th: "ความเกรงใจ" },
        { kanji: "感謝", furi: "かんしゃ", th: "ความขอบคุณ / ซาบซึ้ง" }
      ]
    },
    stage3: {
      easy: [],
      hard: [
        { kanji: "調べる", furi: "しらべる", th: "ตรวจสอบ / สำรวจ" },
        { kanji: "探す", furi: "さがす", th: "ค้นหา" },
        { kanji: "洗う", furi: "あらう", th: "ล้าง" },
        { kanji: "集める", furi: "あつめる", th: "รวบรวม" },
        { kanji: "捨てる", furi: "すてる", th: "ทิ้ง" }
      ]
    },
    stage4: { easy: [], hard: [] },
    stage5: { easy: [], hard: [] }
  },
  stages: {
    stage1: {
      name: "บทที่ 1",
      title: "บทที่ 1: ยินดีต้อนรับ",
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
          { speaker: "???", jp: "นี่แกน่ะ! ได้ยินที่ข้าพูดใช่ไหมเนี่ย" },
          {
            speaker: "เรา",
            jp: "พูดไทยอยู่หร๊ออออ เดี๋ยวไม่สิ สัตว์จะไปพูดได้ยังไงบ้าป่ะเนี่ย ",
          },
          { speaker: "???", jp: "เจ้าน่ะสิบ้า" },
          { speaker: "???", jp: "แต่ยังไงก็ขอโทษทีนะ ข้าชื่อเฟลิส" },
          {
            speaker: "เฟลิส",
            jp: "ยินดีต้อนรับ พอดีทางพวกข้าทำพิธีอัญเชิญผิดพลาด เจ้าก็เลยถูกดึงมาที่นี่น่ะ",
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
          { speaker: "เรา", jp: "ห้ะ" },
          {
            speaker: "เฟลิส",
            jp: "โลกนี้น่ะนะมีสิ่งที่เรียกว่าเวทมนตร์ แต่ก็ไม่ใช่ทุกคนจะใช้มันได้",
          },
          {
            speaker: "เฟลิส",
            jp: "คนที่มีพลังเลยได้รับภารกิจ ให้ช่วยซัพพอร์ตการใช้ชีวิตทั่วไปของผู้คนน่ะ",
          },
          {
            speaker: "เฟลิส",
            jp: "พลังเวทจะออกมาเมื่อจดจ่อและร่ายด้วยภาษาของโลกนี้",
          },
          {
            speaker: "เฟลิส",
            jp: "ข้าเอง ก็สัมผัสพลังเวทจากเจ้าได้ ถ้าทำตามที่ข้าบอกเจ้าใช้มันได้แน่ๆ",
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
            jp: "ไม่ยากใช่มั้ยล่ะ แล้วข้าเองก็จะไปด้วย จะคอยช่วยเหลือนิดๆหน่อยๆก็ละกัน",
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
            jp: "おい！生きているか！？ 意識はあるのか？ 返事をせんか、あんたーーっ！",
          },
          { speaker: "เรา", jp: "....." },
          {
            speaker: "???",
            jp: "おい、聞こえておるか？…む、さては言語が通じておらんのか？",
          },
          { speaker: "???", jp: "นี่แกน่ะ! ได้ยินที่ข้าพูดใช่ไหมเนี่ย" },
          {
            speaker: "เรา",
            jp: "พูดไทยอยู่หร๊ออออ เดี๋ยวไม่สิ สัตว์จะไปพูดได้ยังไงบ้าป่ะเนี่ย ",
          },
          { speaker: "???", jp: "เจ้าน่ะสิบ้า" },
          { speaker: "???", jp: "แต่ยังไงก็ขอโทษทีนะ ข้าชื่อเฟลิส" },
          {
            speaker: "เฟลิส",
            jp: "ยินดีต้อนรับ พอดีทางพวกข้าทำพิธีอัญเชิญผิดพลาด เจ้าก็เลยถูกดึงมาที่นี่น่ะ",
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
          { speaker: "เรา", jp: "ห้ะ" },
          {
            speaker: "เฟลิส",
            jp: "โลกนี้น่ะนะมีสิ่งที่เรียกว่าเวทมนตร์ แต่ก็ไม่ใช่ทุกคนจะใช้มันได้",
          },
          {
            speaker: "เฟลิส",
            jp: "คนที่มีพลังเลยได้รับภารกิจ ให้ช่วยซัพพอร์ตการใช้ชีวิตทั่วไปของผู้คนน่ะ",
          },
          {
            speaker: "เฟลิส",
            jp: "พลังเวทจะออกมาเมื่อจดจ่อและร่ายด้วยภาษาของโลกนี้",
          },
          {
            speaker: "เฟลิส",
            jp: "ข้าเอง ก็สัมผัสพลังเวทจากเจ้าได้ ถ้าทำตามที่ข้าบอกเจ้าใช้มันได้แน่ๆ",
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
            jp: "ไม่ยากใช่มั้ยล่ะ แล้วข้าเองก็จะไปด้วย จะคอยช่วยเหลือนิดๆหน่อยๆก็ละกัน",
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
      title: "บทที่ 2: ภารกิจแรก",
      easy: {
        dialogues: [
          {
            speaker: "เฟลิส",
            jp: "ก่อนจะไปทำภารกิจ คงต้องให้เจ้าฝึกใช้เวทดูก่อนละนะ",
            bg: "https://files.catbox.moe/b7xb3k.jpg",
          },
          { speaker: "เฟลิส", jp: "อืม แต่เวทมนตร์มันต้องใช้ภาษาของโลกนี้ นี่ข้าต้องคอยบอกทุกคำเลยมั้ยเนี่ย คิดถูกมั้ยนะที่ตามมา" },
          { speaker: "เรา", jp: "อ่อ ภาษาที่เฟลิสพูดตอนเรามาถึงอะหรอ" },
          { speaker: "เฟลิส", jp: "ใช่ นี่ตอนนั้นเจ้าตื่นอยู่หรอเนี่ย!?" },
          { speaker: "เรา", jp: "ก็ไม่เชิง แต่ได้ยินเสียงอยู่" },
          { speaker: "เรา", jp: "รู้สึกว่าภาษาที่เฟลิสใช้ มันเหมือนภาษาญี่ปุ่นของโลกเราเลย" },
          { speaker: "เฟลิส", jp: "ภาษาเดียวกันกับโลกเจ้าหรอ!?! น่าสนใจแหะ แล้วเจ้าพอจะรู้เกี่ยวกับภาษานั้นบ้างมั้ย" },
          { speaker: "เรา", jp: "เมื่อก่อนก็เคยเรียนด้วยตัวเองมาบ้างแต่ก็ได้แค่นิดเดียว ยังไงก็คงต้องให้เฟลิสคอยอยู่ช่วย" },
          { speaker: "เฟลิส", jp: "ก็ได้แต่อย่ามาเรียกใช้ข้ามากไปล่ะ ข้าน่ะมาด้วยเพราะไม่อยากอยู่เตรียมพิธีด้วยเฉยๆหรอกนะ" },
          { speaker: "เฟลิส", jp: "ถ้างั้น เจ้าลองถือไม้กายสิทธิ์ที่ให้ไปขึ้นมาสิ" },
          { speaker: "เฟลิส", jp: "เห็นแก้วน้ำตรงนั้นมั้ย" },
          { speaker: "เฟลิส", jp: "เจ้าลองตั้งสมาธิจดจ่อไปที่แก้ว แล้วลองวาดอักษรสักอย่างเพื่อเติมน้ำลงแก้วดู" },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                {
                  text: "海",
                  isCorrect: false,
                  deathReason: "ปริมาณน้ำที่เสกนั้นมากเกินไป จมน้ำตาย",
                },
                {
                  text: "雨",
                  isCorrect: false,
                  deathReason: "คุณเสียชีวิตจากการพยายามเติมน้ำลงแก้วด้วยฝนจนฝนที่เสกมานั้นก่อให้เกิดน้ำท่วมทั้งพื้นที่จนถึงแก่กรรม",
                },
                { text: "水", isCorrect: true },
                {
                  text: "火",
                  isCorrect: false,
                  deathReason: "คุณเสียชีวิตจากการพยายามเติมน้ำลงแก้วด้วยไฟจนเกิดอัคคีภัยเผาทุกสิ่งราบเป็นหน้ากลอง",
                },
              ],
            },
          },
          {
            speaker: "เฟลิส",
            jp: "ทำได้ดีมาก ข้าว่าแล้วว่าเจ้าเองก็มีพลังเวท แถมยังใช้ได้ไว นี่เจ้าสนใจอยากทำงานกับพวกข้ามั้ย?",
            bg: "https://files.catbox.moe/eyisqb.jpg",
          },
          { speaker: "เรา", jp: "ไม่โว้ยยย!" },
          { speaker: "เฟลิส", jp: "ฮ่าๆ งั้นรีบไปทำภารกิจให้เสร็จกันเถอะ" },
          {
            speaker: "เฟลิส",
            jp: "ที่นี่ล่ะ! บ้านหลังนี้จะเป็นภารกิจแรกของเรา",
            bg: "https://files.catbox.moe/6sx09m.jpg",
          },
          { speaker: "เรา", jp: "ว้าว… บ้านสวยจังเลย" },
          { speaker: "เฟลิส", jp: "เจ้าของบ้านไม่ได้อยู่ที่นี่มานานแล้ว เลยขอให้พวกเรามาช่วยทำความสะอาดให้หน่อยน่ะ" },
          { speaker: "เรา", jp: "อ๋อ เข้าใจแล้ว" },
          {
            speaker: "บรรยาย",
            jp: "เข้าบ้าน",
            bg: "https://files.catbox.moe/j5th0o.jpg",
          },
          { speaker: "เรา", jp: "โอ้โห ฝุ่นเยอะขนาดนี้เลยเหรอเนี่ย " },
          { speaker: "เรา", jp: "เฟลิส นายทำเองคนเดียวไม่ได้เหรอ? ฉันเป็นโรคภูมิแพ้น่ะ แหะ ๆ" },
          { speaker: "เฟลิส", jp: "จะบ้าเหรอ นายต้องช่วยสิ! ใส่หน้ากากไว้ก็แล้วกัน" },
          { speaker: "เรา", jp: "ก็ได้ ๆ เซ้าซี้จัง" },
          { speaker: "เฟลิส", jp: "เอาล่ะ ตั้งสมาธิ แล้วลองใช้เวทมนตร์ดูสิ" },
          {
            speaker: "เรา",
            jp: "เวทมนตร์งั้นเหรอ… แบบนี้สินะ?",
            quiz: {
              choices: [
                {
                  text: "そうじします",
                  isCorrect: true,
                },
                {
                  text: "あらいます",
                  isCorrect: false,
                  deathReason: "คุณล้างฝุ่นอยู่นานแต่ไม่มีวี่แววจะสะอาดคุณจึงเกิดความท้อใจจนถึงแก่กรรม",
                },
                {
                  text: "せんたくします",
                  isCorrect: false,
                  deathReason: "คุณซักฝุ่นอยู่นานแต่ไม่มีวี่แววจะสะอาดคุณจึงเกิดความท้อใจจนถึงแก่กรรม",
                },
              ],
            },
          },
          {
            speaker: "เฟลิส",
            jp: "เยี่ยมมาก เห็นไหมล่ะ พลังเวทของนายใช้ได้ผลจริง ๆ",
            bg: "https://files.catbox.moe/2dx5e3.jpg",
          },
          { speaker: "เรา", jp: " สะอาดขึ้นตั้งเยอะเลย!" },
          { speaker: "เฟลิส", jp: "ไปกันเถอะ ภารกิจต่อไปยังรอเราอยู่" },
          { speaker: "เรา", jp: "ในที่สุด…" },
          { speaker: "เจ้าของบ้าน", jp: "あら！家がきれいになった！" },
          { speaker: "เรา", jp: "เอ๊ะ… เขาพูดว่าอะไรน่ะ?" },
          { speaker: "เฟลิส", jp: "เขาบอกว่า “บ้านสะอาดแล้ว” น่ะ" },
          { speaker: "เจ้าของบ้าน", jp: "手伝ってくれて、ありがとうございます！" },
          { speaker: "เรา", jp: "อ๋อ! เขาขอบคุณเรา… แล้วฉันควรตอบว่าอะไรดี?" },
          {
            speaker: "เฟลิส",
            jp: "ลองเลือกดูสิ!",
            quiz: {
              choices: [
                {
                  text: "どういたしまして。",
                  isCorrect: true,
                },
                {
                  text: "いただきます。",
                  isCorrect: false,
                  deathReason: "คุณอายมากที่เจ้าของบ้านบอกขอบคุณแต่คุณตอบว่าขอรับประทานคุณจึงวิ่งหนีสะดุดล้มเสียชีวิต",
                },
                {
                  text: "おやすみなさい。",
                  isCorrect: false,
                  deathReason: "คุณอายมากที่เจ้าของบ้านบอกขอบคุณแต่คุณตอบว่าฝันดี คุณจึงวิ่งหนีสะดุดล้มเสียชีวิต",
                },
              ],
            },
          },
          { speaker: "เจ้าของบ้าน", jp: "本当にありがとうございます！" },
          { speaker: "เฟลิส", jp: "ดูเหมือนเขาจะดีใจมากเลยนะ" },
          { speaker: "เรา", jp: "แค่พูดภาษาญี่ปุ่นได้สักประโยคก็รู้สึกเก่งขึ้นมาเลยแฮะ…" },
        ],
      },
      hard: {
        dialogues: [
          {
            speaker: "เฟลิส",
            jp: "ก่อนจะไปทำภารกิจ คงต้องให้เจ้าฝึกใช้เวทดูก่อนละนะ",
            bg: "https://files.catbox.moe/b7xb3k.jpg",
          },
          { speaker: "เฟลิส", jp: "อืม แต่เวทมนตร์มันต้องใช้ภาษาของโลกนี้ นี่ข้าต้องคอยบอกทุกคำเลยมั้ยเนี่ย คิดถูกมั้ยนะที่ตามมา" },
          { speaker: "เรา", jp: "อ่อ ภาษาที่เฟลิสพูดตอนเรามาถึงอะหรอ" },
          { speaker: "เฟลิส", jp: "ใช่ นี่ตอนนั้นเจ้าตื่นอยู่หรอเนี่ย!?" },
          { speaker: "เรา", jp: "ก็ไม่เชิง แต่ได้ยินเสียงอยู่" },
          { speaker: "เรา", jp: "รู้สึกว่าภาษาที่เฟลิสใช้ มันเหมือนภาษาญี่ปุ่นของโลกเราเลย" },
          { speaker: "เฟลิส", jp: "ภาษาเดียวกันกับโลกเจ้าหรอ!?! น่าสนใจแหะ แล้วเจ้าพอจะรู้เกี่ยวกับภาษานั้นบ้างมั้ย" },
          { speaker: "เรา", jp: "เมื่อก่อนก็เคยเรียนด้วยตัวเองมาบ้างแต่ก็ได้แค่นิดเดียว ยังไงก็คงต้องให้เฟลิสคอยอยู่ช่วย" },
          { speaker: "เฟลิส", jp: "ก็ได้แต่อย่ามาเรียกใช้ข้ามากไปล่ะ ข้าน่ะมาด้วยเพราะไม่อยากอยู่เตรียมพิธีด้วยเฉยๆหรอกนะ" },
          { speaker: "เฟลิส", jp: "ถ้างั้น เจ้าลองถือไม้กายสิทธิ์ที่ให้ไปขึ้นมาสิ" },
          { speaker: "เฟลิส", jp: "เห็นแก้วน้ำตรงนั้นมั้ย" },
          { speaker: "เฟลิส", jp: "เจ้าลองตั้งสมาธิจดจ่อไปที่แก้ว แล้วลองวาดอักษรสักอย่างเพื่อเติมน้ำลงแก้วดู" },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                {
                  text: "会議",
                  isCorrect: false,
                  deathReason: "คุณพยายามเติมเต็มแก้วน้ำด้วยเวทพูดคุยทำให้ไม่สามารถหยุดพูดได้จนกว่าจะทำภารกิจสำเร็จ คอรวมไปถึงส่วนอื่นๆของร่างกายคุณจึงแห้งราวกับทะเลทราย",
                },
                {
                  text: "燃える",
                  isCorrect: false,
                  deathReason: "คุณพยายามเติมเต็มแก้วน้ำด้วยการร่ายเวทเผาไหม้จนเกิดอัคคีภัย",
                },
                { text: "湯", isCorrect: true },
              ],
            },
          },
          {
            speaker: "เฟลิส",
            jp: "ทำได้ดีมาก ข้าว่าแล้วว่าเจ้าเองก็มีพลังเวท แถมยังใช้ได้ไว นี่เจ้าสนใจอยากทำงานกับพวกข้ามั้ย?",
            bg: "https://files.catbox.moe/eyisqb.jpg",
          },
          { speaker: "เรา", jp: "ไม่โว้ยยย!" },
          { speaker: "เฟลิส", jp: "ฮ่าๆ งั้นรีบไปทำภารกิจให้เสร็จกันเถอะ" },
          {
            speaker: "เฟลิส",
            jp: "ที่นี่ล่ะ! บ้านหลังนี้จะเป็นภารกิจแรกของเรา",
            bg: "https://files.catbox.moe/6sx09m.jpg",
          },
          { speaker: "เรา", jp: "ว้าว… บ้านสวยจังเลย" },
          { speaker: "เฟลิส", jp: "เจ้าของบ้านไม่ได้อยู่ที่นี่มานานแล้ว เลยขอให้พวกเรามาช่วยทำความสะอาดให้หน่อยน่ะ" },
          { speaker: "เรา", jp: "อ๋อ เข้าใจแล้ว" },
          {
            speaker: "บรรยาย",
            jp: "เข้าบ้าน",
            bg: "https://files.catbox.moe/j5th0o.jpg",
          },
          { speaker: "เรา", jp: "โอ้โห ฝุ่นเยอะขนาดนี้เลยเหรอเนี่ย " },
          { speaker: "เรา", jp: "เฟลิส นายทำเองคนเดียวไม่ได้เหรอ? ฉันเป็นโรคภูมิแพ้น่ะ แหะ ๆ" },
          { speaker: "เฟลิส", jp: "จะบ้าเหรอ นายต้องช่วยสิ! ใส่หน้ากากไว้ก็แล้วกัน" },
          { speaker: "เรา", jp: "ก็ได้ ๆ เซ้าซี้จัง" },
          { speaker: "เฟลิส", jp: "เอาล่ะ ตั้งสมาธิ แล้วลองใช้เวทมนตร์ดูสิ" },
          {
            speaker: "เรา",
            jp: "เวทมนตร์งั้นเหรอ… แบบนี้สินะ?",
            quiz: {
              choices: [
                {
                  text: "掃除します",
                  isCorrect: true,
                },
                {
                  text: "洗います",
                  isCorrect: false,
                  deathReason: "คุณล้างฝุ่นอยู่นานแต่ไม่มีวี่แววจะสะอาดคุณจึงเกิดความท้อใจจนถึงแก่กรรม",
                },
                {
                  text: "洗濯します",
                  isCorrect: false,
                  deathReason: "คุณซักฝุ่นอยู่นานแต่ไม่มีวี่แววจะสะอาดคุณจึงเกิดความท้อใจจนถึงแก่กรรม",
                },
              ],
            },
          },
          {
            speaker: "เฟลิส",
            jp: "เยี่ยมมาก เห็นไหมล่ะ พลังเวทของนายใช้ได้ผลจริง ๆ",
            bg: "https://files.catbox.moe/2dx5e3.jpg",
          },
          { speaker: "เรา", jp: " สะอาดขึ้นตั้งเยอะเลย!" },
          { speaker: "เฟลิส", jp: "ไปกันเถอะ ภารกิจต่อไปยังรอเราอยู่" },
          { speaker: "เรา", jp: "ในที่สุด…" },
          { speaker: "เจ้าของบ้าน", jp: "あら！家がきれいになった！" },
          { speaker: "เรา", jp: "เอ๊ะ… เขาพูดว่าอะไรน่ะ?" },
          { speaker: "เฟลิส", jp: "เขาบอกว่า “บ้านสะอาดแล้ว” น่ะ" },
          { speaker: "เจ้าของบ้าน", jp: "皆さんのおかげで、本当に助かりました！" },
          { speaker: "เรา", jp: "อ๋อ! เขาขอบคุณเรา… แล้วฉันควรตอบว่าอะไรดี?" },
          {
            speaker: "เฟลิส",
            jp: "ลองเลือกดูสิ!",
            quiz: {
              choices: [
                {
                  text: "どういたしまして。",
                  isCorrect: true,
                },
                {
                  text: "お世話になりました。",
                  isCorrect: false,
                  deathReason: "คุณอายมากที่เจ้าของบ้านบอกขอบคุณแต่คุณตอบว่าขอบคุณที่ดูแล คุณจึงวิ่งหนีสะดุดล้มเสียชีวิต",
                },
                {
                  text: "遠慮しないでください。",
                  isCorrect: false,
                  deathReason: "คุณอายมากที่เจ้าของบ้านบอกขอบคุณแต่คุณตอบว่าเชิญตามสบายคุณจึงวิ่งหนีสะดุดล้มเสียชีวิต",
                },
              ],
            },
          },
          { speaker: "เจ้าของบ้าน", jp: "本当に感謝しています。ありがとうございます！" },
          { speaker: "เฟลิส", jp: "ดูเหมือนเขาจะดีใจมากเลยนะ" },
          { speaker: "เรา", jp: "แค่พูดภาษาญี่ปุ่นได้สักประโยคก็รู้สึกเก่งขึ้นมาเลยแฮะ…" },
        ],
      },
    },
    stage3: {
      name: "บทที่ 3",
      title: "บทที่ 3: จะทั้งวันก็แล้วแต่",
      easy: {
        dialogues: [
          {
            speaker: "เฟลิส",
            jp: "กลางทุ่งหญ้านี่แหละ ที่เราจะมาตามหาสมุนไพรที่ต้องการ สมุนไพรที่เราต้องการคือ “มินต์” ลองดูแถว ๆ นี้สิ!",
            bg: "https://files.catbox.moe/i8ry52.jpg",
          },
          {
            speaker: "เรา",
            jp: "มินต์เหรอ? แต่ทุ่งกว้างขนาดนี้ จะรู้ได้ยังไงว่าต้นไหนคือมินต์ล่ะ?",
          },
          {
            speaker: "เฟลิส",
            jp: "ไม่ต้องห่วง ร่ายเวทมนตร์ค้นหาดูสิ เดี๋ยวก็รู้เองน่า",
          },
          {
            speaker: "เรา",
            jp: "อะไรนะ? นี่ฉันต้องทำเองอีกแล้วเหรอ?",
          },
          {
            speaker: "เฟลิส",
            jp: "ก็ใช่น่ะสิ! หรืออยากเดินหาไปทีละต้นจนพระอาทิตย์ตก?",
          },
          {
            speaker: "เรา",
            jp: "…โอเค ๆ ก็ได้",
            quiz: {
              choices: [
                {
                  text: "しらべます",
                  isCorrect: false,
                  deathReason: "คำนี้แปลว่า 'ตรวจสอบ' คุณก้มหน้าก้มตาตรวจสอบหญ้าทีละใบจนหมดแรงสลบคาทุ่งหญ้า",
                },
                {
                  text: "さがします",
                  isCorrect: true,
                },
              ],
            },
          },
          {
            speaker: "บรรยาย",
            jp: "เวทมนตร์ทำงาน จุดแสงสว่างปรากฏขึ้นกลางทุ่ง",
            bg: "https://files.catbox.moe/ehx9fx.jpg",
          },
          {
            speaker: "เรา",
            jp: "โอ๊ะ! มีแสงขึ้นมาด้วย!",
          },
          {
            speaker: "เฟลิส",
            jp: "เห็นตรงนั้นไหม? จุดที่มีแสงสว่างอยู่ นั่นแหละ ต้นมินต์อยู่ตรงนั้น",
          },
          {
            speaker: "เรา",
            jp: "โห มีตั้งเยอะเลยนี่นา… เราต้องเก็บทีละต้นเลยเหรอ?",
          },
          {
            speaker: "เฟลิส",
            jp: "ถ้าอยากใช้เวลาทั้งวันก็เชิญเลย",
          },
          {
            speaker: "เรา",
            jp: "งั้นไม่เอาดีกว่า…",
          },
          {
            speaker: "เฟลิส",
            jp: "ฮึ ๆ งั้นก็ใช้เวทมนตร์รวบรวมสิ",
          },
          {
            speaker: "เรา",
            jp: "อันนี้ฉันเริ่มชินแล้วนะ",
          },
          {
            speaker: "เฟลิส",
            jp: "อย่าเพิ่งมั่นใจนัก ลองเลือกให้ถูกก่อนเถอะ",
          },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                {
                  text: "あらいます",
                  isCorrect: false,
                  deathReason: "คำนี้แปลว่า 'ล้าง' มวลน้ำมหาศาลพัดกวาดทุ่งหญ้าจนคุณสำลักน้ำสิ้นใจ",
                },
                {
                  text: "あつめます",
                  isCorrect: true,
                },
                {
                  text: "すてます",
                  isCorrect: false,
                  deathReason: "คำนี้แปลว่า 'ทิ้ง' เวทผลักดันมินต์ทั้งหมดปลิวกระเด็นหายไป คุณท้อแท้จนหมดลมหายใจ",
                },
              ],
            },
          },
          {
            speaker: "บรรยาย",
            jp: "ต้นมินต์ค่อย ๆ ลอยขึ้นและถูกรวบรวมเข้ามา",
          },
          {
            speaker: "เรา",
            jp: "ว้าว! มาเองหมดเลย!",
            bg: "https://files.catbox.moe/hbso3b.jpg",
          },
          {
            speaker: "เฟลิส",
            jp: "เห็นไหมล่ะ ง่ายนิดเดียวเอง",
          },
          {
            speaker: "เรา",
            jp: "ถ้าอย่างนั้น… ต่อไปมีอะไรให้ทำอีก?",
          },
          {
            speaker: "เฟลิส",
            jp: "เดี๋ยวก็รู้เองน่า",
          },
          {
            speaker: "เรา",
            jp: "ฟังดูไม่น่าไว้ใจเลยแฮะ…",
          },
          {
            speaker: "เฟลิส",
            jp: "เยี่ยม! ทีนี้เราก็ได้มินต์ครบแล้ว",
          },
          {
            speaker: "เรา",
            jp: "โห… เวทมนตร์นี่ก็สะดวกดีเหมือนกัน",
          },
        ],
      },
      hard: {
        dialogues: [
          {
            speaker: "เฟลิส",
            jp: "กลางทุ่งหญ้านี่แหละ ที่เราจะมาตามหาสมุนไพรที่ต้องการ สมุนไพรที่เราต้องการคือ “มินต์” ลองดูแถว ๆ นี้สิ!",
            bg: "https://files.catbox.moe/i8ry52.jpg",
          },
          {
            speaker: "เรา",
            jp: "มินต์เหรอ? แต่ทุ่งกว้างขนาดนี้ จะรู้ได้ยังไงว่าต้นไหนคือมินต์ล่ะ?",
          },
          {
            speaker: "เฟลิส",
            jp: "ไม่ต้องห่วง ร่ายเวทมนตร์ค้นหาดูสิ เดี๋ยวก็รู้เองน่า",
          },
          {
            speaker: "เรา",
            jp: "อะไรนะ? นี่ฉันต้องทำเองอีกแล้วเหรอ?",
          },
          {
            speaker: "เฟลิส",
            jp: "ก็ใช่น่ะสิ! หรืออยากเดินหาไปทีละต้นจนพระอาทิตย์ตก?",
          },
          {
            speaker: "เรา",
            jp: "…โอเค ๆ ก็ได้",
            quiz: {
              choices: [
                {
                  text: "調べます",
                  isCorrect: false,
                  deathReason: "คำนี้แปลว่า 'ตรวจสอบ' คุณก้มหน้าก้มตาตรวจสอบหญ้าทีละใบจนหมดแรงสลบคาทุ่งหญ้า",
                },
                {
                  text: "探します",
                  isCorrect: true,
                },
              ],
            },
          },
          {
            speaker: "บรรยาย",
            jp: "เวทมนตร์ทำงาน จุดแสงสว่างปรากฏขึ้นกลางทุ่ง",
            bg: "https://files.catbox.moe/ehx9fx.jpg",
          },
          {
            speaker: "เรา",
            jp: "โอ๊ะ! มีแสงขึ้นมาด้วย!",
          },
          {
            speaker: "เฟลิส",
            jp: "เห็นตรงนั้นไหม? จุดที่มีแสงสว่างอยู่ นั่นแหละ ต้นมินต์อยู่ตรงนั้น",
          },
          {
            speaker: "เรา",
            jp: "โห มีตั้งเยอะเลยนี่นา… เราต้องเก็บทีละต้นเลยเหรอ?",
          },
          {
            speaker: "เฟลิส",
            jp: "ถ้าอยากใช้เวลาทั้งวันก็เชิญเลย",
          },
          {
            speaker: "เรา",
            jp: "งั้นไม่เอาดีกว่า…",
          },
          {
            speaker: "เฟลิส",
            jp: "ฮึ ๆ งั้นก็ใช้เวทมนตร์รวบรวมสิ",
          },
          {
            speaker: "เรา",
            jp: "อันนี้ฉันเริ่มชินแล้วนะ",
          },
          {
            speaker: "เฟลิส",
            jp: "อย่าเพิ่งมั่นใจนัก ลองเลือกให้ถูกก่อนเถอะ",
          },
          {
            speaker: "เรา",
            jp: ".............",
            quiz: {
              choices: [
                {
                  text: "洗います",
                  isCorrect: false,
                  deathReason: "คำนี้แปลว่า 'ล้าง' มวลน้ำมหาศาลพัดกวาดทุ่งหญ้าจนคุณสำลักน้ำสิ้นใจ",
                },
                {
                  text: "集めます",
                  isCorrect: true,
                },
                {
                  text: "捨てます",
                  isCorrect: false,
                  deathReason: "คำนี้แปลว่า 'ทิ้ง' เวทผลักดันมินต์ทั้งหมดปลิวกระเด็นหายไป คุณท้อแท้จนหมดลมหายใจ",
                },
              ],
            },
          },
          {
            speaker: "บรรยาย",
            jp: "ต้นมินต์ค่อย ๆ ลอยขึ้นและถูกรวบรวมเข้ามา",
          },
          {
            speaker: "เรา",
            jp: "ว้าว! มาเองหมดเลย!",
            bg: "https://files.catbox.moe/hbso3b.jpg",
          },
          {
            speaker: "เฟลิส",
            jp: "เห็นไหมล่ะ ง่ายนิดเดียวเอง",
          },
          {
            speaker: "เรา",
            jp: "ถ้าอย่างนั้น… ต่อไปมีอะไรให้ทำอีก?",
          },
          {
            speaker: "เฟลิส",
            jp: "เดี๋ยวก็รู้เองน่า",
          },
          {
            speaker: "เรา",
            jp: "ฟังดูไม่น่าไว้ใจเลยแฮะ…",
          },
          {
            speaker: "เฟลิส",
            jp: "เยี่ยม! ทีนี้เราก็ได้มินต์ครบแล้ว",
          },
          {
            speaker: "เรา",
            jp: "โห… เวทมนตร์นี่ก็สะดวกดีเหมือนกัน",
          },
        ],
      },
    },
    stage4: { name: "บทที่ 4", title: "บทที่ 4: โกสต์ป่ะคะ" },
    stage5: { name: "บทที่ 5", title: "บทที่ 5: ขอยาดซิ่ง" },
  },
};

/* ==========================================================================
   รูปโปรไฟล์ตัวละคร
   ========================================================================== */
const characterImages = {
  เรา: "https://files.catbox.moe/lmt9pj.PNG",
  เฟลิส: "https://files.catbox.moe/tkhyjx.PNG",
  "ชาวบ้าน A": "",
  "ชาวบ้าน B": "",
  "ชาวบ้าน C": "",
  "???": "https://files.catbox.moe/tkhyjx.PNG",
  บรรยาย: "",
  "เจ้าของบ้าน": "",
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
  maxLives = diff === "easy" ? 2 : 1;
  playerLives = maxLives;
  
  const badge = document.getElementById("diff-badge");
  if (badge) badge.innerText = diff === "easy" ? "EASY" : "HARD";
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
      if (lockIcon) lockIcon.innerText = "LOCKED";
    }
  });
}

// อัปเดตแถบหัวใจตามพลังชีวิตสูงสุดของโหมด
function updateLivesUI(show = true) {
  const livesEl = document.getElementById("player-lives");
  if (!livesEl) return;
  if (!show) {
    livesEl.classList.add("hidden");
    return;
  }
  livesEl.classList.remove("hidden");
  let heartsHtml = "";
  for (let i = 0; i < maxLives; i++) {
    if (i < playerLives) {
      heartsHtml += `<span class="heart">❤️</span>`;
    } else {
      heartsHtml += `<span class="heart lost">🖤</span>`;
    }
  }
  livesEl.innerHTML = heartsHtml;
}

function startStage(stageKey) {
  const targetIndex = stageOrder.indexOf(stageKey);
  if (targetIndex > unlockedStageIndex) {
    showGameNotification("บทนี้ถูกล็อกอยู่ เคลียร์บทก่อนหน้าก่อนนะจ๊ะ");
    return;
  }
  currentStageId = stageKey;
  currentDialogueIndex = 0;
  playerLives = maxLives;
  updateLivesUI(false);
  
  const stage = gameData.stages[stageKey];
  if (!stage || (!stage.dialogues && !stage[currentDifficulty]?.dialogues)) {
    showGameNotification("กำลังพัฒนาจ้าใจเย็นๆน้า");
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

// สุ่มลำดับ Array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// แสดงช้อยส์ สุ่มตำแหน่งข้อ และหน่วงเวลาล็อกคลิก 450ms กันนิ้วลั่น
function showQuizChoices(quiz) {
  const quizContainer = document.getElementById("quiz-choices");
  const btnNext = document.getElementById("btn-next");
  const portraitBox = document.querySelector(".portrait-box");

  if (!quizContainer || !btnNext) return;
  quizContainer.innerHTML = "";
  quizContainer.classList.remove("hidden");
  btnNext.classList.add("hidden");

  if (portraitBox) {
    portraitBox.style.display = "none";
  }

  const randomizedChoices = shuffleArray(quiz.choices);

  randomizedChoices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "btn-choice";
    btn.innerText = choice.text;
    btn.disabled = true;
    btn.style.pointerEvents = "none";

    btn.onclick = () => handleChoice(choice, btn);
    quizContainer.appendChild(btn);
  });

  setTimeout(() => {
    const allChoiceBtns = quizContainer.querySelectorAll(".btn-choice");
    allChoiceBtns.forEach((btn) => {
      btn.disabled = false;
      btn.style.pointerEvents = "auto";
    });
  }, 450);
}

function renderDialogue() {
  const dialogue = currentDialogueList[currentDialogueIndex];
  if (!dialogue) {
    completeCurrentStage();
    return;
  }

  if (dialogue.quiz) {
    updateLivesUI(true);
  } else {
    updateLivesUI(false);
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
    if (dialogue.quiz || dialogue.speaker === "บรรยาย") {
      portraitBox.style.display = "none";
    } else {
      portraitBox.style.display = "flex";
    }
  }

  const imgSrc = characterImages[dialogue.speaker];

  if (portraitFrame && portraitImg) {
    if (imgSrc) {
      portraitImg.src = imgSrc;
      portraitFrame.style.display = "flex";
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

// จัดการตัวเลือก ตอบผิดลดเลือด ล็อกปุ่มไม่ให้กดซ้ำ (ไม่ขีดฆ่า)
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
    playerLives--;
    updateLivesUI(true);

    if (clickedBtn) {
      clickedBtn.disabled = true;
      clickedBtn.style.opacity = "0.5";
      clickedBtn.style.borderColor = "#e74c3c";
    }

    showGameNotification(choice.deathReason || "ตอบผิด! เสียพลังชีวิต 1 ดวง");

    if (playerLives <= 0) {
      setTimeout(() => {
        triggerGameOver(
          choice.deathReason || "พลังชีวิตหมดสิ้น! ใช้ภาษาผิดพลาดจนถึงแก่กรรม",
        );
      }, 800);
    }
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

// ฟังก์ชันสร้างและแสดงประวัติการสนทนาย้อนหลัง
function renderDialogueLog() {
  const container = document.getElementById("log-content-list");
  if (!container) return;
  container.innerHTML = "";

  const pastDialogues = currentDialogueList.slice(0, currentDialogueIndex + 1);
  if (pastDialogues.length === 0) {
    container.innerHTML = `<div class="log-empty">ยังไม่มีประวัติการสนทนา</div>`;
    return;
  }

  pastDialogues.forEach((d) => {
    if (!d.jp && !d.text) return;

    const entry = document.createElement("div");
    entry.className = "log-entry";

    const speaker = document.createElement("div");
    speaker.className = "log-speaker";
    speaker.innerText = d.speaker || "บรรยาย";

    const text = document.createElement("div");
    text.className = "log-text";
    text.innerText = d.jp || "";

    entry.appendChild(speaker);
    entry.appendChild(text);
    container.appendChild(entry);
  });

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
}

function switchGlossaryTab(stageKey) {
  currentGlossaryTab = stageKey;
  document.querySelectorAll(".stage-tabs .tab-btn").forEach((btn, index) => {
    const isTarget = stageOrder[index] === stageKey;
    btn.classList.toggle("active", isTarget);
  });
  renderGlossaryAccordion();
}

function renderGlossaryAccordion() {
  const container = document.getElementById("glossary-accordion-container");
  if (!container) return;
  container.innerHTML = "";

  const stageData = gameData.glossary[currentGlossaryTab] || { easy: [], hard: [] };

  const sections = [
    { title: "คันจิ N5", data: stageData.easy || [] },
    { title: "คันจิ N4 - N3", data: stageData.hard || [] }
  ];

  sections.forEach((sec) => {
    const group = document.createElement("div");
    group.className = "accordion-group";

    const headerBtn = document.createElement("button");
    headerBtn.className = "accordion-header";
    headerBtn.type = "button";
    headerBtn.innerHTML = `
      <span>${sec.title}</span>
      <span class="accordion-arrow">▼</span>
    `;

    const bodyDiv = document.createElement("div");
    bodyDiv.className = "accordion-body";

    if (sec.data.length === 0) {
      bodyDiv.innerHTML = `<div class="vocab-empty">ยังไม่มีคำศัพท์คันจิในส่วนนี้</div>`;
    } else {
      const ul = document.createElement("ul");
      ul.className = "accordion-list";

      sec.data.forEach((item) => {
        const li = document.createElement("li");
        li.className = "vocab-row";
        li.innerHTML = `
          <span class="vocab-kanji">${item.kanji}</span>
          <span class="vocab-furi">${item.furi}</span>
          <span class="vocab-meaning">${item.th}</span>
        `;
        ul.appendChild(li);
      });
      bodyDiv.appendChild(ul);
    }

    headerBtn.onclick = () => {
      group.classList.toggle("open");
    };

    group.appendChild(headerBtn);
    group.appendChild(bodyDiv);
    container.appendChild(group);
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

  // ผูกปุ่มเปิด-ปิดคู่มือการเล่น (How to Play)
  const btnGuideMain = document.getElementById("btn-guide-main");
  const btnCloseGuide = document.getElementById("btn-close-guide");
  const modalGuide = document.getElementById("modal-guide");

  if (btnGuideMain && modalGuide) {
    btnGuideMain.onclick = () => {
      modalGuide.classList.remove("hidden");
    };
  }
  if (btnCloseGuide && modalGuide) {
    btnCloseGuide.onclick = () => {
      modalGuide.classList.add("hidden");
    };
  }

  // ผูกปุ่มเปิด-ปิดประวัติการสนทนา (Log)
  const btnLog = document.getElementById("btn-log");
  const btnCloseLog = document.getElementById("btn-close-log");
  const modalLog = document.getElementById("modal-log");

  if (btnLog && modalLog) {
    btnLog.onclick = () => {
      renderDialogueLog();
      modalLog.classList.remove("hidden");
    };
  }
  if (btnCloseLog && modalLog) {
    btnCloseLog.onclick = () => {
      modalLog.classList.add("hidden");
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

  updateStageMapUI();
}

window.switchGlossaryTab = switchGlossaryTab;
window.showScreen = showScreen;
window.selectDifficulty = selectDifficulty;

initGame();
