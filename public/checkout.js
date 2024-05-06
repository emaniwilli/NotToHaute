const checkoutBtn = document.querySelector('.checkout');

checkoutBtn.addEventListener('click', () => {
    let address = getAddress();
    if (address) {
        processPayment();
    }
})

const getAddress = () => {
    let address1 = document.querySelector('#address1').value;
    let address2 = document.querySelector('#address2').value;
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    let zip = document.querySelector('#zip').value;

    if(!address1.length || !city.length || !state.length || !zip.length) {
        return alert('Field cannot be empty');
    } else {
        return { address1, address2, city, state, zip }
    }
}

const processPayment = async () => {
    const paymentData = {
        amount: calculateTotal()
    };
    try {
        const repsponse = await fetch('/process-payment', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if(result.success) {
            alert('Payment Successful!');
        } else {
            alert('Payment failed-- Please try again');
        }
    } catch (error) {
        console.error('Error processing payment', error);
        alert('We encountered an error while processing your payment. Please try again.')
    }
}