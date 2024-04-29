//uploading images
let uploadImages = document.querySelectorAll('.fileUpload');
let imagePath = [];

uploadImages.forEach((fileUpload, index) => {
    fileUpload.addEventListener("change", async event => {
        event.preventDefault();
        const file = fileUpload.files[0];
        let imageUrl;
        const {url} = await fetch('/s3url').then(res => res.json())
            await fetch(url, {
                    method: 'PUT',
                    headers: new Headers({'Content-Type': 'image/png'}),
                    body: file
                }).then(res => {
                    imageUrl = url.split("?")[0];
                    imagePath[index] = imageUrl;
                    console.log(imageUrl);
                    /*let label = document.querySelector(`label[for=${fileUpload.id}]`);
                    label.style.backgroundImage = `url(${imageUrl})`;
                    let productImage = document.querySelector(".product-image");
                    productImage.style.backgroundImage = `url(${imageUrl})`;*/
                })
            }
        )
})    