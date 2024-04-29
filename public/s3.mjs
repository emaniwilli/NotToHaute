import dotenv from 'dotenv'
import aws from 'aws-sdk'

dotenv.config();

const region = 'us-east-1';
const bucket = 'nottohaute';
const AWS_Access = process.env.AWS_ACCESS_KEY;
const AWS_Secret = process.env.AWS_SECRET_KEY;

const s3 = new aws.S3({
    region,
    AWS_Access,
    AWS_Secret,
    signatureVersion: 'v4'
})

//image upload
async function generateImageUrl() {
    let date = new Date();
    let id = parseInt(Math.random() * 100000000000);

    const imageName = `${id}${date.getTime()}.png`;

    const params = ({
        ACL: 'public-read',
        Bucket: bucket,
        Key: imageName,
        Expires: 300,
        ContentType: 'image/png'
    })

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
}

