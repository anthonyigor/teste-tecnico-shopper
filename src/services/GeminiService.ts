import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from '@google/generative-ai/server'

export class GeminiService {
    private apiKey: string;
    private genAI: GoogleGenerativeAI;
    private fileManager: GoogleAIFileManager;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.fileManager = new GoogleAIFileManager(this.apiKey);
    }

    async extractMeasureFromImage(fileUri: string) {
        const model = this.genAI.getGenerativeModel({
            // Choose a Gemini model.
            model: "gemini-1.5-flash",
          });

        try {
            const result = await model.generateContent([
               {
                fileData: {
                    fileUri: fileUri,
                    mimeType: "image/jpeg"
                }
               },
               {
                text: '"If there is a meter in this image, tell me ONLY what the value of the reading is in the image"'
               }

            ]);
            console.log(result.response.text());
          } catch (error) {
            console.error("Error analyzing image:", error);
          }
    }

    async uploadImageToGoogleApiFile(filePath: string): Promise<string> {
      const uploadResponse = await this.fileManager.uploadFile(filePath, {
        mimeType: 'image/jpeg',
        displayName: 'My Image'
      })

      const getResponse = await this.fileManager.getFile(uploadResponse.file.name)
      return getResponse.uri
    }

}