import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
    private apiKey: string;
    private genAI: GoogleGenerativeAI;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(this.apiKey);   
    }

    async extractMeasureFromImage(imageBase64: string) {
        const model = this.genAI.getGenerativeModel({
            // Choose a Gemini model.
            model: "gemini-1.5-pro",
          });

        try {
            const result = await model.generateContent([
               {
                inlineData: {
                    data: imageBase64,
                    mimeType: "image/jpeg"
                }
               },
               {
                text: '"Analyze this image and describe the content."'
               }

            ]);
            console.log(result.response.text()); // O resultado da análise será impresso aqui
          } catch (error) {
            console.error("Error analyzing image:", error);
          }
    }

}