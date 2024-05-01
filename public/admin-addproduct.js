
const cloudName = 'djoho4uyj';
const unsignedUploadPreset = 'llcl0ey5';

    document.addEventListener('DOMContentLoaded', function() {
        const fileUpload = document.querySelector('.fileUpload');
        const imgCollection = document.querySelector('.image-collection');
        const productImg = document.querySelector('.product-image');
        let numImgUpload = 0;
        fileUpload.addEventListener('change', async (event) => {
            const files = event.target.files;
            for (const file of files) {
                if(numImgUpload < 5) {
                    await uploadFile(file, imgCollection, productImg, numImgUpload);
                    numImgUpload ++;
                } else {
                    fileUpload.disabled = true
                    alert('Cannot upload more than 5 images')
                };
            };
        });
    });
    
    async function uploadFile(file, imgCollection, productImg, numImgUpload) {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        const fd = new FormData();
        fd.append('upload_preset', unsignedUploadPreset);
        fd.append('file', file);
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: fd,
            });
    
            if (!response.ok) {
                throw new Error('Failed to upload file');
            }
    
            const data = await response.json();
            // File uploaded successfully
            const imageUrl = data.secure_url;
            // Create a thumbnail of the uploaded image, with 150px width
            const tokens = imageUrl.split('/');
            tokens.splice(-2, 0, 'h_150,w_100,f_auto');
            const img = new Image();
            img.src = tokens.join('/');
            img.alt = data.public_id;
            if (numImgUpload == 0) {
                console.log('Setting product image background:', imageUrl);
                productImg.style.backgroundImage = `url('${imageUrl}')`
            }
            imgCollection.appendChild(img); // Assuming you have an element with id 'gallery'
        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    }