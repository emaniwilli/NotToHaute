const checkoutBtn = document.querySelector('.checkout');
document.querySelector(".checkout").addEventListener("click", async function() { 
    var address1 = document.getElementById("address1").value.trim(); 
    var city = document.getElementById("city").value.trim(); 
    var state = document.getElementById("state").value.trim(); 
    var zip = document.getElementById("zip").value.trim(); 
    var fullName = document.getElementById("fullName").value.trim(); 
    var cardNumber = document.getElementById("cardNumber").value.trim(); 
    var cvv = document.getElementById("cvv").value.trim(); 
    var zipCode = document.getElementById("zipCode").value.trim(); 
    
    if (!address1.length < 5 || !city.length < 2 || !state.length < 2 || !zip.length == 5 || !fullName.length < 2|| !cardNumber.length == 16 || !cvv.length == 3 || !zipCode.length == 5 ) { 
        alert("Please fill out all fields."); 
        return; 
    } 

    location.href = "/checkout"; })