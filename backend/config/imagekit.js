import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'dummy_public_key',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://dummy_endpoint',
});

export default imagekit;