import sharp, { Sharp } from "sharp";

export class SharpService {
  static async fitImage(sharpBuffer: Sharp): Promise<Buffer<ArrayBufferLike>> {
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