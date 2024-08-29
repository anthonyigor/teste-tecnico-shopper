import { writeFile } from "fs/promises";
import { InternalError } from "../errors/InternalError";

export const saveBase64AsFile = async (imagebase64: string, outputFilePath: string) => {
    try {
        const base64Data = imagebase64.replace(/^data:image\/jpeg;base64,/, "");

        // Decodificar a string base64 para um buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');
    
        await writeFile(outputFilePath, imageBuffer);
        console.log('Imagem salva com sucesso.');
    } catch (error) {
        throw new InternalError('Erro ao salvar a imagem')
    }
}