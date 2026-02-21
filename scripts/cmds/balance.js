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
  fonts = require('../../func/font.js');
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
  emerald: {
    name: "Émeraude Royale",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0f2027");
      gradient.addColorStop(0.5, "#203a43");
      gradient.addColorStop(1, "#2c5364");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = "rgba(255, 215, 0, 0.1)";
      ctx.lineWidth = 2;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
      }
    },
    primaryColor: "#FFD700",
    secondaryColor: "#00FF7F",
    textColor: "#FFFFFF",
    accentColor: "#FF69B4",
    cardBg: "rgba(255,255,255,0.08)"
  },
  royal: {
    name: "Pourpre Royal",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#2b0a3d");
      gradient.addColorStop(0.5, "#4a1e6b");
      gradient.addColorStop(1, "#6b2d8c");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = "rgba(255, 215, 0, 0.05)";
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    primaryColor: "#FFD700",
    secondaryColor: "#FF69B4",
    textColor: "#FFFFFF",
    accentColor: "#9370DB",
    cardBg: "rgba(255,255,255,0.1)"
  },
  ocean: {
    name: "Océan Profond",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#005AA7");
      gradient.addColorStop(0.5, "#0077BE");
      gradient.addColorStop(1, "#00BFFF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height * 0.7 + i * 20);
        for (let x = 0; x < width; x += 20) {
          ctx.lineTo(x, height * 0.7 + i * 20 + Math.sin(x * 0.05) * 10);
        }
        ctx.stroke();
      }
    },
    primaryColor: "#FFD700",
    secondaryColor: "#40E0D0",
    textColor: "#FFFFFF",
    accentColor: "#FF69B4",
    cardBg: "rgba(255,255,255,0.1)"
  },
  sunset: {
    name: "Coucher de Soleil",
    background: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#FF416C");
      gradient.addColorStop(0.5, "#FF4B2B");
      gradient.addColorStop(1, "#FF8C00");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(100 + i * 80, 80, 40, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    primaryColor: "#FFFFFF",
    secondaryColor: "#FFD700",
    textColor: "#FFFFFF",
    accentColor: "#FF69B4",
    cardBg: "rgba(0,0,0,0.2)"
  },
  neon: {
    name: "Néon City",
    background: (ctx, width, height) => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    },
    primaryColor: "#00FFFF",
    secondaryColor: "#FF00FF",
    textColor: "#FFFFFF",
    accentColor: "#FFFF00",
    cardBg: "rgba(255,255,255,0.05)"
  }
};

const moneyEmojis = ["💰", "💎", "💵", "💶", "💷", "💳", "🪙", "🏦"];

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

const drawBalanceCard = (ctx, width, height, theme, name, userID, money, formattedMoney) => {
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  
  ctx.fillStyle = theme.cardBg;
  ctx.roundRect(40, 40, width - 80, height - 80, 20);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.strokeStyle = theme.primaryColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = theme.primaryColor;
  ctx.shadowBlur = 15;
  ctx.stroke();
  ctx.shadowBlur = 0;

  try {
    ctx.font = `bold 36px BeVietnamPro-Bold, Arial, sans-serif`;
  } catch {
    ctx.font = "bold 36px Arial";
  }
  ctx.fillStyle = theme.primaryColor;
  ctx.textAlign = "center";
  ctx.fillText(`⚡ ${theme.name} ⚡`, width / 2, 80);

  ctx.strokeStyle = theme.secondaryColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  ctx.moveTo(80, 110);
  ctx.lineTo(width - 80, 110);
  ctx.stroke();
  ctx.setLineDash([]);

  return {
    textX: 200,
    textY: 160
  };
};

const drawStyledText = (ctx, text, x, y, fontSize, color, theme, align = 'left', style = 'bold') => {
  try {
    ctx.font = `${style} ${fontSize}px BeVietnamPro-Bold, Arial, sans-serif`;
  } catch {
    ctx.font = `${style} ${fontSize}px Arial`;
  }
  ctx.fillStyle = color;
  ctx.textAlign = align;
  
  ctx.shadowColor = theme.primaryColor;
  ctx.shadowBlur = 10;
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
};

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "$", "cash"],
    version: "6.0",
    author: "Christus",
    countDown: 3,
    role: 0,
    description: canvasAvailable ? "💰 Système économique stylé avec cartes premium" : "💰 Système économique (mode texte)",
    category: "economy",
    guide: {
      fr: canvasAvailable ?
        "{pn} - voir ton solde\n{pn} @utilisateur - voir le solde d'un autre\n{pn} t @utilisateur montant - transférer de l'argent\n{pn} theme [nom] - changer de thème" :
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

      const themeNames = Object.keys(balanceThemes);
      let selectedTheme = "emerald";
      
      const userData = await usersData.get(senderID);
      if (userData?.data?.balanceTheme && themeNames.includes(userData.data.balanceTheme)) {
        selectedTheme = userData.data.balanceTheme;
      }
      
      if (args[0]?.toLowerCase() === "theme") {
        if (args[1] && themeNames.includes(args[1].toLowerCase())) {
          selectedTheme = args[1].toLowerCase();
          await usersData.set(senderID, {
            ...userData,
            data: { ...(userData.data || {}), balanceTheme: selectedTheme }
          });
          return message.reply(fonts?.bold ? 
            fonts.bold(`🎨 Thème changé pour : ${balanceThemes[selectedTheme].name}`) : 
            `🎨 Thème changé pour : ${balanceThemes[selectedTheme].name}`);
        } else {
          const response = `🎨 Thèmes disponibles :\n${themeNames.map(t => `• ${balanceThemes[t].name}`).join('\n')}`;
          return message.reply(fonts?.bold ? fonts.bold(response) : response);
        }
      }

      let targetID;
      if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
      else if (messageReply) targetID = messageReply.senderID;
      else targetID = senderID;

      const name = await usersData.getName(targetID);
      const money = await usersData.get(targetID, "money") || 0;
      
      const avatar = await fetchAvatar(targetID, createCanvas, loadImage);
      
      const width = 700, height = 350;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      
      const theme = balanceThemes[selectedTheme];
      
      theme.background(ctx, width, height);
      
      const textPos = drawBalanceCard(ctx, width, height, theme, name, targetID, money, formatMoney(money));
      
      const avatarSize = 100;
      const avatarX = 70, avatarY = 130;
      
      ctx.shadowColor = theme.primaryColor;
      ctx.shadowBlur = 20;
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      drawStyledText(ctx, `💎 ${name}`, 200, 160, 32, theme.textColor, theme, 'left');
      
      const randomEmoji = moneyEmojis[Math.floor(Math.random() * moneyEmojis.length)];
      drawStyledText(ctx, `${randomEmoji} ${targetID}`, 200, 200, 22, "#AAAAAA", theme, 'left', 'normal');
      
      ctx.shadowColor = theme.secondaryColor;
      ctx.shadowBlur = 25;
      drawStyledText(ctx, formatMoney(money), width / 2, 260, 48, theme.secondaryColor, theme, 'center');
      ctx.shadowBlur = 0;
      
      const now = new Date();
      const dateStr = now.toLocaleDateString('fr-FR');
      const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      try {
        ctx.font = `16px BeVietnamPro-Regular, Arial, sans-serif`;
      } catch {
        ctx.font = "16px Arial";
      }
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "right";
      ctx.fillText(`${dateStr} ${timeStr}`, width - 60, height - 60);
      
      try {
        ctx.font = `italic 14px BeVietnamPro-Regular, Arial, sans-serif`;
      } catch {
        ctx.font = "italic 14px Arial";
      }
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.textAlign = "left";
      ctx.fillText("Christus Bank • v6.0", 60, height - 60);
      
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.ensureDirSync(cacheDir);
      }
      
      const filePath = path.join(cacheDir, `balance_${targetID}_${Date.now()}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      const responseBody = fonts?.bold ? 
        fonts.bold(`💎 ${theme.name} 💎\n💰 Solde de ${name} : ${formatMoney(money)}`) : 
        `💎 ${theme.name} 💎\n💰 Solde de ${name} : ${formatMoney(money)}`;

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
