// Import cấu hình từ file config.js
// Lưu ý: File config.js chứa các API keys nhạy cảm, không được commit lên Git
importScripts('config.js');

async function fetchImage(word) {
  try {
    const res = await fetch(`https://pixabay.com/api/?key=${CONFIG.PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&orientation=horizontal&per_page=3`);
    const data = await res.json();
    // Lấy link ảnh đầu tiên nếu có
    return data.hits.length > 0 ? data.hits[0].webformatURL : null;
  } catch (error) {
    console.error("Lỗi lấy ảnh:", error);
    return null;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-anki-pro",
    title: "Thêm '%s' vào Anki (1 Card)",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add-anki-pro") {
    const word = info.selectionText.trim().toLowerCase();
    await processAndAddToAnki(word);
  }
});

async function processAndAddToAnki(word) {
  try {
    const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const dictData = await dictRes.json();
    if (!dictData || !dictData[0]) throw new Error("Not found");

    const entry = dictData[0];
    const audioFileName = `ext_audio_${word}_${Date.now()}.mp3`;
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(word)}`;

    // Lấy hình ảnh từ Pixabay
    const imageUrl = await fetchImage(word);
    const imageFileName = `ext_img_${word}_${Date.now()}.jpg`;

    // 1. TÌM NGHĨA CÓ VÍ DỤ TỐT NHẤT
    let bestMatch = null;
    for (let m of entry.meanings) {
      for (let d of m.definitions) {
        if (!bestMatch) {
            bestMatch = { pos: m.partOfSpeech, def: d.definition, ex: d.example };
        }
        // Ưu tiên lấy định nghĩa nào có sẵn ví dụ (Example)
        if (d.example) {
          bestMatch = { pos: m.partOfSpeech, def: d.definition, ex: d.example };
          break; 
        }
      }
      if (bestMatch && bestMatch.ex) break;
    }

    // 2. IN ĐẬM TỪ KHÓA TRONG VÍ DỤ (Để script Cloze của bạn hoạt động)
    let formattedEx = bestMatch.ex || "";
    if (formattedEx) {
      // Regex này tìm từ vựng (không phân biệt hoa thường) và bọc trong <b>
      const regex = new RegExp(`(${word})`, 'gi');
      formattedEx = formattedEx.replace(regex, '<b>$1</b>');
    }

    // 3. MAP DỮ LIỆU VÀO FIELDS (Chỉ điền Def1, để trống Def2-6)
    let fields = {
      "Word": word,
      "Phonetics": entry.phonetic || "",
      "ID": `AUTO_${Date.now()}`,
      "Hint": `${word[0]}${Array(word.length-2).fill('_').join('')}${word[word.length-1]}`,
      "PoS1": bestMatch.pos || "n",
      "Def1": bestMatch.def,
      "VNDef1": await translate(bestMatch.def, 'vi'),
      "Ex1": formattedEx,
      "VNTrans1": formattedEx ? await translate(bestMatch.ex, 'vi') : "",
      
      // QUAN TRỌNG: Để RỖNG các trường này, AnkiConnect sẽ tự điền 1 lần duy nhất
      "Sound": "",
      "SoundEx1": "",
      "Img1": "",
      
      // QUAN TRỌNG: Gán rỗng toàn bộ từ 2-6 để Anki không sinh thêm Card phụ
      "Def2": "", "VNDef2": "x", "PoS2": "", "Ex2": "", "VNTrans2": "",
      "Def3": "", "VNDef3": "x", "PoS3": "", "Ex3": "", "VNTrans3": "",
      "Def4": "", "VNDef4": "x", "PoS4": "", "Ex4": "", "VNTrans4": "",
      "Def5": "", "VNDef5": "x", "PoS5": "", "Ex5": "", "VNTrans5": "",
      "Def6": "", "VNDef6": "x", "PoS6": "", "Ex6": "", "VNTrans6": ""
    };

    await sendToAnkiWithMedia(fields, audioUrl, audioFileName, imageUrl, imageFileName);

  } catch (error) {
    console.error(error);
    notify("Lỗi", "Không tìm thấy dữ liệu hoặc lỗi kết nối Anki.");
  }
}

async function sendToAnkiWithMedia(fields, audioUrl, audioName, imageUrl, imageName) {
  const body = {
    action: "addNote",
    version: 6,
    params: {
      note: {
        deckName: CONFIG.DECK_NAME, 
        modelName: CONFIG.MODEL_NAME, // Đảm bảo tên này khớp chính xác trong Anki
        fields: fields,
        options: { allowDuplicate: true },
        tags: ["chrome_ext"],
        // AnkiConnect sẽ tự tải và điền vào các Field được chỉ định ở đây
        audio: [{
          url: audioUrl,
          filename: audioName,
          fields: ["Sound", "SoundEx1"] // Điền vào cả 2 trường này
        }],
        // Xử lý Hình ảnh
        picture: imageUrl ? [{
          url: imageUrl,
          filename: imageName,
          fields: ["Img1"]
        }] : []
      }
    }
  };

  const response = await fetch(CONFIG.ANKI_CONNECT_URL, { method: "POST", body: JSON.stringify(body) });
  const result = await response.json();
  if (result.error) notify("Lỗi Anki", result.error);
  else notify("Thành công", `Đã thêm: ${fields.Word}`);
}

async function translate(text, targetLang) {
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0][0][0];
  } catch { return "Chưa có dịch"; }
}

function notify(title, msg) {
  chrome.notifications.create({ type: "basic", iconUrl: "icon.png", title: title, message: msg });
}