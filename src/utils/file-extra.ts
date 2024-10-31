import { saveAs } from 'file-saver';

export class FileExtra {
  /**
   * @param {*} config
   * @property {string} config.name - 文件名称
   * @property {string} config.content - 文件内容
   * @property {string} config.type - 文件类型
   */
  static saveAs(config: { name: string; content: BlobPart; type?: string }) {
    const { content, name, type = 'application/octet-stream' } = config;
    const fileContent = new Blob([content], { type });
    saveAs(fileContent, name);
  }
}
