import { saveAs } from 'file-saver';

export class FileExtra {
  /**
   * 文件存储
   * @param {*} config - 配置对象
   * @param {string} config.name - 文件名称
   * @param {string} config.content - 文件内容
   * @param {string} config.type [application/octet-stream] - 文件类型
   */
  static saveAs(config: { name: string; content: BlobPart; type?: string }) {
    const { content, name, type = 'application/octet-stream' } = config;
    const fileContent = new Blob([content], { type });
    saveAs(fileContent, name);
  }
}
