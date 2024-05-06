let noProduct = document.querySelector('.no-product-text');

const createProducts = () => {
    fetch('/admin/products', {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data && data.length > 0) {
            data.forEach(product => createProductElements(product));
        } else {
            noProduct.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error fetching products', error);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    createProducts();
});