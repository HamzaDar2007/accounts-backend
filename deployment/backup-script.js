const { exec } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'me-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backup-${timestamp}.sql`;
  
  const pgDumpCommand = `pg_dump -h ${process.env.DATABASE_HOST} -U ${process.env.DATABASE_USER} -d ${process.env.DATABASE_NAME} > ${backupFile}`;
  
  exec(pgDumpCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error('Backup failed:', error);
      return;
    }
    
    try {
      const fs = require('fs');
      const fileContent = fs.readFileSync(backupFile);
      
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `backups/${backupFile}`,
        Body: fileContent
      });
      
      await s3.send(command);
      
      console.log(`Backup uploaded: ${backupFile}`);
      fs.unlinkSync(backupFile);
    } catch (uploadError) {
      console.error('Upload failed:', uploadError);
    }
  });
}

createBackup();