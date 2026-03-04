const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.COLUD_SECRET_API
});

const storage= new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"wanderlust_Development",
        allowFormat:["png","jpg","jpeg",],
    },
});

module.exports={
    cloudinary,storage
};