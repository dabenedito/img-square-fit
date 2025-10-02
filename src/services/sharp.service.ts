import sharp from "sharp";

export class SharpService {
  
  /**
   * Processes an image buffer to create a square composition with the original image centered
   * on a blurred background of itself. The final image maintains aspect ratio within a square frame.
   *
   * @param buffer - The input image buffer to be processed
   * @returns A Promise that resolves to a Buffer containing the processed image in PNG format
   * @throws - Will throw an error if image processing fails
   */
  static async fitImage(buffer: Buffer): Promise<Buffer<ArrayBufferLike>> {
    const sharpBuffer = sharp(buffer);
    const metadata = await sharpBuffer.metadata();

    let size: number;
    if (metadata.width && metadata.height) {
      size = Math.max(metadata.width, metadata.height);
    } else {
      size = 512; // Tamanho padrão se não conseguir obter as dimensões.
    }

    const foreground = await sharpBuffer.resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    }).png()
      .toBuffer();

    const background = await sharpBuffer.resize(size, size, { fit: 'cover' })
      .blur(30)
      .toBuffer();

    return await sharp(background)
      .composite([{ input: foreground, gravity: 'center' }])
      .png()
      .toBuffer();
  }
}