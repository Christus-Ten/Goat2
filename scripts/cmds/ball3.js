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

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

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

const balanceThemes = {
  paradise: {
    name: "Paradise Love",
    background: (ctx, width, height) => {
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
      gradient.addColorStop(0, "#ffb3d9");
      gradient.addColorStop(0.3, "#ff6bb3");
      gradient.addColorStop(0.6, "#e056fd");
      gradient.addColorStop(1, "#7c3aed");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    heartColor: "#ff1744",
    textColor: "#ffffff",
    shadowColor: "rgba(255, 23, 68, 0.9)",
    accentColor: "#ff69b4",
    secondary: "#ffc0cb"
  },
  cosmic: {
    name: "Cosmic Romance",
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
    heartColor: "#ff6b9d",
    textColor: "#ffffff",
    shadowColor: "rgba(255, 107, 157, 0.9)",
    accentColor: "#c471ed",
    secondary: "#a8edea"
  },
  enchanted: {
    name: "Enchanted Garden",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#ffecd2");
      gradient.addColorStop(0.3, "#fcb69f");
      gradient.addColorStop(0.6, "#ff9a9e");
      gradient.addColorStop(1, "#fecfef");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    heartColor: "#e91e63",
    textColor: "#ffffff",
    shadowColor: "rgba(233, 30, 99, 0.9)",
    accentColor: "#f8bbd9",
    secondary: "#ffd1dc"
  },
  royal: {
    name: "Royal Love",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(0.3, "#764ba2");
      gradient.addColorStop(0.7, "#9932cc");
      gradient.addColorStop(1, "#4b0082");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    heartColor: "#ffd700",
    textColor: "#ffffff",
    shadowColor: "rgba(255, 215, 0, 0.9)",
    accentColor: "#dda0dd",
    secondary: "#e6e6fa"
  },
  sunset: {
    name: "Dreamy Sunset",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#ff9a9e");
      gradient.addColorStop(0.3, "#fecfef");
      gradient.addColorStop(0.7, "#fecfef");
      gradient.addColorStop(1, "#ff6b6b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    heartColor: "#ff1744",
    textColor: "#ffffff",
    shadowColor: "rgba(255, 23, 68, 0.9)",
    accentColor: "#ff4081",
    secondary: "#ffb6c1"
  },
  ocean: {
    name: "Ocean Dreams",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(0.5, "#764ba2");
      gradient.addColorStop(1, "#a8edea");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    },
    heartColor: "#ff6b9d",
    textColor: "#ffffff",
    shadowColor: "rgba(255, 107, 157, 0.9)",
    accentColor: "#4facfe",
    secondary: "#87ceeb"
  }
};

const romanticMessages = [
  "Love is in the air",
  "Perfect match made in heaven",
  "Two hearts beating as one",
  "Love conquers all",
  "Soulmates found",
  "Forever and always",
  "Love blooms eternal",
  "Hearts intertwined",
  "Love takes flight",
  "Cupid's perfect shot",
  "Destined to be together",
  "Written in the stars",
  "Magical love story",
  "Sweet romance",
  "Moonlight serenade"
];

const decorativeSymbols = ["♥", "♡", "♦", "♧", "♠", "♣", "♢", "◊", "◈", "✦", "✧", "✩", "✪", "✫", "✬", "✭", "✮", "✯", "✰", "✱", "✲", "✳", "✴", "✵", "✶", "✷", "✸", "✹", "✺", "✻", "✼", "✽", "✾", "✿", "❀", "❁", "❂", "❃", "❅", "❆", "❇"];

const moneyEmojis = ["💰", "💎", "💵", "💶", "💷", "💳", "🪙", "🏦"];

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
      const heartColor = i % 2 === 0 ? theme.heartColor : theme.accentColor;
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

  ctx.strokeStyle = theme.secondary;
  ctx.lineWidth = 8;
  ctx.shadowColor = theme.accentColor;
  ctx.shadowBlur = 15;
  ctx.setLineDash([15, 10]);
  ctx.strokeRect(borderWidth/4, borderWidth/4, width - (borderWidth/2), height - (borderWidth/2));
  ctx.setLineDash([]);

  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth = 5;
  ctx.shadowBlur = 10;
  ctx.strokeRect(borderWidth/2, borderWidth/2, width - borderWidth, height - borderWidth);

  ctx.strokeStyle = theme.heartColor;
  ctx.lineWidth = 4;
  ctx.shadowBlur = 8;
  ctx.strokeRect(borderWidth * 2/3, borderWidth * 2/3, width - (borderWidth * 4/3), height - (borderWidth * 4/3));

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  const cornerSize = 25;
  drawEnhancedHeart(ctx, borderWidth, borderWidth, cornerSize, theme.heartColor, 20);
  drawEnhancedHeart(ctx, width - borderWidth - cornerSize, borderWidth, cornerSize, theme.heartColor, 20);
  drawEnhancedHeart(ctx, borderWidth, height - borderWidth - cornerSize, cornerSize, theme.heartColor, 20);
  drawEnhancedHeart(ctx, width - borderWidth - cornerSize, height - borderWidth - cornerSize, cornerSize, theme.heartColor, 20);
}

function drawEnhancedText(ctx, text, x, y, fontSize, theme, style = 'bold') {
  try {
    ctx.font = `${style} ${fontSize}px BeVietnamPro-Bold, Arial, sans-serif`;
  } catch {
    ctx.font = `${style} ${fontSize}px Arial`;
  }

  ctx.textAlign = "center";
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

  ctx.strokeStyle = theme.heartColor;
  ctx.lineWidth = 1.5;
  ctx.strokeText(text, x, y);
}

function drawMagicalAvatarFrame(ctx, x, y, size, theme) {
  const centerX = x + size/2;
  const centerY = y + size/2;
  const radius = size/2;

  const rings = [
    { radius: radius + 15, width: 6, color: theme.secondary, blur: 20 },
    { radius: radius + 10, width: 4, color: theme.accentColor, blur: 15 },
    { radius: radius + 5, width: 3, color: theme.heartColor, blur: 10 }
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
      drawEnhancedHeart(ctx, decorX - 6, decorY - 6, 12, theme.heartColor, 10);
    } else {
      ctx.font = "14px Arial";
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
    ctx.fillStyle = theme.secondary;
    ctx.globalAlpha = 0.2 + Math.random() * 0.3;
    ctx.fillText(pattern, x, y);
  }
  ctx.globalAlpha = 1;
}

const formatMoney = (amount) => {
  if (isNaN(amount)) return "0$";
  amount = Number(amount);
  const scales = [
    { value: 1e15, suffix: 'Q' },
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'k' }
  ];
  const scale = scales.find(s => amount >= s.value);
  if (scale) return `${(amount / scale.value).toFixed(1)}${scale.suffix}$`;
  return `${amount.toLocaleString()}$`;
};

const fetchAvatar = async (userID, createCanvas, loadImage) => {
  try {
    let avatarURL = `https://graph.facebook.com/${userID}/picture?type=large&width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const res = await axios.get(avatarURL, { responseType: "arraybuffer", timeout: 10000 });
    return await loadImage(Buffer.from(res.data));
  } catch (e) {
    const size = 200;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${size/2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(userID.charAt(0).toUpperCase(), size/2, size/2);
    return canvas;
  }
};

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "$", "cash"],
    version: "7.0",
    author: "Christus",
    countDown: 3,
    role: 0,
    description: canvasAvailable ? "💰 Carte de solde romantique avec thèmes aléatoires" : "💰 Système économique (mode texte)",
    category: "economy",
    guide: {
      fr: canvasAvailable ?
        "{pn} - voir ta carte de solde (thème aléatoire)\n{pn} @utilisateur - voir la carte d'un autre\n{pn} t @utilisateur montant - transférer de l'argent" :
        "{pn} - voir ton solde\n{pn} @utilisateur - voir le solde d'un autre\n{pn} t @utilisateur montant - transférer de l'argent"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID, mentions, messageReply } = event;

    if (!canvasAvailable) {
      return message.reply(fonts?.bold ? 
        fonts.bold("⚠️ Le module canvas n'est pas installé. Utilisation du mode texte.") : 
        "⚠️ Le module canvas n'est pas installé. Utilisation du mode texte.");
    }

    try {
      if (args[0]?.toLowerCase() === "t") {
        let targetID = Object.keys(mentions)[0] || messageReply?.senderID;
        const amountRaw = args.find(a => !isNaN(a));
        const amount = parseFloat(amountRaw);

        if (!targetID || isNaN(amount)) {
          return message.reply(fonts?.bold ? 
            fonts.bold("❌ Usage : !balance t @utilisateur montant") : 
            "❌ Usage : !balance t @utilisateur montant");
        }
        if (targetID === senderID) {
          return message.reply(fonts?.bold ? 
            fonts.bold("❌ Vous ne pouvez pas vous envoyer de l'argent.") : 
            "❌ Vous ne pouvez pas vous envoyer de l'argent.");
        }
        if (amount <= 0) {
          return message.reply(fonts?.bold ? 
            fonts.bold("❌ Le montant doit être supérieur à 0.") : 
            "❌ Le montant doit être supérieur à 0.");
        }

        const sender = await usersData.get(senderID);
        const receiver = await usersData.get(targetID);
        
        if (!receiver) {
          return message.reply(fonts?.bold ? 
            fonts.bold("❌ Utilisateur cible introuvable.") : 
            "❌ Utilisateur cible introuvable.");
        }

        const taxRate = 5;
        const tax = Math.ceil(amount * taxRate / 100);
        const total = amount + tax;

        if (sender.money < total) {
          const response = `❌ Fonds insuffisants.\nNécessaire : ${formatMoney(total)}\nVous avez : ${formatMoney(sender.money)}`;
          return message.reply(fonts?.bold ? fonts.bold(response) : response);
        }

        await Promise.all([
          usersData.set(senderID, { ...sender, money: sender.money - total }),
          usersData.set(targetID, { ...receiver, money: (receiver.money || 0) + amount })
        ]);

        const receiverName = await usersData.getName(targetID);
        const response = `✅ Transfert réussi ! 💸\n➤ Vers : ${receiverName}\n➤ Montant envoyé : ${formatMoney(amount)}\n➤ Taxe : ${formatMoney(tax)}\n➤ Total débité : ${formatMoney(total)}`;
        return message.reply(fonts?.bold ? fonts.bold(response) : response);
      }

      let targetID;
      if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
      else if (messageReply) targetID = messageReply.senderID;
      else targetID = senderID;

      const name = await usersData.getName(targetID);
      const money = await usersData.get(targetID, "money") || 0;
      
      const avatar = await fetchAvatar(targetID, createCanvas, loadImage);
      
      const width = 800, height = 450;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      const themeNames = Object.keys(balanceThemes);
      const selectedTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
      const theme = balanceThemes[selectedTheme];
      
      theme.background(ctx, width, height);
      
      drawRomanticPattern(ctx, width, height, theme);
      
      drawFloatingElements(ctx, width, height, theme);
      
      drawMagicalBorder(ctx, width, height, theme);
      
      const avatarSize = 120;
      const avatarX = 120;
      const avatarY = 150;
      
      drawMagicalAvatarFrame(ctx, avatarX, avatarY, avatarSize, theme);
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();
      
      drawEnhancedText(ctx, theme.name, width/2, 80, 40, theme);
      
      drawEnhancedText(ctx, "💎 Balance Card 💎", width/2, 130, 30, theme);
      
      drawEnhancedText(ctx, name, width - 200, 180, 28, theme);
      
      const randomEmoji = moneyEmojis[Math.floor(Math.random() * moneyEmojis.length)];
      try {
        ctx.font = `20px BeVietnamPro-Regular, Arial, sans-serif`;
      } catch {
        ctx.font = `20px Arial`;
      }
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.textAlign = "right";
      ctx.fillText(`${randomEmoji} ${targetID}`, width - 100, 220);
      
      drawEnhancedText(ctx, formatMoney(money), width - 200, 280, 48, theme);
      
      const randomMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
      drawEnhancedText(ctx, randomMessage, width/2, 350, 26, theme);
      
      const now = new Date();
      const dateStr = now.toLocaleDateString('fr-FR');
      try {
        ctx.font = `16px BeVietnamPro-Regular, Arial, sans-serif`;
      } catch {
        ctx.font = `16px Arial`;
      }
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.textAlign = "center";
      ctx.fillText(dateStr, width/2, 400);
      
      try {
        ctx.font = `italic 14px BeVietnamPro-Regular, Arial, sans-serif`;
      } catch {
        ctx.font = `italic 14px Arial`;
      }
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.textAlign = "left";
      ctx.fillText("Christus Bank", 40, height - 30);
      
      ctx.textAlign = "right";
      ctx.fillText("❤️ Love & Money ❤️", width - 40, height - 30);
      
      for (let i = 0; i < 15; i++) {
        const x = 20 + Math.random() * (width - 40);
        const y = 20 + Math.random() * (height - 40);
        const symbol = decorativeSymbols[Math.floor(Math.random() * decorativeSymbols.length)];
        try {
          ctx.font = `${12 + Math.random() * 8}px BeVietnamPro-Regular, Arial, sans-serif`;
        } catch {
          ctx.font = `${12 + Math.random() * 8}px Arial`;
        }
        ctx.globalAlpha = 0.4 + Math.random() * 0.3;
        ctx.fillStyle = theme.accentColor;
        ctx.fillText(symbol, x, y);
      }
      ctx.globalAlpha = 1;
      
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.ensureDirSync(cacheDir);
      }
      
      const filePath = path.join(cacheDir, `balance_${targetID}_${Date.now()}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      const responseBody = fonts?.bold ? 
        fonts.bold(`💖 ${theme.name} 💖\n💰 Solde de ${name} : ${formatMoney(money)}\n✨ ${randomMessage}`) : 
        `💖 ${theme.name} 💖\n💰 Solde de ${name} : ${formatMoney(money)}\n✨ ${randomMessage}`;

      return message.reply({
        body: responseBody,
        attachment: fs.createReadStream(filePath)
      }, () => {
        fs.unlinkSync(filePath);
      });

    } catch (err) {
      console.error("Balance command error:", err);
      const errorMsg = fonts?.bold ? 
        fonts.bold(`❌ Une erreur s'est produite : ${err.message}`) : 
        `❌ Une erreur s'est produite : ${err.message}`;
      return message.reply(errorMsg);
    }
  }
};