let loadImage, createCanvas, registerFont;
let canvasAvailable = false;

try {
  const canvas = require("canvas");
  loadImage = canvas.loadImage;
  createCanvas = canvas.createCanvas;
  registerFont = canvas.registerFont;
  canvasAvailable = true;
} catch (error) {
  console.error("Canvas module not available:", error.message);
}

const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");
const axios = require("axios");

let fonts;
try {
  fonts = require('../../func/fonts.js');
} catch (error) {
  console.log("Fonts module not found, using fallback");
}

if (canvasAvailable && registerFont) {
  try {
    const fontDir = path.join(__dirname, 'assets', 'font');
    if (fs.existsSync(path.join(fontDir, 'BeVietnamPro-Bold.ttf'))) {
      registerFont(path.join(fontDir, 'BeVietnamPro-Bold.ttf'), { family: 'BeVietnamPro-Bold' });
    }
    if (fs.existsSync(path.join(fontDir, 'BeVietnamPro-Regular.ttf'))) {
      registerFont(path.join(fontDir, 'BeVietnamPro-Regular.ttf'), { family: 'BeVietnamPro-Regular' });
    }
    if (fs.existsSync(path.join(fontDir, 'BeVietnamPro-SemiBold.ttf'))) {
      registerFont(path.join(fontDir, 'BeVietnamPro-SemiBold.ttf'), { family: 'BeVietnamPro-SemiBold' });
    }
  } catch (error) {
    console.log("Font registration error:", error.message);
  }
}

if (canvasAvailable) {
  try {
    if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };
    }
  } catch (error) {
    console.log("Canvas context polyfill error:", error.message);
  }
}

const rankThemes = {
  paradise: {
    name: "Paradise Rank",
    background: (ctx, width, height) => {
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
      gradient.addColorStop(0, "#ffb3d9");
      gradient.addColorStop(0.3, "#ff6bb3");
      gradient.addColorStop(0.6, "#e056fd");
      gradient.addColorStop(1, "#7c3aed");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    primaryColor: "#ff1744",
    secondaryColor: "#ff69b4",
    textColor: "#ffffff",
    accentColor: "#ffc0cb",
    shadowColor: "rgba(255, 23, 68, 0.9)"
  },
  cosmic: {
    name: "Cosmic Rank",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(0.2, "#764ba2");
      gradient.addColorStop(0.5, "#f093fb");
      gradient.addColorStop(0.8, "#f5576c");
      gradient.addColorStop(1, "#4facfe");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    primaryColor: "#ff6b9d",
    secondaryColor: "#c471ed",
    textColor: "#ffffff",
    accentColor: "#a8edea",
    shadowColor: "rgba(255, 107, 157, 0.9)"
  },
  enchanted: {
    name: "Enchanted Rank",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#ffecd2");
      gradient.addColorStop(0.3, "#fcb69f");
      gradient.addColorStop(0.6, "#ff9a9e");
      gradient.addColorStop(1, "#fecfef");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    primaryColor: "#e91e63",
    secondaryColor: "#f8bbd9",
    textColor: "#ffffff",
    accentColor: "#ffd1dc",
    shadowColor: "rgba(233, 30, 99, 0.9)"
  },
  royal: {
    name: "Royal Rank",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(0.3, "#764ba2");
      gradient.addColorStop(0.7, "#9932cc");
      gradient.addColorStop(1, "#4b0082");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    primaryColor: "#ffd700",
    secondaryColor: "#dda0dd",
    textColor: "#ffffff",
    accentColor: "#e6e6fa",
    shadowColor: "rgba(255, 215, 0, 0.9)"
  },
  sunset: {
    name: "Sunset Rank",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#ff9a9e");
      gradient.addColorStop(0.3, "#fecfef");
      gradient.addColorStop(0.7, "#fecfef");
      gradient.addColorStop(1, "#ff6b6b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    primaryColor: "#ff1744",
    secondaryColor: "#ff4081",
    textColor: "#ffffff",
    accentColor: "#ffb6c1",
    shadowColor: "rgba(255, 23, 68, 0.9)"
  },
  ocean: {
    name: "Ocean Rank",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(0.5, "#764ba2");
      gradient.addColorStop(1, "#a8edea");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    primaryColor: "#ff6b9d",
    secondaryColor: "#4facfe",
    textColor: "#ffffff",
    accentColor: "#87ceeb",
    shadowColor: "rgba(255, 107, 157, 0.9)"
  }
};

const rankMessages = [
  "Keep climbing to the top",
  "Your journey continues",
  "Every step counts",
  "Greatness awaits you",
  "You're on fire today",
  "Level up your game",
  "Destined for greatness",
  "Rising through the ranks",
  "Your potential is limitless",
  "The best is yet to come",
  "Never stop improving",
  "You're making progress",
  "Success is in your path",
  "Keep pushing forward",
  "Stars are within reach"
];

const decorativeSymbols = ["♥", "♡", "♦", "♧", "♠", "♣", "♢", "◊", "◈", "✦", "✧", "✩", "✪", "✫", "✬", "✭", "✮", "✯", "✰", "✱", "✲", "✳", "✴", "✵", "✶", "✷", "✸", "✹", "✺", "✻", "✼", "✽", "✾", "✿", "❀", "❁", "❂", "❃", "❅", "❆", "❇"];

const deltaNext = 5;

function expToLevel(exp) {
  return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}

function levelToExp(level) {
  return Math.floor(((level ** 2 - level) * deltaNext) / 2);
}

function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function drawEnhancedHeart(ctx, x, y, size, color, glowIntensity = 20) {
  ctx.shadowColor = color;
  ctx.shadowBlur = glowIntensity * 2;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.3;

  for (let i = 0; i < 3; i++) {
    const glowSize = size + (i * 5);
    ctx.beginPath();
    ctx.moveTo(x, y + glowSize / 4);
    ctx.bezierCurveTo(x, y, x - glowSize / 2, y, x - glowSize / 2, y + glowSize / 4);
    ctx.bezierCurveTo(x - glowSize / 2, y + glowSize / 2, x, y + glowSize, x, y + glowSize);
    ctx.bezierCurveTo(x, y + glowSize, x + glowSize / 2, y + glowSize / 2, x + glowSize / 2, y + glowSize / 4);
    ctx.bezierCurveTo(x + glowSize / 2, y, x, y, x, y + glowSize / 4);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = glowIntensity;
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size, x, y + size);
  ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.fill();

  const gradient = ctx.createLinearGradient(x - size/4, y, x + size/4, y + size);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
  ctx.fillStyle = gradient;
  ctx.shadowBlur = 0;
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}

function drawFloatingElements(ctx, width, height, theme) {
  const elements = 60;
  for (let i = 0; i < elements; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 4 + Math.random() * 15;
    const alpha = 0.2 + Math.random() * 0.5;

    ctx.globalAlpha = alpha;

    if (i % 4 === 0) {
      const symbol = decorativeSymbols[Math.floor(Math.random() * decorativeSymbols.length)];
      try {
        ctx.font = `${size}px BeVietnamPro-Regular, Arial, sans-serif`;
      } catch {
        ctx.font = `${size}px Arial`;
      }
      ctx.fillStyle = theme.accentColor;
      ctx.fillText(symbol, x, y);
    } else if (i % 3 === 0) {
      const heartColor = i % 2 === 0 ? theme.primaryColor : theme.accentColor;
      drawEnhancedHeart(ctx, x, y, size, heartColor, 8);
    } else {
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = size;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }
  }
  ctx.globalAlpha = 1;
}

function drawMagicalBorder(ctx, width, height, theme) {
  const borderWidth = 25;

  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth = 8;
  ctx.shadowColor = theme.primaryColor;
  ctx.shadowBlur = 15;
  ctx.setLineDash([15, 10]);
  ctx.strokeRect(borderWidth/4, borderWidth/4, width - (borderWidth/2), height - (borderWidth/2));
  ctx.setLineDash([]);

  ctx.strokeStyle = theme.secondaryColor;
  ctx.lineWidth = 5;
  ctx.shadowBlur = 10;
  ctx.strokeRect(borderWidth/2, borderWidth/2, width - borderWidth, height - borderWidth);

  ctx.strokeStyle = theme.primaryColor;
  ctx.lineWidth = 4;
  ctx.shadowBlur = 8;
  ctx.strokeRect(borderWidth * 2/3, borderWidth * 2/3, width - (borderWidth * 4/3), height - (borderWidth * 4/3));

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  const cornerSize = 25;
  drawEnhancedHeart(ctx, borderWidth, borderWidth, cornerSize, theme.primaryColor, 20);
  drawEnhancedHeart(ctx, width - borderWidth - cornerSize, borderWidth, cornerSize, theme.primaryColor, 20);
  drawEnhancedHeart(ctx, borderWidth, height - borderWidth - cornerSize, cornerSize, theme.primaryColor, 20);
  drawEnhancedHeart(ctx, width - borderWidth - cornerSize, height - borderWidth - cornerSize, cornerSize, theme.primaryColor, 20);
}

function drawEnhancedText(ctx, text, x, y, fontSize, theme, style = 'bold', align = 'center') {
  try {
    ctx.font = `${style} ${fontSize}px BeVietnamPro-Bold, Arial, sans-serif`;
  } catch {
    ctx.font = `${style} ${fontSize}px Arial`;
  }

  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  const shadowLayers = [
    { blur: 25, offsetX: 6, offsetY: 6, color: "rgba(0, 0, 0, 0.4)" },
    { blur: 15, offsetX: 4, offsetY: 4, color: theme.shadowColor },
    { blur: 10, offsetX: 2, offsetY: 2, color: theme.accentColor }
  ];

  shadowLayers.forEach(shadow => {
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
    ctx.fillStyle = theme.textColor;
    ctx.fillText(text, x, y);
  });

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const gradient = ctx.createLinearGradient(x - 50, y - fontSize/2, x + 50, y + fontSize/2);
  gradient.addColorStop(0, theme.textColor);
  gradient.addColorStop(0.5, "#ffffff");
  gradient.addColorStop(1, theme.textColor);
  ctx.fillStyle = gradient;
  ctx.fillText(text, x, y);

  ctx.strokeStyle = theme.primaryColor;
  ctx.lineWidth = 1.5;
  ctx.strokeText(text, x, y);
}

function drawMagicalAvatarFrame(ctx, x, y, size, theme) {
  const centerX = x + size/2;
  const centerY = y + size/2;
  const radius = size/2;

  const rings = [
    { radius: radius + 15, width: 6, color: theme.accentColor, blur: 20 },
    { radius: radius + 10, width: 4, color: theme.secondaryColor, blur: 15 },
    { radius: radius + 5, width: 3, color: theme.primaryColor, blur: 10 }
  ];

  rings.forEach(ring => {
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = ring.width;
    ctx.shadowColor = ring.color;
    ctx.shadowBlur = ring.blur;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  const decorations = 8;
  for (let i = 0; i < decorations; i++) {
    const angle = (i * Math.PI * 2) / decorations;
    const decorX = centerX + Math.cos(angle) * (radius + 22);
    const decorY = centerY + Math.sin(angle) * (radius + 22);

    if (i % 2 === 0) {
      drawEnhancedHeart(ctx, decorX - 6, decorY - 6, 12, theme.primaryColor, 10);
    } else {
      try {
        ctx.font = `14px BeVietnamPro-Regular, Arial, sans-serif`;
      } catch {
        ctx.font = `14px Arial`;
      }
      ctx.fillStyle = theme.accentColor;
      const symbol = decorativeSymbols[Math.floor(Math.random() * decorativeSymbols.length)];
      ctx.fillText(symbol, decorX, decorY);
    }
  }
}

function drawRomanticPattern(ctx, width, height, theme) {
  const patterns = ["♥", "♡", "♦", "♧", "✦", "✧"];
  
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 10 + Math.random() * 14;
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    try {
      ctx.font = `${size}px BeVietnamPro-Regular, Arial, sans-serif`;
    } catch {
      ctx.font = `${size}px Arial`;
    }
    ctx.fillStyle = theme.secondaryColor;
    ctx.globalAlpha = 0.2 + Math.random() * 0.3;
    ctx.fillText(pattern, x, y);
  }
  ctx.globalAlpha = 1;
}

function drawProgressBar(ctx, x, y, width, height, progress, theme) {
  ctx.shadowColor = theme.primaryColor;
  ctx.shadowBlur = 15;
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.roundRect(x, y, width, height, height/2);
  ctx.fill();
  
  ctx.shadowBlur = 10;
  ctx.fillStyle = theme.secondaryColor;
  const barWidth = (width * progress) / 100;
  ctx.roundRect(x, y, barWidth, height, height/2);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  const gradient = ctx.createLinearGradient(x, y, x + barWidth, y + height);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
  ctx.fillStyle = gradient;
  ctx.roundRect(x, y, barWidth, height/2, height/4);
  ctx.fill();
  
  ctx.strokeStyle = theme.primaryColor;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 8;
  ctx.roundRect(x, y, width, height, height/2);
  ctx.stroke();
  
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}

async function drawRankCard(data, theme) {
  const W = 1200, H = 600;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  theme.background(ctx, W, H);

  drawRomanticPattern(ctx, W, H, theme);

  drawFloatingElements(ctx, W, H, theme);

  drawMagicalBorder(ctx, W, H, theme);

  const centerX = 600, centerY = 160, radius = 100;

  drawMagicalAvatarFrame(ctx, centerX - radius, centerY - radius, radius * 2, theme);

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(data.avatar, centerX - radius, centerY - radius, radius * 2, radius * 2);
  ctx.restore();

  drawEnhancedText(ctx, data.name, W / 2, 320, 44, theme, 'bold', 'center');

  const randomMessage = rankMessages[Math.floor(Math.random() * rankMessages.length)];
  drawEnhancedText(ctx, randomMessage, W / 2, 380, 28, theme, 'normal', 'center');

  const leftX = 133, topY = 420, gap = 38;
  
  try {
    ctx.font = `24px BeVietnamPro-Regular, Arial, sans-serif`;
  } catch {
    ctx.font = `24px Arial`;
  }
  ctx.textAlign = "left";
  ctx.shadowColor = theme.shadowColor;
  ctx.shadowBlur = 8;
  ctx.fillStyle = theme.textColor;

  [
    `🆔 UID: ${data.uid}`,
    `💬 Nickname: ${data.nickname || data.name}`,
    `🚻 Gender: ${data.gender}`,
    `🌐 Username: ${data.username}`,
    `⭐ Level: ${data.level}`
  ].forEach((text, i) => ctx.fillText(text, leftX, topY + i * gap));

  const rightX = 700;
  [
    `⚡ EXP: ${data.exp} / ${data.requiredExp}`,
    `🏆 Rank: #${data.rank}`,
    `💰 Money: ${data.money}`,
    `💸 Money Rank: #${data.moneyRank || "N/A"}`
  ].forEach((text, i) => ctx.fillText(text, rightX, topY + i * gap));

  ctx.shadowBlur = 0;

  const progressPercent = (data.exp / data.requiredExp) * 100;
  drawProgressBar(ctx, W/2 - 250, 520, 500, 20, progressPercent, theme);

  try {
    ctx.font = `18px BeVietnamPro-Regular, Arial, sans-serif`;
  } catch {
    ctx.font = `18px Arial`;
  }
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.textAlign = "center";
  ctx.fillText(`🕓 Updated: ${moment().tz("Asia/Dhaka").format("YYYY-MM-DD hh:mm A")}`, W / 2, H - 30);

  try {
    ctx.font = `italic 14px BeVietnamPro-Regular, Arial, sans-serif`;
  } catch {
    ctx.font = `italic 14px Arial`;
  }
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.textAlign = "left";
  ctx.fillText("Christus Rank • v6.0", 40, H - 20);

  ctx.textAlign = "right";
  ctx.fillText(`❤️ ${theme.name} ❤️`, W - 40, H - 20);

  for (let i = 0; i < 15; i++) {
    const x = 20 + Math.random() * (W - 40);
    const y = 20 + Math.random() * (H - 40);
    const symbol = decorativeSymbols[Math.floor(Math.random() * decorativeSymbols.length)];
    try {
      ctx.font = `${12 + Math.random() * 8}px BeVietnamPro-Regular, Arial, sans-serif`;
    } catch {
      ctx.font = `${12 + Math.random() * 8}px Arial`;
    }
    ctx.globalAlpha = 0.3 + Math.random() * 0.3;
    ctx.fillStyle = theme.accentColor;
    ctx.fillText(symbol, x, y);
  }
  ctx.globalAlpha = 1;

  const fileName = `rank_${data.uid}_${randomString(6)}.png`;
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    fs.ensureDirSync(cacheDir);
  }
  const filePath = path.join(cacheDir, fileName);
  fs.writeFileSync(filePath, canvas.toBuffer("image/png"));
  return filePath;
}

module.exports = {
  config: {
    name: "rank",
    version: "6.0",
    author: "Christus",
    countDown: 5,
    role: 0,
    description: canvasAvailable ? "🏆 Carte de rank romantique avec thèmes aléatoires" : "🏆 Système de rank (mode texte)",
    category: "rank",
    guide: {
      fr: canvasAvailable ?
        "{pn} - voir ta carte de rank\n{pn} @utilisateur - voir la carte d'un autre\n{pn} [userID] - voir par ID" :
        "{pn} - voir ton rank\n{pn} @utilisateur - voir le rank d'un autre"
    }
  },

  onStart: async function ({ api, event, args, usersData, message }) {
    if (!canvasAvailable) {
      return message.reply(fonts?.bold ? 
        fonts.bold("⚠️ Le module canvas n'est pas installé. Utilisation du mode texte.") : 
        "⚠️ Le module canvas n'est pas installé. Utilisation du mode texte.");
    }

    try {
      const { senderID, mentions, messageReply } = event;
      const uid = Object.keys(mentions)[0] || args[0] || (messageReply?.senderID || senderID);

      const allUsers = await usersData.getAll();
      const sortedExp = allUsers.map(u => ({ id: u.userID, exp: u.exp || 0, money: u.money || 0 }))
        .sort((a, b) => b.exp - a.exp);
      const rank = sortedExp.findIndex(u => u.id === uid) + 1;

      const sortedMoney = [...allUsers].sort((a, b) => (b.money || 0) - (a.money || 0));
      const moneyRank = sortedMoney.findIndex(u => u.userID === uid) + 1;

      const userData = await usersData.get(uid);
      if (!userData) return message.reply("❌ User data not found.");
      
      const uInfo = await api.getUserInfo(uid);
      const info = uInfo[uid];
      if (!info) return message.reply("❌ Failed to fetch user info.");

      const exp = userData.exp || 0;
      const level = expToLevel(exp);
      const nextExp = levelToExp(level + 1);
      const currentExp = levelToExp(level);
      const progressExp = exp - currentExp;
      const requiredExp = nextExp - currentExp;

      let avatar;
      try {
        const avatarUrl = await usersData.getAvatarUrl(uid);
        avatar = await loadImage(avatarUrl);
      } catch {
        avatar = await loadImage("https://i.imgur.com/I3VsBEt.png");
      }

      const themeNames = Object.keys(rankThemes);
      const selectedTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
      const theme = rankThemes[selectedTheme];

      const drawData = {
        avatar,
        name: info.name || "User",
        uid,
        username: (info.vanity && info.vanity.trim() !== "") ? info.vanity : "Not Set",
        gender: ["Unknown", "Girl 🙋🏻‍♀️", "Boy 🙋🏻‍♂️"][info.gender] || "Unknown",
        nickname: userData.nickname || info.name || "User",
        level,
        exp: progressExp,
        requiredExp,
        money: userData.money || 0,
        totalMsg: userData.totalMsg || 0,
        rank,
        moneyRank
      };

      const filePath = await drawRankCard(drawData, theme);
      
      const responseBody = fonts?.bold ? 
        fonts.bold(`💖 ${theme.name} 💖\n🏆 Rank de ${info.name} : #${rank}\n✨ ${rankMessages[Math.floor(Math.random() * rankMessages.length)]}`) : 
        `💖 ${theme.name} 💖\n🏆 Rank de ${info.name} : #${rank}\n✨ ${rankMessages[Math.floor(Math.random() * rankMessages.length)]}`;

      await message.reply({
        body: responseBody,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }, 30000);

    } catch (err) {
      console.error("Rank command error:", err);
      const errorMsg = fonts?.bold ? 
        fonts.bold(`❌ Une erreur s'est produite : ${err.message}`) : 
        `❌ Une erreur s'est produite : ${err.message}`;
      return message.reply(errorMsg);
    }
  }
};