import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '5mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Fast localized fallback templates for all 13 languages
const LOCALIZED_FALLBACKS: Record<string, string> = {
  kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ನಿರ್ವಾಹ AI ಸಾರ್ವಜನಿಕ ಸೇವಾ ಸಹಾಯಕ. ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ನೀವು ಸಂಬಂಧಿಸಿದ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ. ನಮ್ಮ ಸೇವಾ ಡೈರೆಕ್ಟರಿ ಮತ್ತು ಅಸಿಸ್ಟ್‌ಫಿಲ್ ಮೂಲಕ ನೀವು ಯಾವುದೇ ಕಚೇರಿಗೆ ಹೋಗದೆ ನೇರವಾಗಿ ಆ್ಯಪ್‌ನಲ್ಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು. ನಿಮಗೆ ಯಾವ ಯೋಜನೆ ಅಥವಾ ದಾಖಲೆಯ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು?',
  hi: 'नमस्ते! मैं आपका निर्वाह AI लोक सेवा साथी हूं। आपकी प्रोफ़ाइल और स्थान के अनुसार आप कई कल्याणकारी योजनाओं के पात्र हैं। आप सर्विस डायरेक्टरी और असिस्टफिल के माध्यम से सीधे इसी ऐप में आवेदन कर सकते हैं। आपको किस योजना या दस्तावेज़ के बारे में जानकारी चाहिए?',
  en: 'Hello! I am your NIRVAHA AI public service guide. Based on your citizen profile and location, you have verified welfare schemes available. You can review them in the Service Directory or apply directly inside the app using AssistFill without visiting an external portal. How can I help you today?',
  ta: 'வணக்கம்! நான் உங்கள் நிர்வாஹா AI பொது சேவை வழிகாட்டி. உங்கள் விவரக்குறிப்புக்கு ஏற்ப நீங்கள் பல நலத்திட்டங்களுக்கு தகுதியுடையவர். நீங்கள் சேவை அடைவில் திட்டங்களை பார்க்கலாம் அல்லது அசிஸ்ட்பில் மூலம் நேரடியாக விண்ணப்பிக்கலாம். உங்களுக்கு என்ன உதவி தேவை?',
  te: 'నమస్కారం! నేను మీ నిర్వాహ AI ప్రజా సేవా మార్గదర్శిని. మీ ప్రొఫైల్ ఆధారంగా మీరు అర్హులైన సంక్షేమ పథకాలు సిద్ధంగా ఉన్నాయి. మీరు సేవా డైరెక్టరీలో చూడవచ్చు లేదా అసిస్ట్‌ఫిల్ ద్వారా నేరుగా దరఖాస్తు చేసుకోవచ్చు. మీకు ఏ సమాచారం కావాలి?',
  ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ നിർവാഹ AI പബ്ലിക് സർവീസ് സഹായിയാണ്. നിങ്ങളുടെ പ്രൊഫൈൽ അടിസ്ഥാനമാക്കി നിങ്ങൾ അർഹരായ ക്ഷേമപദ്ധതികൾ ലഭ്യമാണ്. സർവീസ് ഡയറക്ടറിയിലോ അസിസ്റ്റ്ഫിൽ വഴിയോ നിങ്ങൾക്ക് അപേക്ഷിക്കാം. എന്ത് സഹായമാണ് വേണ്ടത്?',
  mr: 'नमस्कार! मी तुमचा निर्वाह AI लोकसेवा मार्गदर्शक आहे. तुमच्या प्रोफाईलनुसार आपण अनेक कल्याणकारी योजनांसाठी पात्र आहात. आपण थेट असिस्टफिलद्वारे ॲपमध्येच अर्ज करू शकता. आपल्याला कोणत्या योजनेची माहिती हवी आहे?',
  bn: 'নমস্কার! আমি আপনার নির্বাহ AI জনসেবা সহায়ক। আপনার প্রোফাইল অনুযায়ী একাধিক জনকল্যাণমূলক প্রকল্প উপলব্ধ রয়েছে। আপনি অ্যাসিস্টফিলের মাধ্যমে সরাসরি এই অ্যাপেই আবেদন করতে পারেন। আপনার কী সাহায্য প্রয়োজন?',
  gu: 'નમસ્તે! હું તમારો નિર્વાહ AI જાહેર સેવા સહાયક છું. તમારી પ્રોફાઇલ મુજબ તમે કલ્યાણકારી યોજનાઓ માટે પાત્ર છો. તમે આસિસ્ટફિલ દ્વારા સીધી આ એપમાં અરજી કરી શકો છો. તમને કઈ યોજના વિશે માહિતી જોઈએ છે?',
  pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਨਿਰਵਾਹ AI ਲੋਕ ਸੇਵਾ ਸਹਾਇਕ ਹਾਂ। ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਅਨੁਸਾਰ ਤੁਸੀਂ ਕਈ ਭਲਾਈ ਸਕੀਮਾਂ ਦੇ ਯੋਗ ਹੋ। ਤੁਸੀਂ ਅਸਿਸਟਫਿਲ ਰਾਹੀਂ ਸਿੱਧਾ ਇਸੇ ਐਪ ਵਿੱਚ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹੋ। ਤੁਹਾਨੂੰ ਕੀ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ?',
  or: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ନିର୍ବାହ AI ଲୋକସେବା ସହାୟକ। ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଅନୁଯାୟୀ ଆପଣ ବହୁ କଲ୍ୟାଣକାରୀ ଯୋଜନା ପାଇଁ ଯୋଗ୍ୟ। ଆପଣ ଆସିଷ୍ଟଫିଲ୍ ମାଧ୍ୟମରେ ସିଧାସଳଖ ଆବେଦନ କରିପାରିବେ। ଆପଣଙ୍କୁ କେଉଁ ସୂଚନା ଦରକାର?',
  ur: 'سلام! میں آپ کا نرباہا AI عوامی خدمت کا رہنما ہوں۔ آپ کے پروفائل کے مطابق آپ کئی فلاحی اسکیموں کے اہل ہیں۔ آپ اسسٹ فل کے ذریعے براہ راست اسی ایپ میں درخواست جمع کر سکتے ہیں۔ آپ کو کس اسکیم کے بارے میں معلومات چاہیے؟',
  as: 'নমস্কাৰ! মই আপোনাৰ নিৰ্বাহ AI ৰাজহুৱা সেৱা সহায়ক। আপোনাৰ প্ৰ’ফাইল অনুসৰি আপুনি কেইবাখনো কল্যাণমূলক আঁচনিৰ বাবে যোগ্য। আপুনি এচিষ্টফিলৰ জৰিয়তে পোনপটীয়াকৈ এই এপত আবেদন কৰিব পাৰে। আপোনাক কি তথ্য লাগে?',
};

// Ultra-Fast Streaming Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, userProfile, language } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  const languageName = language?.name || 'English';
  const languageCode = language?.code || 'en';
  const nativeName = language?.nativeName || 'English';

  const systemInstruction = `You are NIRVAHA AI, an ultra-fast, caring, verified public welfare advisor for Indian citizens.
MANDATORY: You MUST reply 100% in ${languageName} (${languageCode}, script: ${nativeName}). NEVER output English unless language is explicitly English.
Answer format: Be direct, concise, and helpful (50–90 words). Provide immediate guidance on eligible schemes, documents required, and tell them they can apply directly via AssistFill in this app.
Citizen Profile: Name: ${userProfile?.fullName || 'Citizen'}, Role: ${userProfile?.role || 'Citizen'}, State: ${userProfile?.state || 'India'}, District: ${userProfile?.district || 'Unspecified'}, Income: ${userProfile?.annualIncome || 'Unspecified'}.`;

  // Use only the last 3 messages to minimize input token processing latency
  const recentMessages = messages.slice(-3);
  const contents = recentMessages.map((m: { sender: string; text: string }) => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  // Disable buffering for instant token streaming
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // Optimized model fallback chain: fastest lightweight models first
  const modelsToTry = [
    { name: 'gemini-3.1-flash-lite', is3x: true },
    { name: 'gemini-flash-latest', is3x: false },
    { name: 'gemini-3.8-flash', is3x: true },
    { name: 'gemini-2.5-flash', is3x: false },
  ];

  let streamSuccess = false;

  for (const modelInfo of modelsToTry) {
    try {
      const config: any = {
        systemInstruction,
        temperature: 0.2,
        maxOutputTokens: 280,
      };

      // Disable thinking overhead completely for instant responses
      if (modelInfo.is3x) {
        config.thinkingConfig = {
          thinkingLevel: ThinkingLevel.MINIMAL,
        };
      } else {
        config.thinkingConfig = {
          thinkingBudget: 0,
        };
      }

      const stream = await ai.models.generateContentStream({
        model: modelInfo.name,
        contents,
        config,
      });

      for await (const chunk of stream) {
        const text = chunk.text || '';
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
          (res as any).flush?.();
        }
      }

      res.write(`data: [DONE]\n\n`);
      (res as any).flush?.();
      res.end();
      streamSuccess = true;
      break;
    } catch (err: any) {
      console.warn(`Model ${modelInfo.name} speed fallback notice:`, err?.message || err);
      // Try next model immediately
    }
  }

  if (!streamSuccess) {
    const fallbackText = LOCALIZED_FALLBACKS[languageCode] || LOCALIZED_FALLBACKS.en;
    res.write(`data: ${JSON.stringify({ text: fallbackText })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NIRVAHA AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
