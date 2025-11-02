const { exec } = require('child_process');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'me-south-1'
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
      
      await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `backups/${backupFile}`,
        Body: fileContent
      }).promise();
      
      console.log(`Backup uploaded: ${backupFile}`);
      fs.unlinkSync(backupFile);
    } catch (uploadError) {
      console.error('Upload failed:', uploadError);
    }
  });
}

createBackup();