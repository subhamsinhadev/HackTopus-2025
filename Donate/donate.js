const form = document.querySelector('.donate-form');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Page reload roke

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const amount = document.getElementById('amount').value.trim();

    if (name === '' || email === '' || amount === '') {
        alert('Please fill in all fields.');
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid donation amount.');
        return;
    }

    alert(`Thank you ${name} for donating ₹${amount}! ❤️`);
    
    // Form clear karne ke liye (optional)
    form.reset();
});
