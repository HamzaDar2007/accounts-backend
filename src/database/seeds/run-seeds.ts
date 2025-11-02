import { DataSource } from 'typeorm';
import { SeedInitialData1703040000000 } from './1703040000000-SeedInitialData';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'accounting_db',
  ssl: process.env.DATABASE_SSL === 'true',
  synchronize: false,
  logging: true,
});

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('📦 Database connected');

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    console.log('🌱 Running seeds...');
    const seed = new SeedInitialData1703040000000();
    await seed.up(queryRunner);

    await queryRunner.release();
    await dataSource.destroy();
    
    console.log('✅ Seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeeds();