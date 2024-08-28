import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from '@google/generative-ai/server'
import { InternalError } from "../errors/InternalError";

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

            return this.extractNumericValue(result.response.text())
          } catch (error) {
            throw new InternalError(`Error analyze image: ${error}`)
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

    // extrair apenas valor da contagem
    private extractNumericValue(responseText: string): string {
      const regex = /\d+/;
      const extractedValue = responseText.match(regex)?.[0];

      if (!extractedValue) {
          throw new InternalError("No numeric value could be extracted from the image.");
      }

      return extractedValue;
  }

}