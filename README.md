# Anki Real-time Vocabulary Adder 🚀

A Chrome extension that seamlessly adds vocabulary from your browser directly into Anki with rich multimedia content.

## ✨ Features

- **📚 Automatic Definitions**: Fetches English definitions from Dictionary API
- **🇻🇳 Vietnamese Translation**: Auto-translates definitions and examples using Google Translate
- **🔊 Audio Pronunciation**: Includes audio files from Google Text-to-Speech
- **🖼️ Visual Learning**: Automatically retrieves relevant images from Pixabay
- **💡 Cloze Deletion Ready**: Auto-bolds keywords in example sentences for Cloze learning
- **⚡ One-Click Add**: Right-click any word to add it to your Anki deck instantly

## 📋 Prerequisites

Before installing, ensure you have:

- **Anki Desktop** (latest version recommended)
- **Google Chrome** or Chromium-based browser
- **AnkiConnect Add-on** (Code: `2055492218`)
- **Pixabay API Key** (free tier available)

## 🔧 Installation

### Step 1: Configure Anki

1. **Install AnkiConnect Add-on:**
   - Open Anki → Tools → Add-ons → Get Add-ons
   - Enter code: `2055492218`
   - Restart Anki

2. **Configure CORS (Required):**
   - Go to Tools → Add-ons → AnkiConnect → Config
   - Add your Chrome extension ID to `webCorsOriginList`
   - Example:
     ```json
     "webCorsOriginList": ["chrome-extension://YOUR_EXTENSION_ID_HERE"]
     ```
   - To find your extension ID: Visit `chrome://extensions/` after installing the extension

3. **Import Note Type (Optional but Recommended):**
   - If available, import `sample-data/template.apkg` to get the pre-configured note structure
   - Or create a note type named `iKnown! Destination` with the following fields:
     - Word, Phonetics, ID, Hint, PoS1, Def1, VNDef1, Ex1, VNTrans1, Sound, SoundEx1, Img1
     - Additional fields: Def2-6, VNDef2-6, PoS2-6, Ex2-6, VNTrans2-6

4. **Create Target Deck:**
   - Create a deck in Anki (e.g., "Vocabulary" or "từ vựng chuyên ngành")
   - Remember the exact name for configuration

### Step 2: Get Pixabay API Key

1. Visit [Pixabay API Documentation](https://pixabay.com/api/docs/)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Keep it handy for the next step

### Step 3: Install Chrome Extension

1. **Prepare the Extension:**
   ```bash
   # Copy the configuration template
   copy config.example.js config.js
   ```

2. **Configure API Settings:**
   - Open `config.js` in a text editor
   - Replace `YOUR_PIXABAY_API_KEY_HERE` with your actual Pixabay API key
   - Update `DECK_NAME` to match your Anki deck name
   - Update `MODEL_NAME` if you're using a different note type

   Example configuration:
   ```javascript
   const CONFIG = {
     PIXABAY_API_KEY: 'your_actual_api_key_here',
     ANKI_CONNECT_URL: 'http://localhost:8765',
     DECK_NAME: 'Vocabulary',
     MODEL_NAME: 'iKnown! Destination'
   };
   ```

3. **Load Extension into Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the folder containing this extension
   - Note the Extension ID that appears under the extension name

4. **Update AnkiConnect CORS:**
   - Copy the Extension ID from Chrome
   - Return to Anki → Tools → Add-ons → AnkiConnect → Config
   - Add the extension ID to `webCorsOriginList` as shown in Step 1.2

## 🎯 Usage

1. **Start Anki**: Ensure Anki is running in the background
2. **Select Text**: Highlight any English word on a webpage
3. **Add to Anki**: Right-click and select "Thêm '[word]' vào Anki (1 Card)"
4. **Confirmation**: A notification will appear confirming the card was added
5. **Review**: Open Anki to see your new vocabulary card with all media

## 📁 Project Structure

```
anki_add/
├── background.js           # Main extension service worker
├── config.js              # Configuration with API keys (git-ignored)
├── config.example.js      # Configuration template (safe to share)
├── manifest.json          # Chrome extension manifest
├── README.md             # Documentation
└── .gitignore            # Git ignore rules
```

## 🔒 Security Notes

**⚠️ IMPORTANT: Protect Your API Keys**

- `config.js` contains sensitive API keys and **MUST NEVER** be committed to version control
- The file is already added to `.gitignore` to prevent accidental commits
- Only share `config.example.js` as a template
- If you accidentally commit `config.js`, regenerate your API keys immediately

## 🛠️ Troubleshooting

### "Failed to connect to Anki"
- Ensure Anki is running
- Verify AnkiConnect add-on is installed
- Check that `ANKI_CONNECT_URL` in config.js is correct (default: `http://localhost:8765`)

### "No images found"
- Verify your Pixabay API key is valid
- Check your API rate limits (free tier: 100 requests/minute)
- Some words may not have relevant images

### "Card not added" or "Model not found"
- Verify `DECK_NAME` and `MODEL_NAME` exactly match your Anki settings (case-sensitive)
- Ensure the Note Type has all required fields

### CORS errors
- Confirm you've added the extension ID to AnkiConnect's `webCorsOriginList`
- Restart Anki after updating the configuration

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📝 License

This project is provided as-is for educational purposes.
