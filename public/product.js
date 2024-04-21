//toggle image thumbnails

const productImages = document.querySelectorAll(".product-images img");
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

//toggle size buttons

const sizeBtns = document.querySelectorAll('.size-radio');
let checkedBtn = 0;

sizeBtns.forEach((item, i) => {
    item.addEventListener('click', () => { 
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check'); 
        checkedBtn = i; 
    })
})