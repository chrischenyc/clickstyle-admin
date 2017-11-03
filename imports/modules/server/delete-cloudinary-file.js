import cloudinary from 'cloudinary';

const deleteCloudinaryFile = (fileURL, callback) => {
  const resourceId = fileURL.split('/').pop();
  cloudinary.v2.api.delete_resources([resourceId], callback);
};

export default deleteCloudinaryFile;
