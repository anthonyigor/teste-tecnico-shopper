import { isBase64Image } from "./validators";

describe("Test isBase64Image", () => {
    it("should return true for a valid base64 image", () => {
        const validBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
        const isValid = isBase64Image(validBase64);
        expect(isValid).toBe(true);
    });

    it("should return false for a invalid base64 image", () => {
        const validBase64 = "data:text/plain;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
        const isValid = isBase64Image(validBase64);
        expect(isValid).toBe(false);
    });

    it('should return false for a invalid base64 string', () => {
        const invalidBase64 = "data:image/png;base64,984112!";
        expect(isBase64Image(invalidBase64)).toBe(false);
    });

})