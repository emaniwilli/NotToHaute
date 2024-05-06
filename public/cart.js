const calculateTotal = (cartItems) => {
    let totalPrice = 0;
    let totalQuantity = 0;

    cartItems.forEach(item => {
        totalPrice += item.ProductPrice * item.CartQuantity;
        totalQuantity += item.CartQuantity;
    });

    return { totalPrice, totalQuantity };
};

const updateCartTotal = (totalPrice, totalQuantity) => {
    const totalPriceElement = document.getElementById('cart-total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice.toFixed(2);
    } else {
        console.error('Cart total price element not found');
    }

    const totalQuantityElement = document.getElementById('cart-total-quantity');
    if (totalQuantityElement) {
        totalQuantityElement.textContent = totalQuantity;
    } else {
        console.error('Cart total quantity element not found');
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/cart');
        if (response.ok) {
            const cartData = await response.json();
            const { totalPrice, totalQuantity } = calculateTotal(cartData);
            updateCartTotal(totalPrice, totalQuantity);
        } else {
            console.error('Failed to fetch cart data');
        }
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
});
;


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

