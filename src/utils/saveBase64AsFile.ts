import { writeFile } from "fs";

export const saveBase64AsFile = (imagebase64: string, outputFilePath: string) => {
    const base64Data = imagebase64.replace(/^data:image\/jpeg;base64,/, "");

    // Decodificar a string base64 para um buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Escrever o buffer para um arquivo
    writeFile(outputFilePath, imageBuffer, err => {
        if (err) {
            console.error('Erro ao salvar o arquivo:', err);
        } else {
            console.log('Imagem salva com sucesso em', outputFilePath);
        }
    });
}