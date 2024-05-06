const productImages = document.querySelectorAll(".product-public img");
const productImageSlide = document.querySelector(".img-view");

let activeImageSlide = 0; 

productImages.forEach((item, i) => {
    item.addEventListener('click', () => { 
        productImages[activeImageSlide].classList.remove('active');
        item.classList.add('active'); 
        productImageSlide.style.backgroundImage = `url('${item.src}')`; 
        activeImageSlide = i;
    })
})

const sizeBtns = document.querySelectorAll('.size-radio');
let checkedBtn = 0;

sizeBtns.forEach((item, i) => {
    item.addEventListener('click', () => { 
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check'); 
        checkedBtn = i; 
    })
})


//populating database data into product page
let productImage = document.querySelector('.product-public img');
let productBrand = document.querySelector('.product-brand');
let productName = document.querySelector('.product-description-short');
let productPrice = document.querySelector('.product-price');
let productSize = document.querySelector('.size-radio');
let productDes = document.querySelector('.long-description');

const setData = () => {
    productImage.src = data.ProductImages;
    productBrand.textContent = data.BrandName;
    productName.textContent = data.ProductName;
    productPrice.textContent = data.ProductName;
    productDes.textContent = data.ProductLDescription;
}

const fetchProductData = () => {
    fetch('/retail-products/${_id}', {
        method: 'get',
        headers: ({'Content-Type': 'application/json'}),
    }).then(res => res.json())
    .then(data => {
        console.log(data)
        setData(data);
    }).catch(err => {
        console.log(err);
        alert('No product exists');
})
}

let productId = null;
if(location.pathname != '/retail-products') {
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}


document.addEventListener('DOMContentLoaded', () => {
    const cartTotalPrice = document.getElementById('cart-total-price');
    console.log(cartTotalPrice);

    const addToCartBtn = document.querySelector('.cart-btn');
    if(addToCartBtn) {
        addToCartBtn.addEventListener('click', async (data) => {
            try {
                const productBrand = document.querySelector('.product-brand').textContent;
                const productName = document.querySelector('.product-description-short').textContent;
                const productPrice = document.querySelector('.product-price').textContent;
                const productSize = document.querySelector('input[name = "size"]:checked').value;
                
                const prodImg = document.querySelector('.product-public img');
                const thumbnailImg = prodImg ? prodImg.src : '';
               
                let quantity = 1;

                const cartProduct = {
                    id: productId, 
                    img: thumbnailImg,
                    brand: productBrand,
                    name: productName,
                    price: productPrice,
                    size: productSize,
                    quantity
                };
            
            
                const response = await fetch('/cart/add', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        productId,
                        ThumbnailImage: thumbnailImg,
                        BrandName: productBrand,
                        ProductName: productName,
                        ProductPrice: productPrice,
                        ProductSize: productSize,
                        CartQuantity: quantity
                    })
                })

            console.log('Add to cart button clicked', cartProduct);
            
            if (response.ok) {
                const data = await response.json();
                alert('Product Added Successfully!')
                console.log(data.message);
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product', error)
        }
        })
    } else {
        console.error('Add to cart button not found');
    }
});

