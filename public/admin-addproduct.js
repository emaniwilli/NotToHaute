
const cloudName = 'djoho4uyj';
const unsignedUploadPreset = 'llcl0ey5';
let ImgUrls = [];

//uploading images to cloudinary
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
        ImgUrls.push(imageUrl);
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

const validation = () => {
    if (!brandName.value.length){
        return alert('Please enter brand name')
    } else if(!productName.value.length){
        return alert('Please enter product name')
    } else if(sku.value > 10 || sku.value < 5){
        return alert('Please enter an SKU value between 5 and 10 characters')
    } else if (longDescription.value.length > 2000 || longDescription.value.length < 50){
        return alert('Enter a detailed description between 50 and 2000 characters')
    } else if(!sizes.length){
        return alert('Please select at least one size')
    } else if(!tags.length){
        return alert('Please select at least one product tag')
    } else if(!price.value.length){
        return alert('Please enter the retail price for the product')
    } else if(!inventory.value >= 50){
        return alert('Inventory must be greater than 50 units')
    }
    return true;
}

//storing sizes from checkbox inputs
const storeSizes = () => {
    sizes = [];
    let sizeCheck = document.querySelectorAll('.size-check');
    sizeCheck.forEach(item => {
        if(item.checked) {
            sizes.push(item.value);
        }
    })
}

const storeTags = () => {
    tags = [];
    let tagCheck = document.querySelectorAll('.tag-check');
    tagCheck.forEach(item => {
        if(item.checked) {
            tags.push(item.value);
        }
    })
}

//submitting product
const brandName = document.querySelector('#brandName');
const productName = document.querySelector('#productName');
const sku = document.querySelector('#sku');
const longDescription = document.querySelector('#longDescription');

let sizes = [];
let tags = [];

const price = document.querySelector('#price');
const inventory = document.querySelector('#stock');
const color = document.querySelector('#color');

const addBtn = document.querySelector('#add');
const saveBtn = document.querySelector('#save');

const productData = () => {
    return data = {
        BrandName: brandName.value,
        ProductName: productName.value,
        SKU: sku.value,
        ProductLDescription: longDescription.value,
        ProductImages: ImgUrls,
        ProductSizes: sizes,
        ProductTags: tags,
        ProductPrice: price.value,
        InventoryStock: inventory.value,
        ProductColors: color.value 
    }
}

addBtn.addEventListener('click', async () => {
        try {
        event.preventDefault();
        
        storeSizes();
        storeTags();


        if(validation()){
            let data = productData();
                const response = fetch('/admin/addproduct', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    throw new Error('Failed to send data');
                }
                const responseData = await response.json();
                console.log('Data sent successfully:', responseData);
            }
        } catch (error) {
            console.error('Error:', error)
        }
        document.location = '/admin/dashboard'
});