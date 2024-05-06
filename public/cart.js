document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/cart', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const cartData = await response.json();
            console.log('Cart Data:', cartData); // Debugging
            const { totalPrice, totalQuantity } = calculateTotal(cartData);
            console.log('Total Price:', totalPrice); // Debugging
            console.log('Total Quantity:', totalQuantity); // Debugging
            updateCartTotal(totalPrice, totalQuantity);
            updateCheckoutContainer(totalPrice, totalQuantity);
        } else {
            console.error('Failed to fetch cart data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
});

const updateCheckoutContainer = (totalPrice, totalQuantity) => {
    const totalPriceElement = document.getElementById('cart-total-price');
    const totalQuantityElement = document.getElementById('cart-total-quantity');

    if (totalPriceElement && totalQuantityElement) {
        totalPriceElement.textContent = totalPrice.toFixed(2);
        totalQuantityElement.textContent = totalQuantity;
    } else {
        console.error('Checkout container elements not found');
    }
};



const deleteBtns = document.querySelectorAll('.remove');
deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener('click', async () => {
        const itemId = deleteBtn.dataset.itemId;
        console.log(itemId);
        try {
            const response = await fetch(`/cart/delete/${itemId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                location.reload();
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        }
    });
});

