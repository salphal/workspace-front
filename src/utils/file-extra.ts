import { saveAs } from 'file-saver';

export class FileExtra {
  /**
   * 文件存储
   * @param {*} config - 配置对象
   * @param {string} config.name - 文件名称
   * @param {BlobPart} config.content - 文件内容
   * @param {string} [config.type=application/octet-stream] - 文件类型
   *
   * 常见文件类型：
   * - text/plain: 普通文本文件
   * - application/json: JSON 文件
   * - text/html: HTML 文件
   * - application/xml: XML 文件
   * - image/jpeg: JPEG 图像
   * - image/png: PNG 图像
   * - application/pdf: PDF 文件
   * - application/zip: ZIP 压缩文件
   * - audio/mpeg: MP3 音频文件
   * - video/mp4: MP4 视频文件
   *
   * 如果未提供 `type`，默认值为 `application/octet-stream`，表示二进制流文件类型
   */
  static saveAs(config: { name: string; content: BlobPart; type?: string }) {
    const { content, name, type = 'application/octet-stream' } = config;
    const fileContent = new Blob([content], { type });
    saveAs(fileContent, name);
  }
}
