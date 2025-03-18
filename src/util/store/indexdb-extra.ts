import Dexie from 'dexie';

/**
 * https://dexie.org/
 */
interface IndexDBConfig {
  /** 数据库名称 */
  dbName: string;
  /** 数据库版本*/
  version: number;
  /** 创建表的对象, 表必须有 id 列, 其他的列可以在新增修改的时候, 动态改变 */
  schema: { [tableName: string]: string | null };
}

export class IndexdbExtra {
  db: Dexie;

  constructor(config: IndexDBConfig) {
    const {
      dbName = 'IndexDB',
      version = 1,
      schema = {
        table: '++id', // 必须有自增id, 其他的列可以在 crud 的时候动态修改
        // table: '++id, name, age, gender',
      },
    } = config;
    this.db = new Dexie(dbName) as Dexie;
    this.db.version(version).stores(schema);
  }
}
