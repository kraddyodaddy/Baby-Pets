import { GoogleGenAI } from "@google/genai";

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the Data-URL prefix (e.g., "data:image/jpeg;base64,")
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper to get image dimensions
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      URL.revokeObjectURL(img.src);
      resolve({ width, height });
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(img.src);
      reject(error);
    };
    img.src = URL.createObjectURL(file);
  });
};

// Helper to get a random pastel color
const getRandomPastelColor = () => {
  const pastels = [
    "Soft Mint Green",
    "Pale Lavender",
    "Baby Pink",
    "Buttercream Yellow",
    "Sky Blue",
    "Peach",
    "Cream",
    "Lilac",
    "Sage Green",
    "Dusty Rose",
    "Slate Blue"
  ];
  return pastels[Math.floor(Math.random() * pastels.length)];
};

export const validatePetImage = async (imageFile: File): Promise<boolean> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = await fileToBase64(imageFile);
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: imageFile.type,
            },
          },
          {
            text: "Analyze this image. Is it: 1) A clear photo of a single pet (dog, cat, or other pet), 2) Appropriate for all ages, 3) Good quality? Respond with only YES or NO.",
          },
        ],
      },
    });
    
    const text = response.text?.trim().toUpperCase();
    return text?.includes("YES") || false;
  } catch (error) {
    console.error("Error validating image:", error);
    return false;
  }
};

export const generateBabyPet = async (imageFile: File, petName?: string, styleInstruction?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = await fileToBase64(imageFile);
  
  const { width, height } = await getImageDimensions(imageFile);
  const ratio = width / height;

  const supportedRatios = [
    { label: "1:1", value: 1.0 },
    { label: "3:4", value: 3/4 },
    { label: "4:3", value: 4/3 },
    { label: "9:16", value: 9/16 },
    { label: "16:9", value: 16/9 },
  ];

  const closestRatio = supportedRatios.reduce((prev, curr) => {
    return Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev;
  });

  const model = 'gemini-2.5-flash-image';
  const randomColor = getRandomPastelColor();

  const labelInstruction = petName && petName.trim().length > 0
    ? `TEXT BANNER REQUIREMENT:
Every final baby image must include a decorative title ribbon.
Content: "Baby ${petName}"
Style: Small ribbon or pennant flag graphic behind text, soft fabric/cardstock aesthetic, slight shadowing, elegant cursive script font.
Placement: Top center or top left, do not cover the pet’s face.
Color palette: Ribbon: ${randomColor} (darker than text), Ribbon Text: Soft cream or white ink.`
    : `TEXT BANNER REQUIREMENT:
Every final baby image must include a decorative title ribbon with the text "Baby".
Style: Small ribbon/pennant, soft fabric look, elegant cursive script.
Placement: Top center or top left, do not cover face.
Colors: Muted pastel ribbon with white/cream text.`;
       
  const additionalStyle = styleInstruction 
    ? `STYLE VARIATION: ${styleInstruction}`
    : "";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: imageFile.type,
            },
          },
          {
            text: `Step 1: STRICT QUALITY & CONTENT CHECK
Analyze the input photo. Ensure it contains a recognizable animal and is clear.

Step 2: GENERATION (Only if Step 1 passes)
TASK: Transform this pet into an adorable baby version with these CRITICAL specifications. The transformation should be DRAMATIC and obvious.

PHYSICAL PROPORTIONS (MOST IMPORTANT):
- Make the animal SIGNIFICANTLY smaller and younger-looking (Target age: 4-8 weeks).
- MUCH rounder, pudgier body with visible baby fat.
- Head should be PROPORTIONALLY LARGER relative to body (large head-to-body ratio).
- Eyes should be SIGNIFICANTLY LARGER and rounder relative to face size.
- Shorter, stubbier legs that look like a very young animal.

FACIAL FEATURES:
- Face must be rounder and fuller with chubby cheeks.
- Snout/muzzle should be MUCH shorter and more button-like.
- Ears should be smaller and/or floppier if appropriate for the species.
- Overall more innocent, wide-eyed baby expression.

TEXTURE AND DETAILS:
- Photorealistic style - must look like a real photograph, NOT a cartoon or CGI.
- Natural, softer, fluffier fur texture typical of baby animals.
- Natural lighting and shadows matching the original photo's environment.
- Preserve the exact coloring, markings, and distinctive patterns from the original photo.
- MAP THE IDENTITY: If the original has a specific patch or eye color, the baby MUST have that exact same trait.

${additionalStyle}

${labelInstruction}

Watermark requirement:
Add a small, subtle text watermark in the bottom right corner that reads 'Created by BabyPets.ai'.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: closestRatio.label
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated from Gemini.");
    }

    const imagePart = parts.find(p => p.inlineData);
    if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
        return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
        throw new Error(textPart.text);
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Error generating baby pet:", error);
    throw error;
  }
};