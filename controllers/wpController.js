const puppeteer = require("puppeteer");
const { Client, LocalAuth } = require("whatsapp-web.js");
var qrcode = require("qrcode");
const userController = require("./userController.js");

let currentQr = null;
let client = null;
let isInitialized = false;

exports.sendMessage = async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "Phone and message required" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteer.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    // const browser = await puppeteer.connect({
    //   browserURL: "http://127.0.0.1:8000", // Chrome must be remote-debuggable
    // });

    const page = await browser.newPage();

    // await page.goto(
    //   `https://web.whatsapp.com/send?phone=${phone}&text=${message}`
    // );
    // await page.waitForSelector("._3xTHG", { timeout: 0 }); // Wait for login (QR scan)

    const url = `https://web.whatsapp.com/send?phone=${phone}}`;
    await page.goto(url);
    // await page.waitForSelector("._3Uu1_");
    // await page.keyboard.press("Enter");

    // await page.goto(
    //   `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    //     message
    //   )}`
    // );
    // console.log(`Navigating to WhatsApp chat with ${phone}`);

    // Wait for WhatsApp to load
    // await page.waitForSelector(
    //   'div[data-testid="conversation-compose-box-input"]',
    //   { timeout: 60000 }
    // );

    // Optional: Click Send (simulate Enter)
    // await page.keyboard.press("Enter");

    console.log("Message sent!");
    res.status(200).json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error("Puppeteer Error:", error);
    res.status(500).json({ response: false, error: error.message });
  }
};
function initWhatsapp(userId) {
  return new Promise((resolve, reject) => {
    if (client && isInitialized) {
      console.log("🔄 WhatsApp client already initialized.");
      return resolve(currentQr); // Send current QR if still pending
    }

    console.log("📲 Initializing WhatsApp client...");

    client = new Client({
      //   authStrategy: new LocalAuth({ clientId: userId }),
      authStrategy: new LocalAuth({}),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    client.on("qr", (qr) => {
      console.log("✅ QR Code received.");
      currentQr = qr;
      resolve(qr);
    });

    client.on("ready", () => {
      console.log("✅ WhatsApp is ready!");
      currentQr = null;
    });

    client.on("authenticated", () => {
      console.log("🔐 Authenticated successfully.");
    });

    client.on("auth_failure", (msg) => {
      console.error("❌ Auth failure:", msg);
      reject(new Error("Authentication Failed"));
    });

    client.initialize();
    isInitialized = true;
  });
}

// 🟢 API Controller: QR as Image Response (for mobile/web <img src="...">)
exports.getQrAsImage = async (req, res) => {
  console.log("📲 Generating QR code image...");

  var user = await userController.findUserByToken(req);
  try {
    // const qrCodeString = await initWhatsapp(user._id);
    const qrCodeString = await initWhatsapp();

    res.setHeader("Content-Type", "image/png");
    await qrcode.toFileStream(res, qrCodeString); // PNG stream to response
  } catch (error) {
    console.error("❌ QR Image Error:", error.message);
    res.status(500).json({ error: "Failed to generate QR code image." });
  }
};

// 🟢 API Controller: QR as JSON (base64 & raw)
exports.getQrAsJson = async (req, res) => {
  var user = await userController.findUserByToken(req);
  try {
    // const qrCodeString = await initWhatsapp(user._id);
    const qrCodeString = await initWhatsapp();

    const qrImage = await qrcode.toDataURL(qrCodeString);

    return res.json({ base64: qrImage, raw: qrCodeString });
  } catch (error) {
    console.error("❌ QR JSON Error:", error.message);
    res.status(500).json({ error: "Failed to return QR code." });
  }
};

exports.getWhatsappStatus = (req, res) => {
  try {
    if (!client) return res.json({ authenticated: false });

    if (client.info) {
      return res
        .status(200)
        .json({ authenticated: true, user: client.info.wid.user });
    } else {
      return res.json({ authenticated: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to return current status." });
  }
};

exports.sendWpMessage = async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({ error: "Missing number or message." });
    }

    if (!client || !client.info) {
      return res.status(400).json({ error: "WhatsApp not initialized." });
    }

    // Format the number correctly: remove '+' and add @c.us
    const chatId = number.replace(/[^0-9]/g, "") + "@c.us";

    await client.sendMessage(chatId, message);

    res.json({ success: true, sentTo: number, message });
  } catch (err) {
    console.error("❌ Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.logout = async (req, res) => {
  if (!client) return res.status(400).json({ message: "Client not started" });
  await client.logout();
  res.json({ message: "Logged out" });
};
