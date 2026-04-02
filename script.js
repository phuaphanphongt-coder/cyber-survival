// === 0. SOUND & SYSTEM ===
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

let masterVolume = 0.5; 
let previousVolume = 0.5; 

let currentLang = 'th'; 

const externalFailSound = new Audio('Fail.mp3'); 
const externalFireworkSound = new Audio('Firework.mp3');

function toggleMute() {
    const volIcon = document.getElementById('vol-icon');
    const volSlider = document.getElementById('volumeSlider');
    
    if (masterVolume > 0) {
        previousVolume = masterVolume; 
        masterVolume = 0;
        volSlider.value = 0;
        volIcon.innerText = '🔇';
    } else {
        masterVolume = previousVolume > 0 ? previousVolume : 0.5; 
        volSlider.value = masterVolume;
        volIcon.innerText = masterVolume < 0.5 ? '🔉' : '🔊';
        playSound('click'); 
    }
}

document.getElementById('volumeSlider').oninput = function() {
    masterVolume = parseFloat(this.value);
    document.getElementById('vol-icon').innerText = masterVolume === 0 ? "🔇" : "🔊";
};

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSound(type) {
    if (!audioCtx || masterVolume === 0) return;
    const now = audioCtx.currentTime;
    const gainNode = audioCtx.createGain();
    const osc = audioCtx.createOscillator();
    
    const applyVol = (v) => gainNode.gain.setValueAtTime(v * masterVolume * 0.4, now);

    if (type === 'click') { 
        osc.connect(gainNode); gainNode.connect(audioCtx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(500, now); applyVol(0.2); osc.start(now); osc.stop(now + 0.15); 
    }
    else if (type === 'spin') { 
        osc.connect(gainNode); gainNode.connect(audioCtx.destination);
        osc.type = 'triangle'; osc.frequency.setValueAtTime(700, now); applyVol(0.05); osc.start(now); osc.stop(now + 0.1); 
    }
    else if (type === 'correct') { 
        osc.connect(gainNode); gainNode.connect(audioCtx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(1000, now + 0.2); applyVol(0.2); osc.start(now); osc.stop(now + 0.3); 
    }
    else if (type === 'wrong') { 
        osc.connect(gainNode); gainNode.connect(audioCtx.destination);
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(250, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.4); applyVol(0.15); osc.start(now); osc.stop(now + 0.5); 
    }
    else if (type === 'firework') {
        if (masterVolume === 0) return;
        externalFireworkSound.volume = masterVolume * 0.5;
        externalFireworkSound.currentTime = 0;
        externalFireworkSound.play().catch(e => console.log("Audio error:", e));
    }
    else if (type === 'fail') {
        if (masterVolume === 0) return;
        externalFailSound.volume = masterVolume * 0.3;
        externalFailSound.currentTime = 0;
        externalFailSound.play().catch(e => console.log("Audio error:", e));
    }
}

// === 1. DATA & LANGUAGES ===
const uiDict = {
    th: {
        subtitle: "ตอบคำถามการเอาตัวรอดจาก Malware", 
        welcome: "พร้อมตอบคำถามการเอาตัวรอดจากการโดนไวรัส Malware หรือยัง?",
        startBtn: "ลุยเลย รออะไร!", spinBtn: "🔥 สแกนไวรัสอันดับ ", scoreLabel: "แต้ม: ",
        progress: "ด่านที่ ", endTitleWin: "SYSTEM SECURED! ปลอดภัยไร้ไวรัส", endTitleLose: "SYSTEM CRASHED! เครื่องพังซะงั้น",
        nextBtn: "➡️ กู้ระบบด่านต่อไป!", finishBtn: "📊 ดูผลสรุป", 
        dateTime: "วันที่:", totalScore: "คะแนนรวม:", timeSpent: "เวลาที่ใช้:", surviveRate: "อัตราการรอด:",
        rankTitle: "ระดับการเอาตัวรอดของคุณ", btnSave: "📸 บันทึกรูป", btnRestart: "🔄 เริ่มเล่นใหม่"
    },
    en: {
        subtitle: "Top 10 Malware Attacks You Must Survive!", 
        welcome: "Are you ready to answer the question of how to survive being infected with a malware virus?",
        startBtn: "Boot System!", spinBtn: "🔥 Scan Threat #", scoreLabel: "Score: ",
        progress: "Level ", endTitleWin: "SYSTEM SECURED!", endTitleLose: "SYSTEM CRASHED!",
        nextBtn: "➡️ Next Threat!", finishBtn: "📊 See Scan Results",
        dateTime: "Date:", totalScore: "Total Score:", timeSpent: "Time Spent:", surviveRate: "Survival Rate:",
        rankTitle: "Your Cybersecurity Rank", btnSave: "📸 Save Image", btnRestart: "🔄 Replay"
    }
};

const feedbackMessages = {
    th: {
        correct: [
            "เฉียบ! มิจจี้ถึงกับกำหมัด 😡", 
            "ตาไวเกิน! 🛡️", 
            "ตึงจัด! เล่นเอามิจจี้ไปไม่เป็นเลย 😎", 
            "สมองระดับโหดเลยพี่ 🧠",
            "อย่างเอาเลยพี่🤸‍♂️"
        ],
        wrong: [
            "อ้าวเฮ้ย! โดนตกซะงั้น  🎣", 
            "มิจจี้ยิ้มกริ่มเลยงานนี้ กำหมัดละนะ 😈", 
            "ใจเย็นๆ อ่านดีๆก่อนกดสิ 🧐", 
            "พลาดไปหนึ่ง! 💔",
            "เรียบร้อย มิจจี้กุมขมับละ 💸"
        ]
    },
    en: {
        correct: [
            "Nice one! Scammers are crying right now 😡", 
            "Sharp eyes! 🛡️", 
            "Too good! Scammers got nothing on you 😎", 
            "Galaxy brain!  🧠",
            "Awesome!🤸‍♂️"
        ],
        wrong: [
            "Bruh! You just got baited 🎣", 
            "Scammers are smirking 😈", 
            "Chill! Read carefully before you click 🧐", 
            "Wasted! 💔",
            "RIP. You fell right into it 💸"
        ]
    }
};

// คลังคำถาม 10 อันดับ Malware (กลับมาใช้ Emoji)
const scenarios = [
    { icon: "🪩", title_th: "ไวรัสซ่อนแอบ (Trojan Horse)", title_en: "Threat 1: Trojan Horse", 
      th: "โหลดโปรแกรมเถื่อน 'Photoshop แคร็กฟรี' มาติดตั้ง จู่ๆ เครื่องก็รวนแถมมีโปรแกรมแปลกๆ โผล่มาเต็มเครื่อง", 
      en: "Downloaded a 'Free Photoshop Crack'. Suddenly, PC acts weird and weird apps appear.",
      options: [{ th: "ปิดแอนตี้ไวรัส เพื่อให้ติดตั้งแคร็กให้เสร็จ", en: "Turn off antivirus so the crack can finish installing", score: 0 }, 
                { th: "ลบไฟล์ทิ้งทันที แล้วสั่ง Full Scan ด้วยแอนตี้ไวรัส", en: "Delete immediately and run a Full Antivirus Scan", score: 10 }, 
                { th: "แค่ปิดโปรแกรมแปลกๆ ทิ้งแล้วรีสตาร์ทคอมพอ", en: "Just close the weird apps and restart PC", score: 5 }]
    },
    { icon: "🪩", title_th: "นักแอบดู (Spyware)", title_en: "Threat 2: Spyware", 
      th: "เล่นเน็ตคาเฟ่ สังเกตว่าตอนพิมพ์รหัสผ่าน Facebook เครื่องกระตุกแปลกๆ เหมือนโดนดักจับการพิมพ์ (Keylogger)", 
      en: "At a cyber cafe, typing your password feels laggy. Might be a Keylogger!",
      options: [{ th: "ช่างมัน รีบๆ ล็อกอินรีบๆ เล่น", en: "Ignore it, just log in quickly", score: 0 }, 
                { th: "ไม่ล็อกอินเด็ดขาด! แล้วใช้เน็ตมือถือตัวเองเปลี่ยนรหัสผ่าน", en: "Don't log in! Use mobile data to change password.", score: 10 }, 
                { th: "พิมพ์หลอกๆ สลับช่องไปมาให้โปรแกรมงง", en: "Type randomly across fields to confuse it", score: 5 }]
    },
    { icon: "🪩", title_th: "โฆษณานรก (Adware)", title_en: "Threat 3: Adware", 
      th: "เปิดเบราว์เซอร์แล้วหน้าแรกเปลี่ยนไปเอง แถมมีป๊อปอัปโฆษณาเว็บพนันเด้งรัวๆ จนคอมค้าง", 
      en: "Browser homepage changed magically and flooded with gambling pop-up ads.",
      options: [{ th: "กดคลิกโฆษณาดูเผื่อมีอะไรน่าสนใจ", en: "Click the ads to see what they are selling", score: 0 }, 
                { th: "ลบ Extension แปลกๆ ในเบราว์เซอร์ แล้วรัน Anti-Malware", en: "Remove weird extensions and run Anti-Malware.", score: 10 }, 
                { th: "พยายามกดกากบาท (X) ปิดโฆษณาทีละอัน", en: "Try to manually close all pop-ups one by one", score: 5 }]
    },
    { icon: "🪩", title_th: "หนอนชอนไช (Worm)", title_en: "Threat 4: Computer Worm", 
      th: "เสียบแฟลชไดรฟ์เพื่อนเข้าคอมปุ๊บ ไฟล์งานทั้งหมดกลายเป็นไอคอน Shortcut ลูกศรโค้งๆ หมดเลย!", 
      en: "Plugged in a friend's USB, suddenly all your files turn into shortcuts!",
      options: [{ th: "ดับเบิลคลิกที่ Shortcut เพื่อเปิดหาไฟล์งาน", en: "Double-click the shortcuts to find your files", score: 0 }, 
                { th: "ห้ามคลิกเด็ดขาด! รีบสั่งสแกนไวรัสในแฟลชไดรฟ์ด่วน", en: "DON'T click! Scan the USB with antivirus immediately.", score: 10 }, 
                { th: "ฟอร์แมต (Format) แฟลชไดรฟ์ทิ้งไปเลย", en: "Format the USB drive without checking", score: 5 }]
    },
    { icon: "🪩", title_th: "กองทัพซอมบี้ (Botnet)", title_en: "Threat 5: Botnet", 
      th: "กล้องวงจรปิด (IP Camera) ที่บ้านหมุนเองได้ แถมเน็ตบ้านช้าอืดเหมือนโดนดึงดึงแบนด์วิดท์ไปยิงเว็บคนอื่น (DDoS)", 
      en: "Smart IP camera moves on its own and home internet is super slow. Might be part of a Botnet!",
      options: [{ th: "ปล่อยไว้ เดี๋ยวมันก็กลับมาปกติเอง", en: "Leave it alone, it will fix itself", score: 0 }, 
                { th: "ถอดปลั๊ก รีเซ็ตเครื่อง และเปลี่ยนรหัสผ่าน Default ทันที", en: "Unplug, factory reset, and change default password.", score: 10 }, 
                { th: "เอาเทปกาวดำไปแปะหน้ากล้องไว้", en: "Put a black tape over the camera lens", score: 5 }]
    },
    { icon: "🪩", title_th: "แอบขุดเหรียญ (Cryptojacking)", title_en: "Threat 6: Cryptojacking", 
      th: "เข้าเว็บดูหนังเถื่อนฟรี จู่ๆ พัดลมโน้ตบุ๊กดังลั่นเหมือนเครื่องบินเจ็ท CPU พุ่ง 100% แม้ไม่ได้เปิดโปรแกรมอื่น", 
      en: "Visiting a free streaming site, laptop fan goes crazy (100% CPU usage) mining crypto.",
      options: [{ th: "ปล่อยเครื่องค้างไว้ ดูหนังต่อให้จบ", en: "Let it run and finish watching the movie", score: 0 }, 
                { th: "ปิดแท็บเบราว์เซอร์นั้นทิ้งทันที และติดตั้งส่วนเสริมบล็อกสคริปต์", en: "Close tab instantly and install a script blocker.", score: 10 }, 
                { th: "ย่อหน้าจอเว็บลง แล้วเปิดเกมเล่นแก้เซ็ง", en: "Minimize the browser and open a game", score: 5 }]
    },
    { icon: "🪩", title_th: "วิญญาณซ่อนแอบ (Rootkit)", title_en: "Threat 7: Rootkit", 
      th: "แอนตี้ไวรัสถูกปิดการทำงานเอง คอมช้าผิดปกติ แต่พอกดสแกนหาไวรัสกลับเจอ 0 ตัว! มันซ่อนลึกระดับ OS", 
      en: "Antivirus keeps turning off, PC is slow, but scans show 0 viruses. It's hiding deep!",
      options: [{ th: "คิดว่า Windows อัปเดต เลยปล่อยผ่าน", en: "Assume it's a Windows update and ignore", score: 0 }, 
                { th: "เข้า Safe Mode หรือใช้ Antivirus แบบ Bootable USB มาสแกน", en: "Boot into Safe Mode or use Bootable Antivirus USB.", score: 10 }, 
                { th: "ลบโปรแกรมแอนตี้ไวรัสแล้วลงใหม่", en: "Uninstall and reinstall the same antivirus", score: 5 }]
    },
    { icon: "🪩", title_th: "แอปดูดข้อมูล (Malicious App)", title_en: "Threat 8: Mobile Malware", 
      th: "โหลดแอป 'เครื่องคิดเลข' แบบไฟล์ .apk นอกสโตร์ แต่ตอนเปิดแอปมันขอสิทธิ์เข้าถึง SMS และรายชื่อผู้ติดต่อ", 
      en: "Downloaded a 'Calculator' .apk, but it asks for SMS and Contacts permissions.",
      options: [{ th: "กดยอมรับสิทธิ์ไปเลย จะได้รีบใช้แอป", en: "Allow all permissions to use it quickly", score: 0 }, 
                { th: "ปฏิเสธการให้สิทธิ์ และลบแอปทิ้งทันที! เครื่องคิดเลขไม่จำเป็นต้องอ่าน SMS", en: "Deny permissions and uninstall! Calculators don't need SMS.", score: 10 }, 
                { th: "อนุญาตแค่รายชื่อผู้ติดต่อ ไม่อนุญาต SMS", en: "Allow only Contacts, deny SMS", score: 5 }]
    },
    { icon: "🪩", title_th: "หลอกให้กลัว (Scareware)", title_en: "Threat 9: Scareware", 
      th: "มีหน้าต่างสีแดงเด้งขึ้นมาเตือนว่า 'PC ของคุณติดไวรัส 39 ตัว! โปรดดาวน์โหลด PC Optimizer ด่วน'", 
      en: "Red popup says 'Your PC has 39 viruses! Download PC Optimizer NOW!'",
      options: [{ th: "ตกใจ รีบกดดาวน์โหลดแอปมาสแกนเครื่อง", en: "Panic and download the app to scan", score: 0 }, 
                { th: "กด Alt+F4 ปิดเบราว์เซอร์ทิ้ง มันคือหน้าเว็บหลอกลวง", en: "Force close the browser (Alt+F4). It's a fake site.", score: 10 }, 
                { th: "โหลดมาเก็บไว้ในเครื่องก่อน แต่ยังไม่ติดตั้ง", en: "Download the file but don't install it yet", score: 5 }]
    },
    { icon: "🪩", title_th: "มัลแวร์เรียกค่าไถ่ (Ransomware)", title_en: "Threat 10: Ransomware", 
      th: "เปิดคอมมาเจอหน้าจอแดงเถือก ไฟล์รูปและงานโดนล็อกรหัสผ่านทั้งหมด พร้อมข้อความขู่ให้จ่าย Bitcoin เพื่อปลดล็อก!", 
      en: "Screen turns red, all files are encrypted. Demands Bitcoin to unlock your data!",
      options: [{ th: "ยอมโอน Bitcoin จ่ายค่าไถ่ หวังว่าจะได้ไฟล์คืน", en: "Pay the ransom and hope they unlock it", score: 0 }, 
                { th: "ตัดการเชื่อมต่ออินเทอร์เน็ตทันที! แล้วล้างเครื่องดึงไฟล์จาก Backup", en: "Disconnect from network instantly! Format and restore backup.", score: 10 }, 
                { th: "ค้นหา Google หาวิธีถอดรหัสผ่านด้วยตัวเอง", en: "Search Google for decryption tools", score: 5 }]
    }
];

// === 2. GAME STATE ===
let currentLevel = 1;
const MAX_LEVEL = 10; 
let totalScore = 0;
let isSpinning = false;
let lives = 4;
let totalSeconds = 0;
let totalTimer;
let isTransitioning = false; 
let currentFeedbackType = null; 
let currentFeedbackIndex = 0;   
let gameEndTime = null; 

let questionTimer;
let endTime = 0;
const TIME_LIMIT_MS = 15000; 
let isTimeOut = false; 
let currentDisplaySeconds = 15; 

// === 4. CORE LOGIC ===
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}

function bounceThenTransition(callback) {
    const screens = document.querySelectorAll('.screen');
    let activeScreen = null;
    screens.forEach(s => {
        if (window.getComputedStyle(s).display !== 'none') {
            activeScreen = s;
        }
    });

    if (activeScreen) {
        activeScreen.classList.add('bounce-fade');
        setTimeout(() => {
            activeScreen.classList.remove('bounce-fade');
            callback();
            
            let newScreen = null;
            document.querySelectorAll('.screen').forEach(s => {
                if (window.getComputedStyle(s).display !== 'none') {
                    newScreen = s;
                }
            });
            if (newScreen) {
                newScreen.classList.add('fade-in-slow');
                setTimeout(() => { newScreen.classList.remove('fade-in-slow'); }, 800);
            }
        }, 800); 
    } else {
        callback();
    }
}

function startTotalTimer() {
    if (totalTimer) clearInterval(totalTimer);
    totalTimer = setInterval(() => {
        totalSeconds++;
        const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        const timeEl = document.getElementById('time-val');
        if (timeEl) timeEl.innerText = `${m}:${s}`;
    }, 1000);
}

function updateLanguageUI() {
    const dict = uiDict[currentLang];
    
    if(document.getElementById('t-subtitle')) document.getElementById('t-subtitle').innerText = dict.subtitle;
    if(document.getElementById('t-welcome')) document.getElementById('t-welcome').innerText = dict.welcome;
    if(document.getElementById('btn-start')) document.getElementById('btn-start').innerText = dict.startBtn;
    if(document.getElementById('btn-spin')) document.getElementById('btn-spin').innerText = dict.spinBtn + currentLevel;
    
    if(document.getElementById('t-date-time')) document.getElementById('t-date-time').innerText = dict.dateTime;
    if(document.getElementById('t-total-score')) document.getElementById('t-total-score').innerText = dict.totalScore;
    if(document.getElementById('t-final-time')) document.getElementById('t-final-time').innerText = dict.timeSpent;
    if(document.getElementById('t-survive-rate')) document.getElementById('t-survive-rate').innerText = dict.surviveRate;
    if(document.getElementById('t-rank-title')) document.getElementById('t-rank-title').innerText = dict.rankTitle;
    if(document.getElementById('btn-save-img')) document.getElementById('btn-save-img').innerText = dict.btnSave;
    if(document.getElementById('btn-restart')) document.getElementById('btn-restart').innerText = dict.btnRestart;

    const nextBtn = document.getElementById('btn-next-step');
    if (nextBtn) nextBtn.innerText = (lives > 0 && currentLevel < MAX_LEVEL) ? dict.nextBtn : dict.finishBtn;

    const rate = Math.round((totalScore / (MAX_LEVEL * 10)) * 100) || 0;
    const percentEl = document.getElementById('final-percent');
    if (percentEl) percentEl.innerText = rate + "%";

    const endTitle = document.getElementById('end-title');
    if (endTitle) endTitle.innerText = (rate >= 50 && lives > 0) ? dict.endTitleWin : dict.endTitleLose;

    const rank = document.getElementById('final-rank');
    const rd = document.getElementById('final-rank-desc');
    if (rank && rd) {
        if (rate >= 80) {
            rank.innerText = currentLang === 'th' ? "👑 ระดับพระกาฬ" : "👑 Master";
            rd.innerText = currentLang === 'th' ? "ไวรัสยังต้องร้องไห้! ระบบปลอดภัยขั้นสุด" : "Malware bows to you!";
        } else if (rate >= 50) {
            rank.innerText = currentLang === 'th' ? "🛡️ ระดับผู้เชี่ยวชาญ" : "🛡️ Expert";
            rd.innerText = currentLang === 'th' ? "รอดตัวไปได้! แต่ต้องระวังให้มากกว่านี้" : "Great survival skills.";
        } else {
            rank.innerText = currentLang === 'th' ? "💸 ระบบพังพินาศ" : "💸 Crashed";
            rd.innerText = currentLang === 'th' ? "ต้องกลับไปศึกษาเรื่อง Cybersecurity ด่วนเลย" : "Your system is compromised!";
        }
    }

    document.querySelectorAll('.slot-text').forEach(el => {
        el.innerText = el.getAttribute('data-' + currentLang);
    });

    const q = scenarios[(currentLevel - 1) % scenarios.length];
    const sitDesc = document.getElementById('sit-desc');
    if (sitDesc && sitDesc.innerText !== "") {
        sitDesc.innerText = q[currentLang];
    }

    const optionBtns = document.querySelectorAll('.btn-option');
    if (optionBtns.length > 0) {
        optionBtns.forEach(btn => {
            const score = parseInt(btn.dataset.score);
            const optData = q.options.find(o => o.score === score);
            if (optData) {
                btn.innerText = optData[currentLang]; 
            }
        });
    }

    const stepTitle = document.getElementById('step-title');
    const stepDesc = document.getElementById('step-desc'); 

    if (stepTitle && stepTitle.innerText !== "") {
        if (currentFeedbackType === 'correct') {
            stepTitle.innerText = currentLang === 'th' ? "ถูกต้อง!" : "Correct!";
        } else if (currentFeedbackType === 'wrong') {
            if (isTimeOut) {
                stepTitle.innerText = currentLang === 'th' ? "หมดเวลา!" : "Time's Up!";
            } else {
                stepTitle.innerText = currentLang === 'th' ? "พลาดไปนิด!" : "Wrong!";
            }
        }

        if (currentFeedbackType !== null) {
            stepDesc.innerText = feedbackMessages[currentLang][currentFeedbackType][currentFeedbackIndex];
        }
    }

    const textTimer = document.getElementById('countdown-text');
    if (textTimer) {
        textTimer.innerText = currentDisplaySeconds + (currentLang === 'th' ? ' วินาที' : ' sec');
    }

    if (gameEndTime) {
        const locale = currentLang === 'th' ? 'th-TH' : 'en-GB'; 
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        document.getElementById('final-date-time').innerText = `${gameEndTime.toLocaleDateString(locale, dateOptions)} ${gameEndTime.toLocaleTimeString(locale, timeOptions)}`;
    }

    updateProgress();
}

document.getElementById('btn-lang').onclick = function() {
    playSound('click');
    currentLang = currentLang === 'th' ? 'en' : 'th';
    this.innerText = currentLang === 'th' ? '🇹🇭 TH' : '🇬🇧 EN';
    updateLanguageUI();
};

function btnStartClick() { 
    if (isTransitioning) return; 
    isTransitioning = true; 

    initAudio(); 
    playSound('click'); 
    
    startTotalTimer(); 
    
    // เอาสุ่มออกเพื่อให้เล่น 1-10 ตามลำดับ
    // shuffleArray(scenarios);

    bounceThenTransition(() => {
        showScreen('screen-gacha');
        isTransitioning = false; 
    });
}

function updateLivesUI() {
    const livesEl = document.getElementById('lives');
    if(livesEl) livesEl.innerText = lives;
}

// 🌟 เปลี่ยนภาพกลับมาเป็นเสก Emoji เบิ้มๆ ในสล็อต 🌟
function initSlot() {
    const reel = document.getElementById('reel1');
    if(reel) {
        reel.innerHTML = `
            <div class="reel-item">
                <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                    <span style="font-size: 4rem;">❓</span>
                    <span class="slot-text" data-th="กดสแกนเลย!" data-en="Scan Now!" style="line-height: 1.3; font-size: 1.2rem; font-weight: bold; color: var(--text-color);">
                        ${currentLang === 'th' ? "กดสแกนเลย!" : "Scan Now!"}
                    </span>
                </div>
            </div>
        `;
    }
}

// 🌟 ตอนสล็อตหมุนก็ใช้ Emoji 🌟
function btnSpinClick() {
    if (isSpinning) return;
    isSpinning = true;
    playSound('click'); 
    
    const targetScenario = scenarios[(currentLevel - 1) % scenarios.length];
    
    const reel = document.getElementById('reel1');
    const slotHeight = 140; 

    reel.innerHTML = '';
    reel.style.transition = 'none';
    reel.style.transform = `translateY(0px)`;

    const totalItems = 30; 

    for (let i = 0; i < totalItems; i++) {
        const div = document.createElement('div');
        div.className = 'reel-item';
        
        let scenToDisplay = (i === totalItems - 1) ? targetScenario : scenarios[Math.floor(Math.random() * scenarios.length)];
        
        div.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                <span style="font-size: 2.5rem;">${scenToDisplay.icon}</span>
                <span class="slot-text" data-th="${scenToDisplay.title_th}" data-en="${scenToDisplay.title_en}" style="line-height: 1.3; font-size: 1.2rem; font-weight: bold; color: var(--text-color);">
                    ${scenToDisplay['title_' + currentLang]}
                </span>
            </div>
        `;
        reel.appendChild(div);
    }

    void reel.offsetWidth; 

    const duration = 3.5; 
    reel.style.transition = `transform ${duration}s cubic-bezier(0.15, 0.9, 0.25, 1)`;
    reel.style.transform = `translateY(-${(totalItems - 1) * slotHeight}px)`;
    
    let soundInt = setInterval(() => playSound('spin'), 150);
    setTimeout(() => clearInterval(soundInt), duration * 1000);

    setTimeout(() => {
        isSpinning = false;
        showScreen('screen-quiz');
        loadQuestion();
    }, (duration * 1000) + 1000); 
}

function updateTimerUI(timeLeftMs) {
    const bar = document.getElementById('countdown-bar');
    const text = document.getElementById('countdown-text'); 
    
    currentDisplaySeconds = Math.ceil(timeLeftMs / 1000);
    if (currentDisplaySeconds < 0) currentDisplaySeconds = 0;

    if (bar) {
        const percent = (timeLeftMs / TIME_LIMIT_MS) * 100;
        bar.style.width = Math.max(0, percent) + '%';
        
        if (currentDisplaySeconds > 5) {
            bar.style.backgroundColor = '#8A9782'; 
        } else {
            bar.style.backgroundColor = '#C08B7A'; 
        }
    }
    
    if (text) {
        text.innerText = currentDisplaySeconds + (currentLang === 'th' ? ' วินาที' : ' sec');
    }
}

// 🌟 ดึง Emoji ขึ้นหัวข้อคำถามแบบไซส์บึ้มๆ (4rem) 🌟
function loadQuestion() {
    const q = scenarios[(currentLevel - 1) % scenarios.length];
    
    const iconContainer = document.getElementById('sit-icon');
    iconContainer.innerHTML = `<span style="font-size: 4rem;">${q.icon}</span>`;
    document.getElementById('sit-desc').innerText = q[currentLang];
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    let opts = [...q.options];
    for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerText = opt[currentLang];
        btn.dataset.score = opt.score;
        btn.onclick = () => handleAnswer(opt.score);
        optionsDiv.appendChild(btn);
    });
    
    startQuestionTimer();
}

function startQuestionTimer() {
    isTimeOut = false;
    endTime = Date.now() + TIME_LIMIT_MS;
    
    if (questionTimer) cancelAnimationFrame(questionTimer);
    
    function update() {
        const now = Date.now();
        const timeLeft = endTime - now;
        
        if (timeLeft <= 0) {
            updateTimerUI(0);
            isTimeOut = true;
            handleAnswer(-1); 
            return;
        }
        
        updateTimerUI(timeLeft);
        questionTimer = requestAnimationFrame(update);
    }
    
    questionTimer = requestAnimationFrame(update);
}

// 🌟 ตอนเฉลยก็ใช้ Emoji 6rem ไปเลย 🌟
function handleAnswer(score) {
    if (questionTimer) cancelAnimationFrame(questionTimer);
    
    const stepIconContainer = document.getElementById('step-icon');
    let earned = 0;
    
    if (score === 10) {
        earned = 10;
        playSound('correct');
        currentFeedbackType = 'correct';
        stepIconContainer.innerHTML = `<span style="font-size: 6rem;">✨</span>`;
    } 
    else {
        playSound('wrong');
        currentFeedbackType = 'wrong';
        stepIconContainer.innerHTML = `<span style="font-size: 6rem;">❌</span>`;
        
        lives--;
        updateLivesUI();
    }
    
    totalScore += earned;
    
    const scoreEl = document.getElementById('score'); 
    if(scoreEl) scoreEl.innerText = totalScore;
    
    currentFeedbackIndex = Math.floor(Math.random() * feedbackMessages[currentLang][currentFeedbackType].length);
    updateLanguageUI();

    bounceThenTransition(() => {
        showScreen('screen-step-result');
    });
}

function btnNextStepClick() {
    playSound('click');
    if (currentLevel >= MAX_LEVEL || lives <= 0) {
        bounceThenTransition(() => {
            endGame();
        });
    } else {
        currentLevel++;
        updateProgress();
        
        updateLanguageUI(); 
        
        bounceThenTransition(() => {
            showScreen('screen-gacha');
            initSlot();
        });
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const tProgress = document.getElementById('t-progress');
    
    if (progressFill && tProgress) {
        const percent = ((currentLevel - 1) / MAX_LEVEL) * 100;
        progressFill.style.width = percent + '%';
        tProgress.innerText = (currentLang === 'th' ? 'ข้อที่ ' : 'Level ') + currentLevel + '/' + MAX_LEVEL;
    }
}

function endGame() {
    if (totalTimer) clearInterval(totalTimer);
    gameEndTime = new Date();
    
    const rate = Math.round((totalScore / (MAX_LEVEL * 10)) * 100);
    const isWin = rate >= 50 && lives > 0; 
    
    playSound(isWin ? 'firework' : 'fail');
    
    document.getElementById('final-score').innerText = totalScore;
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    
    const finalTimeEl = document.getElementById('final-time-spent');
    if(finalTimeEl) finalTimeEl.innerText = `${m}:${s}`;
    
    updateLanguageUI();
    showScreen('screen-game-over');
    
    if (isWin) triggerConfetti();

    document.querySelector('.progress-container').style.display = 'none';
}

function btnRestartClick() {
    playSound('click');
    currentLevel = 1;
    totalScore = 0;
    totalSeconds = 0;
    lives = 4; 
    isSpinning = false;
    gameEndTime = null;
    
    updateProgress();
    updateLivesUI();
    
    const scoreEl = document.getElementById('score');
    if(scoreEl) scoreEl.innerText = totalScore;
    
    updateLanguageUI();

    bounceThenTransition(() => {
        showScreen('screen-main');
    });
}

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
    myConfetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
}

function saveAsImage() {
    playSound('click');
    const btnSave = document.getElementById('btn-save-img');
    const originalText = btnSave.innerText;
    btnSave.innerText = currentLang === 'th' ? "⏳ กำลังบันทึก..." : "⏳ Saving...";
    btnSave.disabled = true;

    const captureArea = document.getElementById('capture-area');
    
    html2canvas(captureArea, {
        scale: 2,
        backgroundColor: "#FDF5E6"
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Cyber-Survivor-Result.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        btnSave.innerText = originalText;
        btnSave.disabled = false;
    }).catch(err => {
        console.error("Error saving image:", err);
        btnSave.innerText = originalText;
        btnSave.disabled = false;
        alert(currentLang === 'th' ? "เกิดข้อผิดพลาดในการบันทึกรูปภาพ" : "Error saving image");
    });
}

window.onload = () => {
    updateLanguageUI();
    updateProgress();
    updateLivesUI();
    const scoreEl = document.getElementById('score');
    if(scoreEl) scoreEl.innerText = totalScore;
    initSlot();
};
