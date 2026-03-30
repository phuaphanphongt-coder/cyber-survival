// === 0. SOUND & SYSTEM ===
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

let masterVolume = 0.5; 
let previousVolume = 0.5; 

let currentLang = 'th'; 

const externalFailSound = new Audio('fail.mp3'); 
const externalFireworkSound = new Audio('firework.mp3'); 

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
        subtitle: "เตือนแล้วนะ! โลกออนไลน์มันเหลี่ยมเยอะ", welcome: "พร้อมวัดสกิลเอาตัวรอดจากพวกมิจจี้แล้วยัง?",
        startBtn: "ลุยเลย รออะไร!", spinBtn: "🎲 สุ่มข้อที่ ", scoreLabel: "แต้ม: ",
        progress: "ข้อที่ ", endTitleWin: "SURVIVED! รอดแล้วพวกเรา", endTitleLose: "WASTED! โดนตกซะงั้น",
        nextBtn: "➡️ ไปต่ออย่าแผ่ว!", finishBtn: "📊 ดูผลสรุป", 
        dateTime: "วันที่:", totalScore: "คะแนนรวม:", timeSpent: "เวลาที่ใช้:", surviveRate: "อัตราการรอด:",
        rankTitle: "สเตตัสความขลังของคุณ", btnSave: "📸 เซฟรูปอวดเพื่อน", btnRestart: "🔄 ขอแก้มืออีกรอบ"
    },
    en: {
        subtitle: "Watch out! The internet is full of traps.", welcome: "Ready to test your survival skills against scammers?",
        startBtn: "Let's Go!", spinBtn: "🎲 Spin Level ", scoreLabel: "Score: ",
        progress: "Level ", endTitleWin: "SURVIVED!", endTitleLose: "WASTED!",
        nextBtn: "➡️ Next!", finishBtn: "📊 See Results",
        dateTime: "Date:", totalScore: "Total Score:", timeSpent: "Time Spent:", surviveRate: "Survival Rate:",
        rankTitle: "Your Rank", btnSave: "📸 Save Image", btnRestart: "🔄 Play Again"
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

// คลังคำถาม 25 ข้อ 
const scenarios = [
    { icon: "🎭", title_th: "ปลอมโปรไฟล์", title_en: "Fake Profile", th: "ปื้มแคปหน้าจอส่งมาให้ดู ว่ามีแอคหลุมเอารูปเราไปตั้งโปรไฟล์หลอกขายของเฉย!", en: "Pluem sent a screenshot of a fake account using your photo to scam people!",
      options: [{ th: "ปล่อยเบลอ ขี้เกียจวุ่นวาย", en: "Ignore it, too lazy to care", score: 0 }, { th: "กดรีพอร์ตให้ปลิว แล้วแคปไปแจ้งความ", en: "Report the account and tell police", score: 10 }, { th: "ให้ปื้มพาทัวร์ไปลง ทักไปต่อว่าให้เขาลบ", en: "Let Pluem lead a mob to report them", score: 5 }]
    },
    { icon: "📱", title_th: "SMS ดูดเงิน", title_en: "Scam SMS", th: "จู่ๆ มี SMS เข้าเบอร์เราว่า 'ถอนเงินสำเร็จ 50,000 บ.' อะตอมรีบทักมายุให้รีบกดลิงก์ไปยกเลิกด่วน!", en: "Got SMS: '50k THB withdrawn.' Atom tells you to quickly click the link to cancel!",
      options: [{ th: "ล่กตามอะตอม รีบกดลิงก์ด่วนๆ", en: "Panic like Atom, click the link", score: 0 }, { th: "ดึงสติก่อน โทรเข้า Call Center ธนาคารชัวร์สุด", en: "Stay calm, call the bank directly", score: 10 }, { th: "เตือนอะตอมว่าอย่าเพิ่งหลงเชื่อ แล้วลบข้อความทิ้ง", en: "Tell Atom not to fall for it and delete the SMS", score: 5 }]
    },
    { icon: "📦", title_th: "พัสดุตกค้าง", title_en: "Stuck Parcel", th: "เคนทักมาถาม 'แกสั่งของป่าววะ มี SMS แจ้งพัสดุตกค้าง ให้กดลิงก์ไปจ่ายค่าส่งเพิ่ม'", en: "Ken asks: 'Did you order something? SMS says package stuck, click link to pay fee.'",
      options: [{ th: "กดลิงก์จ่ายๆ ไป จะได้ของไวๆ", en: "Click link and pay to get it fast", score: 0 }, { th: "บอกเคนว่ามิจชัวร์! ไปเช็คเลขแทรคในแอปออฟฟิเชียลเองดีกว่า", en: "Tell Ken it's a scam, check official app", score: 10 }, { th: "ทักไปโวยร้านที่เพิ่งสั่งของไป", en: "Complain to the shop you bought from", score: 5 }]
    },
    { icon: "👮", title_th: "ตำรวจทิพย์", title_en: "Fake Police", th: "สายเข้าอ้างเป็นตำรวจ บอกบัญชีเราพัวพันเว็บพนัน ปันนั่งอยู่ข้างๆ ยุให้จัดการบ่นไปเลย", en: "Call from 'police' about gambling. Pun is next to you telling you to complain to them.",
      options: [{ th: "กลัวโดนจับ รีบโอนเงินไปให้เขาเช็คความบริสุทธิ์", en: "Freak out and transfer the money", score: 0 }, { th: "ตัดสายทิ้งบล็อกเบอร์ ตำรวจที่ไหนให้โอนเงินผ่านแอป!", en: "Hang up. Real cops don't ask for transfers!", score: 10 }, { th: "ทำตามที่ปันบอก จัดการสวดร้อยเวรปลอมไปหนึ่งแมตช์", en: "Complain to them like Pun suggested", score: 5 }]
    },
    { icon: "💼", title_th: "งานกดไลก์", title_en: "Fake Online Job", th: "ฟิล์มแชร์โพสต์ 'งานออนไลน์ แค่กดไลก์คลิป รับวันละ 1,000 บ.' มาให้ดู บอกว่าน่าสนจัด", en: "Film shares a post: 'Easy job, like videos for 1,000/day'. Says it looks interesting.",
      options: [{ th: "น่าสน สมัครเลย ยอมจ่ายค่าสอนงานนิดหน่อย", en: "Apply and pay the 'training fee'", score: 0 }, { th: "บอกฟิล์มให้ตื่น! งานสบายรายได้ดีขนาดนี้มันหลอกชัวร์", en: "Tell Film to wake up. It's a scam", score: 10 }, { th: "แชร์ไปถามในกลุ่มเพื่อน 'พวกแกว่าไง น่าลองป่ะ'", en: "Share to ask friends if it's legit", score: 5 }]
    },
    { icon: "💖", title_th: "หลอกรักออนไลน์", title_en: "Romance Scam", th: "มีฝรั่งโปรไฟล์ดูรวยทักมาจีบ แถมบอกจะส่งแบรนด์เนมมาให้ คิวบอก 'รับเลยเพื่อน เดี๋ยวเราช่วยออกค่าภาษี'", en: "Hot foreigner flirts, says they'll send designer gifts. Q says 'Take it, I'll help pay customs!'",
      options: [{ th: "โอนดิรอไร! ของฟรีมูลค่าเป็นแสนเลยนะ", en: "Pay the fee! The gift is worth way more!", score: 0 }, { th: "บอกคิวว่าสแกมเมอร์แน่ๆ! บล็อก+รีพอร์ต จบปิ๊ง", en: "Tell Q it's a scammer. Block & Report.", score: 10 }, { th: "เหงาพอดี คุยปั่นหัวสแกมเมอร์เล่นดีกว่า", en: "Troll them since you're bored anyway", score: 5 }]
    },
    { icon: "🎉", title_th: "แจกของฟรี", title_en: "Free Giveaway", th: "กำลังดูซีรีส์กับปื้ม จู่ๆ มีป๊อปอัปเด้ง 'ยินดีด้วย! คุณคือผู้โชคดีรับ iPhone 15 ฟรี!'", en: "Watching series with Pluem, popup appears: 'Congrats! You won a free iPhone 15!'",
      options: [{ th: "แย่งปื้มกด กรอกชื่อที่อยู่ด่วนๆ", en: "Fight Pluem to type details first", score: 0 }, { th: "กด X ปิดหน้าต่างทิ้งอย่างไว ของฟรีไม่มีในโลกนะ", en: "Close it instantly. Nothing is free.", score: 10 }, { th: "กดเข้าไปส่องเงื่อนไขสักหน่อย เผื่อได้จริง", en: "Click to read terms just in case", score: 5 }]
    },
    { icon: "💬", title_th: "เพื่อนทักยืมเงิน", title_en: "Friend Needs Money", th: "แชทปันเด้งมา 'แก ยืมเงิน 5,000 ดิ เดือดร้อนมาก เดี๋ยวพรุ่งนี้คืน'", en: "Pun's chat pops up: 'Need 5k urgently, will pay back tomorrow!'",
      options: [{ th: "เพื่อนรักลำบาก รีบโอนสลิปส่งไปอย่างไว", en: "Transfer immediately to help a friend", score: 0 }, { th: "ยกหูโทรหาปันเลย ชัวร์สุดว่าใช่ตัวจริงไหม", en: "Call Pun directly to hear his voice", score: 10 }, { th: "ลองถามคำถามกันเหนียว 'แฟนเก่าเคนชื่ออะไร?'", en: "Ask a secret question about Ken's ex", score: 5 }]
    },
    { icon: "📶", title_th: "Wi-Fi อันตราย", title_en: "Unsafe Wi-Fi", th: "มานั่งคาเฟ่กับอะตอม มันบอกให้ต่อ 'Free Wi-Fi' ของร้านสิ จะได้โอนเงินค่ากาแฟฟรีๆ ไม่เปลืองเน็ต", en: "At a cafe with Atom, he tells you to connect to 'Free Wi-Fi' to transfer money.",
      options: [{ th: "ต่อเน็ตฟรีตามที่อะตอมบอก โอนเลยละกัน", en: "Connect and transfer to save data", score: 0 }, { th: "ปิด Wi-Fi แล้วใช้ 5G ตัวเองโอน ปลอดภัยกว่าเยอะ", en: "Turn off Wi-Fi, use mobile data", score: 10 }, { th: "รีบโอนรีบตัดเน็ต ไม่น่าเป็นไรมั้ง", en: "Use Wi-Fi but do it super fast", score: 5 }]
    },
    { icon: "🛍️", title_th: "ของถูกเกินจริง", title_en: "Too Good to be True", th: "ฟิล์มแท็กเรียกไปดูเพจขาย PS5 ลดราคา 70% คอมเมนต์อวยฉ่ำ 'ได้ของจริงค่ะ ส่งไวมาก'", en: "Film tags you on a page selling PS5 at 70% off. Comments: 'Legit! Fast shipping!'",
      options: [{ th: "F ด่วนจี๋ สั่งตัดหน้าฟิล์ม กลัวของหมด", en: "Buy it before Film does", score: 0 }, { th: "ทรงนี้หน้าม้าชัวร์ เตือนฟิล์มแล้วไปซื้อร้าน Official ดีกว่า", en: "Warn Film, buy from official store instead", score: 10 }, { th: "ทักเพจไปถาม 'มีปลายทางไหมคะพี่'", en: "Message to ask for Cash on Delivery", score: 5 }]
    },
    { icon: "📲", title_th: "แอปหน่วยงานปลอม", title_en: "Fake Gov App", th: "เบอร์แปลกอ้างเป็นกรมที่ดิน ให้โหลดแอป .apk เพื่อทำเรื่องรับภาษีคืน เคนบอก 'กดรับสิทธิ์เลยเพื่อน'", en: "Fake Land Dept caller tells you to download .apk for refund. Ken says 'Claim it bro!'",
      options: [{ th: "เชื่อเคน โหลดแอป แล้วกดยอมรับทุกสิทธิ์การเข้าถึง", en: "Trust Ken, download app and allow all permissions", score: 0 }, { th: "ปฏิเสธแล้ววางสาย รัฐบาลไม่ให้โหลดแอปนอกสโตร์หรอก!", en: "Decline and hang up. Gov apps are in the Store!", score: 10 }, { th: "บอกให้เขาส่งเอกสารมาที่บ้านแทนละกัน", en: "Tell them to mail the documents instead", score: 5 }]
    },
    { icon: "📈", title_th: "หลอกลงทุน", title_en: "Investment Scam", th: "คิวชวนเข้ากลุ่มลงทุนคริปโต การันตีกำไร 100% ภายใน 1 เดือน เขาบอก 'เชื่อเรา เราศึกษามาดี!'", en: "Q invites you to crypto group, 100% guaranteed profit! He says 'Trust me!'",
      options: [{ th: "All-in ตามคิวไปเลย รวยไปด้วยกัน", en: "All-in with Q! Gonna be rich!", score: 0 }, { th: "เตือนคิวว่า 'การันตีกำไร = แชร์ลูกโซ่' แล้วออกจากกลุ่ม", en: "Warn Q it's a Ponzi, leave group", score: 10 }, { th: "หยอดขำๆ ไปสักพันนึง เผื่อได้จริง", en: "Invest a small amount just in case", score: 5 }]
    },
    { icon: "🔗", title_th: "ไฟล์แนบไวรัส", title_en: "Malicious File", th: "ปันฟอร์เวิร์ดเมลด่วนมาให้ ไฟล์ชื่อ 'โครงสร้างโบนัสปีนี้.exe' บอกว่า 'อะตอมส่งมา รีบเปิดดูเลย!'", en: "Pun forwards urgent email 'Bonus.exe', says 'Atom sent it, open it quick!'",
      options: [{ th: "ตาลุกวาว รีบดับเบิลคลิกเปิดไฟล์ดูโบนัสทันที", en: "Excited, double-click immediately to check", score: 0 }, { th: "ไฟล์ .exe มันแปลกๆ ทักไลน์ไปถามอะตอมตัวจริงก่อนดีกว่า", en: "Weird extension. Ask Atom on Line first", score: 10 }, { th: "โยนเข้าโปรแกรมสแกนไวรัสเช็คดูก่อนเปิด", en: "Run it through Antivirus first", score: 5 }]
    },
    { icon: "🔑", title_th: "ลิงก์กู้รหัสผ่าน", title_en: "Phishing Link", th: "ฟิล์มแคปหน้าจอเมลเตือนมาโวยวาย 'แก! บัญชีแกกำลังถูกแฮ็ก รีบกดลิงก์นี้ไปเปลี่ยนรหัสผ่านด่วน!'", en: "Film sends screenshot: 'Your account is hacked! Click link to reset password NOW!'",
      options: [{ th: "ล่กตามฟิล์ม รีบกดลิงก์ไปกรอกรหัสผ่านเพื่อกู้บัญชี", en: "Panic with Film, click link and enter password", score: 0 }, { th: "ใจเย็นๆ ไม่กดลิงก์มั่ว เปิดเว็บแพลตฟอร์มนั้นเองแล้วค่อยเปลี่ยนรหัส", en: "Don't click link. Open app manually to change password", score: 10 }, { th: "ปล่อยเบลอ ขี้เกียจเปลี่ยนรหัสใหม่", en: "Ignore, too lazy to change passwords", score: 5 }]
    },
    { icon: "🐶", title_th: "บริจาคปลอม", title_en: "Fake Donation", th: "ปื้มแชร์โพสต์ขอบริจาคช่วยน้องหมาป่วยหนัก! แต่อ้าว... เลขบัญชีเป็นชื่อนายสมชาย ไม่ใช่ชื่อมูลนิธิ", en: "Pluem shares a donation post for a sick dog! But the bank account is a random guy's name.",
      options: [{ th: "สงสารน้องหมา รีบโอนเงินไปช่วยตามที่ปื้มแชร์", en: "Feel bad, transfer money instantly", score: 0 }, { th: "เอะใจ เตือนปื้มแล้วเอาชื่อไปเช็คเว็บ Blacklistseller ก่อน", en: "Warn Pluem and check name on blacklist site first", score: 10 }, { th: "ไม่มีตังค์ ช่วยแชร์ลงสตอรี่ไปละกัน", en: "No money, just share the post", score: 5 }]
    },
    { icon: "🏖️", title_th: "ที่พักทิพย์", title_en: "Fake Booking", th: "ปันเจอที่พักพูลวิลล่าลด 80% ในเฟซบุ๊ก แอดมินเร่งให้โอนเต็มจำนวนเข้าบัญชี 'นาย สมมติ หลอกลวง'", en: "Pun found a pool villa at 80% off on FB. Admin says transfer full amount to a personal account now!",
      options: [{ th: "โอนเลยด่วนๆ โปรไฟไหม้เดี๋ยวห้องหลุด", en: "Transfer fast before it's fully booked", score: 0 }, { th: "เตือนปันว่าเพจปลอมแน่ๆ บัญชีส่วนตัว=หนีไป!", en: "Warn Pun it's fake. Personal account = RUN!", score: 10 }, { th: "ขอมัดจำไปก่อนครึ่งนึง เพื่อความสบายใจ", en: "Ask to pay 50% deposit just to be safe", score: 5 }]
    },
    { icon: "👶", title_th: "ลิงก์โหวตหลาน", title_en: "Phishing Vote", th: "เคนทักไลน์มา 'แกๆ ช่วยกดลิงก์โหวตหลานเราประกวดเด็กน่ารักหน่อย ต้องล็อกอิน Facebook ด้วยนะ'", en: "Ken lines you: 'Help vote for my nephew in a contest. Click link and log in with FB.'",
      options: [{ th: "รีบกดลิงก์ กรอกรหัสเฟซบุ๊กเพื่อโหวตให้หลานเพื่อน", en: "Click link and enter FB password to vote", score: 0 }, { th: "โทรหาเคนเพื่อเช็คว่าโดนแฮ็กไลน์หรือเปล่า ลิงก์ฟิชชิ่งชัวร์", en: "Call Ken to check if his Line got hacked. Phishing!", score: 10 }, { th: "บอกเคนว่าเดี๋ยวโหวตให้ แต่แกล้งลืม", en: "Tell Ken you will vote, but 'forget' to do it", score: 5 }]
    },
    { icon: "⚡", title_th: "แจ้งเตือนค่าไฟ", title_en: "Fake Utility Bill", th: "SMS เข้า: 'คุณมียอดค้างชำระค่าไฟ 3 เดือน กรุณาแอดไลน์การไฟฟ้าด่วนก่อนโดนตัดไฟ!'", en: "SMS: 'Unpaid electric bill for 3 months. Add MEA Line account urgently before power cut!'",
      options: [{ th: "ตกใจสุดขีด รีบแอดไลน์ไปเคลียร์ยอดทันที", en: "Panicked, add Line to clear the bill instantly", score: 0 }, { th: "ลบทิ้ง! การไฟฟ้าไม่มีนโยบายส่งลิงก์ให้แอดไลน์", en: "Delete it! Electricity Authority never sends links", score: 10 }, { th: "โทรไปด่าเบอร์ที่ส่ง SMS มา", en: "Call the sender number to yell at them", score: 5 }]
    },
    { icon: "🦠", title_th: "ไวรัสหลอกลวง", title_en: "Scareware", th: "กำลังดูซีรีส์ฟรี จู่ๆ มีหน้าต่างเด้งแดงเถือก 'มือถือคุณติดไวรัส 13 ตัว! โหลดแอปสแกนด่วน'", en: "Watching free series, red popup appears: 'Phone infected with 13 viruses! Download scanner now!'",
      options: [{ th: "กลัวข้อมูลหาย รีบกดโหลดแอปมาสแกนไวรัส", en: "Scared of losing data, download the app quickly", score: 0 }, { th: "ปิดแท็บนั้นทิ้งไปเลย มันคือโฆษณาหลอกลวง (Scareware)", en: "Close the tab. It's just a scareware ad.", score: 10 }, { th: "แคปจอไปถามอะตอมว่าทำยังไงดี", en: "Screenshot and ask Atom what to do", score: 5 }]
    },
    { icon: "💰", title_th: "แจกเงินดิจิทัล", title_en: "Fake Digital Wallet", th: "คิวส่งลิงก์ 'ลงทะเบียนรับเงินดิจิทัล 10,000 บาท' มาให้ กรอกแค่เลขบัตรปชช. เบอร์โทร ก็ได้เงินเลย", en: "Q sends link: 'Register for 10k THB digital wallet.' Just enter ID & phone number.",
      options: [{ th: "ของฟรีต้องไว รีบกรอกข้อมูลให้ครบถ้วน", en: "Free money! Type all personal info fast", score: 0 }, { th: "เตือนคิวว่าเว็บปลอม! รอประกาศจากแอป 'ทางรัฐ' อย่างเดียว", en: "Warn Q it's fake! Wait for the official Gov app only", score: 10 }, { th: "กรอกข้อมูลปลอมๆ ชื่อลุงแถวบ้านไปกวนๆ", en: "Fill in fake info just to troll them", score: 5 }]
    },
    { icon: "💘", title_th: "ชวนเทรดทอง", title_en: "Pig Butchering Scam", th: "แมตช์เจอสาวสวย/หนุ่มหล่อในแอปหาคู่ คุยได้ 2 วันเขาบอก 'เราเทรดทองได้กำไรเยอะมาก โหลดแอปนี้สิเดี๋ยวพาทำ'", en: "Matched with a hottie on dating app. After 2 days: 'I make huge profits trading gold, download this app!'",
      options: [{ th: "โหลดตามเลย อยากรวยพร้อมมีแฟนสายเปย์", en: "Download it. Want to be rich and get a date", score: 0 }, { th: "Pig Butchering Scam ชัดๆ! บล็อกแล้วรีพอร์ตทันที", en: "Pig Butchering Scam! Block and report instantly.", score: 10 }, { th: "ขอยืมเงินเขาก่อนเพื่อมาลงทุนดูความจริงใจ", en: "Ask to borrow their money to invest to test them", score: 5 }]
    },
    { icon: "⭐", title_th: "งานสำรองจ่าย", title_en: "Advance Payment Job", th: "แอดมินเพจทักมาให้งาน 'กดไลก์รีวิวสินค้า ได้ค่าคอม 20%' แต่ต้องโอนเงินสำรองจ่ายก่อน 500 บาท", en: "Admin messages: 'Like and review products for 20% commission', but needs 500 THB deposit first.",
      options: [{ th: "โอนสำรองจ่ายไปก่อน หวังได้กำไรคืนง่ายๆ", en: "Transfer the deposit, expecting easy profit", score: 0 }, { th: "งานที่ต้องจ่ายเงินก่อนคืองานหลอกลวง 100% บล็อกทิ้งซะ", en: "Jobs asking for money first are 100% scams. Block.", score: 10 }, { th: "รับงานแต่พอถึงตอนให้โอนก็อ่านไม่ตอบ", en: "Accept the job but ignore them when asked to pay", score: 5 }]
    },
    { icon: "🎁", title_th: "หลอกเก็บค่าส่ง", title_en: "Shipping Fee Scam", th: "เพจอินฟลูฯ ชื่อดัง (แต่ผู้ติดตามหลักร้อย) ทักมาบอกว่าเราได้รางวัลกระเป๋าแบรนด์เนม ให้โอนค่าส่ง 50 บาท", en: "Famous influencer page (with 100 followers) says you won a designer bag! Pay 50 THB shipping.",
      options: [{ th: "โอนสิ คุ้มมาก! แค่ 50 บาทแลกของหลักหมื่น", en: "Pay 50 THB for a luxury bag? Worth it!", score: 0 }, { th: "สังเกตยอดผู้ติดตาม อ้าว เพจปลอมสวมรอยนี่นา! รีพอร์ตเลย", en: "Check followers... it's a fake clone page! Report.", score: 10 }, { th: "ทักไปถามว่าหักจากค่ากระเป๋าเลยได้ไหม", en: "Ask if they can deduct shipping from the bag's value", score: 5 }]
    },
    { icon: "✈️", title_th: "ตั๋วทิพย์", title_en: "Fake Flight Tickets", th: "ฟิล์มชวนซื้อตั๋วเครื่องบิน 'หลุดจอง' ไปญี่ปุ่น ราคาแค่ 3,000 บาท ในทวิตเตอร์ (X) แม่ค้าเร่งให้โอน", en: "Film invites you to buy 'cancelled' flight tickets to Japan for 3k THB on X. Seller is rushing you.",
      options: [{ th: "ถูกแบบนี้ต้องจัด โอนไวได้บินชัวร์", en: "So cheap! Transfer fast to secure the flight", score: 0 }, { th: "เตือนฟิล์มว่าตั๋วหลุดจองโอนสิทธิ์กันไม่ได้ ซื้อกับสายการบินดีกว่า", en: "Warn Film name transfers aren't allowed. Buy official.", score: 10 }, { th: "ขอทักไปขอดูบัตรประชาชนคนขายก่อน", en: "Message seller to ask for their ID card first", score: 5 }]
    },
    { icon: "💸", title_th: "แอปเงินกู้เถื่อน", title_en: "Illegal Loan App", th: "หมุนเงินไม่ทัน เจอแอปเงินกู้อนุมัติไว ไม่เช็คเครดิตบูโร แค่ต้องกด 'อนุญาตให้เข้าถึงรายชื่อผู้ติดต่อ' ในมือถือ", en: "Need cash fast. Found an instant loan app, no credit check, just needs 'Access to Contacts'.",
      options: [{ th: "กดอนุญาตไปเลย อยากได้เงินด่วน", en: "Allow access immediately, need the money!", score: 0 }, { th: "หยุดเลย! แอปเถื่อนแน่ๆ เดี๋ยวโดนดูดข้อมูลไปโทรทวงประจาน", en: "Stop! Illegal app will steal contacts to harass them.", score: 10 }, { th: "โหลดแอปมาดูเฉยๆ แต่ยังไม่กดยืนยัน", en: "Download just to see, but don't confirm anything", score: 5 }]
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

// ตัวแปรสำหรับจับเวลาถอยหลังแต่ละข้อ
let questionTimer;
let timeRemaining = 15;
const TIME_LIMIT = 15;

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// === 4. CORE LOGIC ===
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}

function bounceThenTransition(callback) {
    const activeScreen = document.querySelector('.screen[style*="display: flex"]');
    if (activeScreen) {
        activeScreen.classList.add('bounce-fade');
        setTimeout(() => {
            activeScreen.classList.remove('bounce-fade');
            callback();
            const newScreen = document.querySelector('.screen[style*="display: flex"]');
            if (newScreen) newScreen.classList.add('fade-in-slow');
            setTimeout(() => { if (newScreen) newScreen.classList.remove('fade-in-slow'); }, 800);
        }, 1500); 
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
            rank.innerText = currentLang === 'th' ? "👑 มิจจี้ทำอะไรไม่ได้" : "👑 Scammers is crying";
            rd.innerText = currentLang === 'th' ? "มิจจี้ยังต้องเรียกพี่! เหลี่ยมมาเหลี่ยมกลับไม่โกง" : "Scammers bow to you!";
        } else if (rate >= 50) {
            rank.innerText = currentLang === 'th' ? "🛡️ คนจริงเอาตัวรอดเก่ง" : "🛡️ Good head";
            rd.innerText = currentLang === 'th' ? "สติดีใช้ได้ รอดตัวไปนะรอบนี้" : "Great survival skills.";
        } else {
            rank.innerText = currentLang === 'th' ? "💸 หมูแห้ง" : "💸 Skinny pig";
            rd.innerText = currentLang === 'th' ? "ระวังหน่อยนะ เป็นเหยื่อชั้นดีของพวกมิจฯ เลย" : "Be careful! You're an easy target.";
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
    const stepIcon = document.getElementById('step-icon');
    const stepDesc = document.getElementById('step-desc'); 

    if (stepTitle && stepIcon && stepTitle.innerText !== "") {
        if (stepIcon.innerText === "✨") {
            stepTitle.innerText = currentLang === 'th' ? "ถูกต้อง!" : "Correct!";
        } else if (stepIcon.innerText === "❌") {
            // เช็คว่าหมดเวลาหรือเปล่า
            if (timeRemaining <= 0) {
                stepTitle.innerText = currentLang === 'th' ? "หมดเวลา!" : "Time's Up!";
            } else {
                stepTitle.innerText = currentLang === 'th' ? "พลาดไปนิด!" : "Wrong!";
            }
        }

        if (currentFeedbackType !== null) {
            stepDesc.innerText = feedbackMessages[currentLang][currentFeedbackType][currentFeedbackIndex];
        }
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
    shuffleArray(scenarios);

    bounceThenTransition(() => {
        showScreen('screen-gacha');
        isTransitioning = false; 
    });
}

function updateLivesUI() {
    document.getElementById('lives').innerText = lives;
}

function initSlot() {
    const reel = document.getElementById('reel1');
    if(reel) {
        reel.innerHTML = `
            <div class="reel-item">
                <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                    <span style="font-size: 2.5rem;">❓</span>
                    <span class="slot-text" data-th="กดสุ่มเลย!" data-en="Spin Now!" style="line-height: 1.3; font-size: 1.2rem; font-weight: bold; color: var(--text-color);">
                        ${currentLang === 'th' ? "กดสุ่มเลย!" : "Spin Now!"}
                    </span>
                </div>
            </div>
        `;
    }
}

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

// อัปเดต UI แถบเวลา
function updateTimerUI() {
    const bar = document.getElementById('countdown-bar');
    if (bar) {
        const percent = (timeRemaining / TIME_LIMIT) * 100;
        bar.style.width = percent + '%';
        if (timeRemaining > 5) {
            bar.style.backgroundColor = '#8A9782'; // สีเขียวตอนเวลาปกติ
        } else {
            bar.style.backgroundColor = '#C08B7A'; // สีแดงเตือนตอนใกล้หมดเวลา
        }
    }
}

function loadQuestion() {
    const q = scenarios[(currentLevel - 1) % scenarios.length];
    document.getElementById('sit-icon').innerText = q.icon;
    document.getElementById('sit-desc').innerText = q[currentLang];
    
    const iconContainer = document.getElementById('sit-icon-container');
    iconContainer.style.animation = 'pulsingGlow 1s infinite alternate ease-in-out';
    setTimeout(() => { iconContainer.style.animation = ''; }, 2000);

    const optContainer = document.getElementById('options');
    optContainer.innerHTML = '';
    
    let shuffledOptions = [...q.options];
    shuffleArray(shuffledOptions);
    
    shuffledOptions.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerText = opt[currentLang];
        btn.dataset.score = opt.score; 
        btn.onclick = () => handleAnswer(btn, opt.score);
        optContainer.appendChild(btn);
    });

    // เริ่มระบบจับเวลา
    clearInterval(questionTimer);
    timeRemaining = TIME_LIMIT;
    updateTimerUI();
    
    questionTimer = setInterval(() => {
        timeRemaining--;
        updateTimerUI();
        if (timeRemaining <= 0) {
            clearInterval(questionTimer);
            handleAnswer(null, 0); // หมดเวลาถือว่าตอบผิด (ส่งค่าเป็น null และคะแนนเป็น 0)
        }
    }, 1000);
}

function handleAnswer(btn, score) {
    clearInterval(questionTimer); // หยุดเวลาทันทีที่กดตอบ
    
    const allBtns = document.querySelectorAll('.btn-option');
    allBtns.forEach(b => b.disabled = true); 

    const isCorrect = score === 10;
    if (btn) btn.classList.add(isCorrect ? 'correct' : 'wrong');
    
    allBtns.forEach(b => { 
        if (parseInt(b.dataset.score) === 10) b.classList.add('correct'); 
    });

    if (isCorrect) {
        totalScore += score; 
        playSound('correct');
    } else {
        playSound('wrong');
        lives--; 
        updateLivesUI();
    }

    document.getElementById('score').innerText = totalScore;

    setTimeout(() => { showStepResult(isCorrect); }, 1200);
}

function showStepResult(isCorrect) {
    const screenResult = document.getElementById('screen-step-result');
    showScreen('screen-step-result');
    screenResult.classList.add('fade-in-slow');
    setTimeout(() => { screenResult.classList.remove('fade-in-slow'); }, 800);

    const icon = document.getElementById('step-icon');
    const title = document.getElementById('step-title');
    const desc = document.getElementById('step-desc');
    const nextBtn = document.getElementById('btn-next-step');

    currentFeedbackType = isCorrect ? 'correct' : 'wrong';
    currentFeedbackIndex = Math.floor(Math.random() * feedbackMessages[currentLang][currentFeedbackType].length);

    if (isCorrect) {
        icon.innerText = "✨";
        title.innerText = (currentLang === 'th' ? "ถูกต้อง!" : "Correct!");
        title.style.color = "#8A9782";
    } else {
        icon.innerText = "❌";
        if (timeRemaining <= 0) {
            title.innerText = (currentLang === 'th' ? "หมดเวลา!" : "Time's Up!");
        } else {
            title.innerText = (currentLang === 'th' ? "พลาดไปนิด!" : "Wrong!");
        }
        title.style.color = "#C08B7A";
    }

    desc.innerText = feedbackMessages[currentLang][currentFeedbackType][currentFeedbackIndex];

    if (lives > 0 && currentLevel < MAX_LEVEL) {
        nextBtn.innerText = uiDict[currentLang].nextBtn;
        nextBtn.style.backgroundColor = "var(--accent-color)";
        nextBtn.style.boxShadow = "0 6px 0px #A06B5A";
    } else {
        nextBtn.innerText = uiDict[currentLang].finishBtn;
        nextBtn.style.backgroundColor = "#8A9782"; 
        nextBtn.style.boxShadow = "0 6px 0px #677260";
    }
}

function btnNextStepClick() {
    if (isTransitioning) return; 
    isTransitioning = true; 
    
    playSound('click');
    if (lives > 0 && currentLevel < MAX_LEVEL) { 
        currentLevel++;
        updateProgress();
        document.getElementById('btn-spin').innerText = uiDict[currentLang].spinBtn + currentLevel;
        bounceThenTransition(() => {
            showScreen('screen-gacha');
            isTransitioning = false; 
        });
    } else { 
        bounceThenTransition(() => {
            endGame();
            isTransitioning = false; 
        });
    }
}

function updateProgress() {
    const percent = (currentLevel / MAX_LEVEL) * 100;
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('t-progress').innerText = `${uiDict[currentLang].progress}${currentLevel}/${MAX_LEVEL}`;
}

function fireConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return; 
    
    const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
    });

    (function frame() {
        myConfetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 1 }, colors: ['#D8A47F', '#C08B7A', '#8A9782', '#FFD700'] });
        myConfetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 1 }, colors: ['#D8A47F', '#C08B7A', '#8A9782', '#FFD700'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function endGame() {
    clearInterval(totalTimer);
    showScreen('screen-game-over');
    
    gameEndTime = new Date(); 

    document.getElementById('final-score').innerText = totalScore;
    
    const timeSpent = document.getElementById('time-val') ? document.getElementById('time-val').innerText : "00:00";
    document.getElementById('final-time-spent').innerText = timeSpent;
    
    updateLanguageUI();

    const rate = Math.round((totalScore / (MAX_LEVEL * 10)) * 100) || 0;

    if (rate >= 50 && lives > 0) {
        fireConfetti(); 
        playSound('firework');
        setTimeout(() => playSound('firework'), 600);
        setTimeout(() => playSound('firework'), 1400);
    } else {
        playSound('fail');
    }
}

function btnRestartClick() { location.reload(); }

function saveAsImage() {
    const area = document.getElementById('capture-area');
    html2canvas(area, { backgroundColor: "#F8F1E9", scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `CyberSurvival_Result.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Initial Setup
updateLanguageUI();
updateProgress();
updateLivesUI();
initSlot();
