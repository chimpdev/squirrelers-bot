import database from 'quick.db'
const { QuickDB, MongoDriver } = database;

export default async function initDatabase() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI environment variable is not set');

  const mongoDriver = new MongoDriver(process.env.MONGO_URI);
  await mongoDriver.connect();

  global.database = new QuickDB({ driver: mongoDriver });
}