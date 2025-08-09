// Utility functions for image processing and export

export const createImageFromFile = (file) => ({
  id: Date.now() + Math.random(),
  src: URL.createObjectURL(file),
  file,
  cropped: null
});

export const cropImage = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      
      const croppedSrc = canvas.toDataURL('image/jpeg');
      resolve(croppedSrc);
    };
  });
};

export const exportCollage = (images) => {
  if (images.length === 0) return;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Simple grid layout - 2 columns
  const cols = 2;
  const rows = Math.ceil(images.length / cols);
  const itemWidth = 300;
  const itemHeight = 300;
  
  canvas.width = cols * itemWidth;
  canvas.height = rows * itemHeight;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  let loadedImages = 0;
  const totalImages = images.length;
  
  images.forEach((img, index) => {
    const image = new window.Image();
    image.onload = () => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * itemWidth;
      const y = row * itemHeight;
      
      ctx.drawImage(image, x, y, itemWidth, itemHeight);
      loadedImages++;
      
      if (loadedImages === totalImages) {
        // Download the canvas as image
        const link = document.createElement('a');
        link.download = 'collage.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    image.src = img.cropped || img.src;
  });
};
