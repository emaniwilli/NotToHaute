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

const addToCart = () => {
    const productBrand = '<%= product.BrandName %>';
    const productName = '<%= product.ProductName %>';
    const productPrice = '<%= product.ProductPrice %>';
    const productSize = document.querySelector('input[name = "size"]:checked').value;

    const cartProduct = {
        brand: productBrand,
        name: productName,
        price: productPrice,
        size: productSize
    };

    console.log('Item added to cart:', cartProduct);
}

document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtn = document.querySelector('.cart-btn');

    if(addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productBrand = '<%= product.BrandName %>';
            const productName = '<%= product.ProductName %>';
            const productPrice = '<%= product.ProductPrice %>';
            const productSize = document.querySelector('input[name = "size"]:checked').value;

            const cartProduct = {
                brand: productBrand,
                name: productName,
                price: productPrice,
                size: productSize
            };
            console.log('Add to cart button clicked');
        })
    } else {
        console.error('Add to cart button not found');
    }
});

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