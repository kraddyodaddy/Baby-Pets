import { GoogleGenAI } from "@google/genai";

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
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

export const generateBabyPet = async (imageFile: File, petName?: string, styleInstruction?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = await fileToBase64(imageFile);
  
  // Calculate aspect ratio to maintain image shape
  const { width, height } = await getImageDimensions(imageFile);
  const ratio = width / height;

  // Supported aspect ratios for gemini-2.5-flash-image
  const supportedRatios = [
    { label: "1:1", value: 1.0 },
    { label: "3:4", value: 3/4 }, // 0.75
    { label: "4:3", value: 4/3 }, // 1.333
    { label: "9:16", value: 9/16 }, // 0.5625
    { label: "16:9", value: 16/9 }, // 1.777
  ];

  // Find the closest supported aspect ratio
  const closestRatio = supportedRatios.reduce((prev, curr) => {
    return Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev;
  });

  // Using gemini-2.5-flash-image for image editing/generation tasks
  const model = 'gemini-2.5-flash-image';

  const randomColor = getRandomPastelColor();

  // Construct label instruction based on whether a name was provided
  const labelInstruction = petName && petName.trim().length > 0
    ? `TEXT BANNER REQUIREMENT:
Every final baby image must include a decorative title ribbon.

Content: "Baby ${petName}"

Style:
– A small ribbon or pennant flag graphic behind the text
– Soft fabric or cardstock aesthetic
– Slight shadowing for depth to separate it from the background
– Elegant cursive script font (handwritten or calligraphic style)

Placement:
– Top center or top left of the image
– CRITICAL: Never cover the pet’s face or eyes

Color palette:
– Ribbon: Neutral pastel or muted tone (e.g., ${randomColor}). The ribbon color must be darker than the text for readability.
– Ribbon Text: Soft cream or white ink

Design notes:
– Ribbon edges should be slightly curved or folded
– The ribbon should look like a high-quality physical scrapbooking element integrated into the scene.`
    : `TEXT BANNER REQUIREMENT:
Every final baby image must include a decorative title ribbon with the text "Baby".
Style: Small ribbon/pennant, soft fabric look, elegant cursive script.
Placement: Top center or top left, do not cover face.
Colors: Muted pastel ribbon with white/cream text.`;
       
  const additionalStyle = styleInstruction 
    ? `STYLE VARIATION: ${styleInstruction} Ensure the result is distinctly different from a standard generation while maintaining the subject identity.`
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
Before generating any image, analyze the input photo.

1. ANIMAL DETECTION: Does the image contain a recognizable animal?
   - If NO: Return exactly the text: "No animal detected in this image." and stop.

2. CLARITY CHECK: Is the animal's face clear and in focus?
   - CRITICAL: Portrait-mode blur is intentional. Ignore background blur when checking clarity. Judge sharpness only on the pet’s face, eyes, and nose.
   - If the EYES or FACE are blurry, out of focus, or obscured: Do NOT generate the baby version.
   - Instead, return EXACTLY this text explanation:
     "Your photo is a bit too blurry for accurate transformation. Please upload a clearer image where your pet’s face is in focus so we can create a realistic Baby version."

Step 2: GENERATION (Only if Step 1 passes)
Generate a photorealistic juvenile version of that same individual.

Age target: six to eight weeks old (infant stage).
Do NOT shrink the adult — reconstruct infant anatomy.

Required baby proportions:
• Distinctly infant-like: Larger head compared to body
• Larger eyes, shorter snout, softer muzzle
• Round cheeks and slightly oversized ears (if species appropriate)
• Short limbs, small round body posture
• Fluffier softer coat

Expression bias:
• Ensure the expression is gentle, curious, or playful rather than neutral.

STRICT COLOR AND MARKING CLONING REQUIREMENT:
The baby must inherit the EXACT coat colors, pattern layout, marking positions, symmetry, stripe placement, nose color, eye color, and fur contrast from the original photo.

Do NOT generate a “cute reinterpretation” or an improved aesthetic version.
This is a *forensic match requirement*.

If the animal has:
– asymmetrical markings
– uneven fur tone
– faded areas
– discoloration
– unique patches
– strange shapes

REPRODUCE THEM EXACTLY.

If the original animal has dark fur with bright eyes, the baby must also have dark fur with bright eyes.
If the original animal has white cheeks with black ears, the baby must also have white cheeks with black ears.

Never introduce new colors.
Never remove existing pattern traits.
Never beautify symmetry.

You are MATCHING, not inventing.
Ignore lighting shadows. Only copy actual fur color boundaries as structural markings.

Style requirement:
• Photorealistic textures and lighting
• Natural anatomy and scale
• No stylization or artificial look
• DEPTH OF FIELD HANDLING: When generating the baby version, preserve the shallow-focus look: keep the pet sharp, keep the background soft. Do not melt fur or ears into the blur. Correct portrait halo artifacts and keep natural edge detail.
${additionalStyle}

${labelInstruction}

Watermark requirement:
Add a small, subtle text watermark in the bottom right corner that reads 'Created by BabyPets.ai'.

Before final output:
Compare the generated animal to the original reference and confirm all face and coat markings MATCH.
If anything is different, regenerate until it matches.

Final result must look like a real photograph of a six to eight week old version of the same animal, with correct markings, infant proportions, and the requested text banner integrated into the scene.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: closestRatio.label
        }
      }
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated from Gemini.");
    }

    // Check for image part
    const imagePart = parts.find(p => p.inlineData);
    if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
        return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    // Fallback: Check if it generated text explaining why it failed (safety, blurriness, etc)
    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
        const message = textPart.text;
        // Check for specific rejection messages
        if (message.includes("Your photo is a bit too blurry") || message.includes("No animal detected")) {
             throw new Error(message);
        }
        console.warn("Gemini returned text instead of image:", message);
        throw new Error("The model could not generate an image. It might have been blocked by safety settings or the prompt was interpreted as text-only.");
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Error generating baby pet:", error);
    throw error;
  }
};