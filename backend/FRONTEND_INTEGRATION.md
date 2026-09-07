# Frontend Integration Guide

How to connect your Besties website to the backend payment system.

---

## 🔗 Update Frontend Payment Code

Add this to your website's JavaScript (replace the demo payment code):

```javascript
// Update the registration form submission
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const price = document.getElementById('selectedPrice').value;
    const phone = document.getElementById('momoPhone').value;

    registrationData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        ageGroup: document.getElementById('age').value,
        story: document.getElementById('story').value,
        price: price,
        paymentMethod: 'mobilemoney'
    };

    // Show processing
    const processingMsg = document.createElement('div');
    processingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 9999; text-align: center;';
    processingMsg.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
        <div style="font-size: 1.2rem; font-weight: 600; color: var(--besties-pink); margin-bottom: 1rem;">Processing Payment</div>
        <div style="color: #666;">Sending to MTN Mobile Money...</div>
    `;
    document.body.appendChild(processingMsg);

    try {
        // Call backend endpoint
        const response = await fetch('https://yourdomain.com/api/initiate-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: registrationData.fullName,
                email: registrationData.email,
                ageGroup: registrationData.ageGroup,
                story: registrationData.story,
                phone: phone,
                network: selectedNetwork
            })
        });

        const data = await response.json();

        processingMsg.remove();

        if (data.success) {
            alert(`✅ Payment prompt sent!\n\nPhone: ${phone}\nAmount: GHS 200\n\nCheck your phone to confirm payment.`);
            closeMomoModal();
            registrationForm.reset();
            closeRegistrationModal();
        } else {
            alert('❌ Payment failed: ' + data.message);
        }

    } catch (error) {
        processingMsg.remove();
        alert('❌ Error: ' + error.message);
        console.error('Payment error:', error);
    }
});
```

---

## 🌐 Environment Variables

Update in your index.html or config file:

**Development:**
```javascript
const API_URL = 'http://localhost:3000/api';
```

**Production:**
```javascript
const API_URL = 'https://yourdomain.com/api';
```

---

## ✅ Checklist

- [ ] Backend is running (npm start)
- [ ] Update `phone` input in payment modal
- [ ] Replace `yourdomain.com` with your actual domain
- [ ] Test payment flow with sandbox credentials
- [ ] Verify webhook is configured
- [ ] Test on actual MTN network
- [ ] Switch to live credentials when ready

---

## 🔄 Payment Flow with Backend

```
User fills form
     ↓
Clicks "Pay & Register"
     ↓
Selects network (MTN)
     ↓
Enters phone number
     ↓
Frontend → POST /api/initiate-payment
     ↓
Backend → MTN API
     ↓
MTN sends prompt to phone
     ↓
User confirms on phone
     ↓
MTN → Webhook to /api/mtn-callback
     ↓
Registration confirmed ✅
```

---

## 📱 Phone Number Format

Accept both formats:
- `0556123456` (local)
- `+233556123456` (international)

Backend will handle both.

---

## 🚀 Live Deployment Checklist

1. Update `CALLBACK_URL` in backend `.env`
2. Update `API_URL` in frontend
3. Switch MTN credentials to LIVE
4. Update `MTN_API_URL` to live endpoint
5. Test with small amount first
6. Monitor transactions
7. Set up email confirmations
8. Add database for storing registrations

---

## 📞 Need Help?

Check the README.md in backend folder for full documentation.

Contact: [WhatsApp](https://wa.me/233246381172)
