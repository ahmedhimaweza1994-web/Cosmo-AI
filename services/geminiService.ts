
import { GoogleGenAI, Type } from "@google/genai";
import { ImageModel, VideoModel, TextModel, CompanyProfile, MarketingPlan, ChatStep, WebsiteAnalysis } from '../types';

const getClient = () => {
  // In browser (Vite), use VITE_ prefixed env var. In Node.js (server), use regular env var
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. Functionality will be limited.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Website Analysis ---
export const analyzeWebsite = async (url: string, language: 'en' | 'ar' = 'en'): Promise<WebsiteAnalysis> => {
  const ai = getClient();
  const isArabic = language === 'ar';
  const prompt = `
    You are a senior brand strategist. Analyze this website URL: ${url}
    
    Infer the likely:
    1. Company Name
    2. Company Summary (what they do) - Write this in ${isArabic ? 'Arabic' : 'English'}
    3. Primary Brand Colors (hex codes) based on their industry or known brand.
    4. Font style (Serif, Sans-Serif, etc.)
    5. Key Services or Products - Write this in ${isArabic ? 'Arabic' : 'English'}
    
    Return JSON:
    {
      "name": "string",
      "summary": "string",
      "detectedColors": ["#hex", "#hex"],
      "detectedFonts": ["string"],
      "services": ["string", "string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      url,
      name: data.name || "",
      summary: data.summary || "Analyzed website content",
      detectedColors: data.detectedColors || ['#000000'],
      detectedFonts: data.detectedFonts || ['Sans-Serif'],
      services: data.services || []
    };
  } catch (e) {
    console.error("Website analysis failed", e);
    return {
      url,
      name: "",
      summary: isArabic ? "تعذر تحليل الموقع بالكامل" : "Could not fully analyze website.",
      detectedColors: ['#333333'],
      detectedFonts: ['Inter'],
      services: []
    };
  }
};

// --- Onboarding Agent ---

export const sendOnboardingMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  lastUserMessage: string,
  currentStep: ChatStep,
  collectedData: Partial<CompanyProfile>
): Promise<string> => {
  const ai = getClient();

  const lang = collectedData.language || 'en';
  const isArabic = lang === 'ar';

  // Randomize the "Vibe" of the AI for this specific turn to make it feel alive and non-repetitive
  const vibes = [
    "Curious & Enthusiastic (excited to learn more)",
    "Professional but Warm (like a supportive consultant)",
    "Creative & Visionary (focusing on the big picture)",
    "Friendly & Casual (like a best friend)"
  ];
  const currentVibe = vibes[Math.floor(Math.random() * vibes.length)];

  let strategicGoal = "";
  let contextNote = "";

  // Define the "Hidden Objective" for the AI, but let it choose the words.
  switch (currentStep) {
    case ChatStep.LANGUAGE_SELECT:
      // This is usually handled by the UI, but if we fall through:
      strategicGoal = "Greet them warmly and ask for their name to start the collaboration.";
      break;

    case ChatStep.USER_INTRO:
      strategicGoal = "Goal: Build rapport instantly. React to their name if given. If you have the name, casually ask what they are passionate about or what their 'superpower' is. DO NOT just say 'nice to meet you'. Be charming.";
      contextNote = "We need to know who they are to personalize the experience.";
      break;

    case ChatStep.COMPANY_INTRO:
      strategicGoal = "Goal: Segue into business naturally. Ask about their project/company. What are they building? Ask for the Website URL if they have one, or just the name and industry if not.";
      contextNote = "React to their previous interest/hobby if possible before switching topics.";
      break;

    case ChatStep.WEBSITE_VERIFY:
      strategicGoal = "Goal: Present the data found. Ask them to confirm if the analysis on the card looks correct or if they want to tweak it. Keep it brief.";
      break;

    case ChatStep.GOALS:
      strategicGoal = "Goal: Dig deep into their ambition. Don't just ask 'what are your goals?'. Ask 'What does success look like for you this month?' or 'Are we chasing sales or fame right now?'. Make it sound exciting.";
      contextNote = `They are in the ${collectedData.industry} industry. Tailor the question to that.`;
      break;

    case ChatStep.BRANDING_LOGO:
      strategicGoal = "Goal: Branding Check. Ask if they already have a logo they love (to upload), or if they want to see your creative magic and generate one.";
      break;

    case ChatStep.BRANDING_STYLE:
      strategicGoal = "Goal: Creative Direction. Since we are generating a logo, ask about their taste. Do they like Minimalist? Retro? Cyberpunk? Ask for a specific vibe or color palette.";
      contextNote = "You are acting as a Lead Designer now.";
      break;

    case ChatStep.BRANDING_FILES:
      strategicGoal = "Goal: Asset Collection. Cheerfully ask if they have any product photos, team shots, or assets to add to the mix. Encourage them that 'the more the better'.";
      break;

    case ChatStep.DESIGN_PREFS:
      strategicGoal = "Goal: Visual Taste for Marketing. Ask what kind of social media aesthetic stops their scroll. Modern? Bold? Elegant? We need this for the posts.";
      break;

    case ChatStep.PLANNING:
      strategicGoal = "Goal: Logistics. We need a budget (even a rough one) and their favorite platforms (Insta, LinkedIn, etc) to finalize the plan.";
      break;

    default:
      strategicGoal = "Be helpful and keep the conversation flowing.";
  }

  const systemInstruction = `
    You are Cosmo, a world-class AI Creative Director and Marketing Strategist. 
    You are NOT a robot, a form-filler, or a boring assistant. You are a living, breathing creative entity.
    
    LANGUAGE: ${isArabic ? 'ARABIC (EGYPTIAN/LEVANTINE/MODERN MIX - NATURAL)' : 'ENGLISH (CASUAL, PROFESSIONAL)'}
    CURRENT VIBE: ${currentVibe}
    
    YOUR MISSION:
    1. Execute the STRATEGIC GOAL: "${strategicGoal}"
    2. CONTEXT: ${contextNote}
    3. USER INFO SO FAR: Name=${collectedData.userName}, Company=${collectedData.name}, Industry=${collectedData.industry}.
    
    CRITICAL RULES FOR HUMANITY:
    - NEVER say "I have updated my database" or "Processing your request".
    - NEVER use numbered lists for questions. Ask ONE thing at a time naturally.
    - REACT to what the user just said. If they said they sell Coffee, say "I love the smell of fresh roast!" before asking the next business question.
    - VARY YOUR OPENERS. Don't always start with "Great". Use "Oh nice!", "I see," "Interesting choice," "Got it."
    - IF ARABIC: Speak naturally. "يا هلا!"، "أكيد"، "ولا يهمك". Do NOT speak like a translated manual. Use emojis.
    - Keep it short (max 2 sentences). The user wants to move fast.
    
    Make the user feel they are chatting with a genius friend, not a software.
  `;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction,
      temperature: 0.9, // Higher temperature for more creative/varied responses
    },
  });

  try {
    const response = await chat.sendMessage({ message: lastUserMessage });
    return response.text || (isArabic ? "لحظة، خليني أفكر فيها تاني... 🤔" : "Hmm, let me think about that for a second... 🤔");
  } catch (error) {
    console.error("Gemini Error:", error);
    return isArabic ? "يبدو أن هناك تشويش في الاتصال 📡 ممكن تعيد الجملة؟" : "Connection glitch! 📡 Mind saying that again?";
  }
};

export const extractProfileFromChat = async (chatHistoryText: string): Promise<Partial<CompanyProfile>> => {
  const ai = getClient();
  const prompt = `
    Extract a structured company profile from this chat transcript:
    ${chatHistoryText}

    Return JSON matching this structure:
    {
      "userName": "string",
      "userInterests": "string",
      "name": "string",
      "industry": "string",
      "description": "string",
      "targetAudience": "string",
      "competitors": ["string"],
      "goals": ["string"],
      "branding": {
        "primaryColor": "hex",
        "secondaryColor": "hex",
        "mood": "string"
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {};
  }
};

// --- Core Generation ---

export const generateFullMarketingPackage = async (profile: CompanyProfile): Promise<MarketingPlan> => {
  const ai = getClient();
  const isArabic = profile.language === 'ar';

  // Complex reasoning task: use Pro model
  const prompt = `
    Create a complete comprehensive marketing plan for:
    Company: ${profile.name}
    Industry: ${profile.industry}
    Goals: ${profile.goals.join(', ')}
    Audience: ${profile.targetAudience}
    User Interests: ${profile.userInterests}
    Language: ${isArabic ? 'Arabic' : 'English'}
    Design Prefs: ${profile.designPreferences}

    Output JSON (Ensure all text content is in ${isArabic ? 'Arabic' : 'English'}):
    {
      "strategySummary": "2 sentence high-impact summary",
      "weeklyThemes": ["Theme 1", "Theme 2", "Theme 3", "Theme 4"],
      "posts": [
        { "platform": "Instagram", "type": "image", "content": "Caption 1", "date": "2024-01-01" },
        { "platform": "LinkedIn", "type": "image", "content": "Caption 2", "date": "2024-01-03" },
        { "platform": "Twitter", "type": "image", "content": "Tweet 1", "date": "2024-01-05" }
      ],
      "ads": [
        { 
          "name": "Launch Campaign", 
          "platform": "Meta", 
          "objective": "Conversion", 
          "budget": 500,
          "adSets": [
             { "targetAudience": "Lookalike 1%", "copy": "Ad Copy 1", "creativeUrl": "placeholder" }
          ]
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Using Pro for deep reasoning
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  const data = JSON.parse(response.text || "{}");
  return data as MarketingPlan;
};

export const generateImage = async (prompt: string, model: ImageModel): Promise<string> => {
  const ai = getClient();

  try {
    if (model === ImageModel.IMAGEN) {
      const response = await ai.models.generateImages({
        model: model,
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });
      const b64 = response.generatedImages?.[0]?.image?.imageBytes;
      return b64 ? `data:image/jpeg;base64,${b64}` : "";
    } else {
      // Nano Banana (Flash Image) or Pro Image
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return "";
    }
  } catch (error) {
    console.error("Image gen error", error);
    throw error;
  }
};

export const generateVideo = async (prompt: string, model: VideoModel): Promise<string> => {
  const ai = getClient();

  try {
    // Check API Key selection for Veo
    if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) await (window as any).aistudio.openSelectKey();
    }

    let operation = await ai.models.generateVideos({
      model: model,
      prompt: prompt,
      config: { numberOfVideos: 1, resolution: '720p' }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    return videoUri ? `${videoUri}&key=${apiKey}` : "";
  } catch (error) {
    console.error("Video gen error", error);
    throw error;
  }
};

export const generateCaption = async (prompt: string, platform: string): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write a creative and engaging social media caption for ${platform} based on this idea: ${prompt}. Include emojis and hashtags.`,
  });
  return response.text || "";
};

// --- Brand Identity Generation ---

export const generateBrandAsset = async (
  type: 'colors' | 'typography' | 'voice' | 'assets',
  context: CompanyProfile,
  model: string = 'gemini-2.5-flash'
): Promise<any> => {
  const ai = getClient();
  const isArabic = context.language === 'ar';

  let prompt = "";

  if (type === 'colors') {
    prompt = `
      Generate a color palette for a ${context.industry} company named "${context.name}".
      Description: ${context.description}
      Mood: ${context.branding.mood || 'Professional'}
      
      Return JSON:
      {
        "primaryColor": "#hex",
        "secondaryColor": "#hex",
        "accentColor": "#hex",
        "backgroundColor": "#hex"
      }
    `;
  } else if (type === 'typography') {
    prompt = `
      Suggest a font pairing for a ${context.industry} company named "${context.name}".
      Mood: ${context.branding.mood || 'Modern'}
      
      Return JSON:
      {
        "fontHeading": "Font Name (e.g. Inter, Playfair Display)",
        "fontBody": "Font Name (e.g. Roboto, Open Sans)",
        "fontPairing": "Heading/Body"
      }
    `;
  } else if (type === 'voice') {
    prompt = `
      Define the brand voice for "${context.name}" (${context.industry}).
      Target Audience: ${context.targetAudience}
      Language: ${isArabic ? 'Arabic' : 'English'}
      
      Return JSON:
      {
        "voiceTone": "2 sentences describing the tone (e.g. Friendly, Authoritative). Write in ${isArabic ? 'Arabic' : 'English'}.",
        "brandValues": ["Value 1", "Value 2", "Value 3"],
        "voiceDos": ["Do 1: Use active voice", "Do 2: Focus on benefits", "Do 3: Keep it simple"],
        "voiceDonts": ["Don't 1: Avoid jargon", "Don't 2: Don't be overly formal", "Don't 3: Don't use clichés"]
      }
    `;
  } else if (type === 'assets') {
    prompt = `
      Generate image prompts for brand assets for "${context.name}" (${context.industry}).
      Description: ${context.description}
      Brand Colors: ${context.branding.primaryColor}, ${context.branding.secondaryColor}
      Mood: ${context.branding.mood || 'Professional'}
      
      Return JSON with image generation prompts:
      {
        "coverImagePrompt": "Detailed prompt for a social media cover image (1500x500px)",
        "socialBannerPrompt": "Detailed prompt for an Instagram/Facebook ad banner (1080x1080px)",
        "businessCardPrompt": "Detailed prompt for a business card design"
      }
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(`Failed to generate ${type}`, e);
    throw e;
  }
};

export const generateBrandLogo = async (context: CompanyProfile, style: string, model: ImageModel): Promise<string> => {
  const prompt = `Vector logo for ${context.name} (${context.industry}). Style: ${style}. Minimalist, clean background, high quality.`;
  return await generateImage(prompt, model);
};
