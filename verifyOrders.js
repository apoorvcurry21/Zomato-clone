const API_URL = 'http://localhost:5000/api';

const verifyOrders = async () => {
    try {
        console.log("--- 1. Login as Customer ---");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'customer@gmail.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) {
            console.error("Login failed:", loginData);
            return;
        }
        const { token } = loginData;
        const authHeader = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        console.log("Login successful.");

        console.log("--- 2. Fetch a Restaurant and its Menu ---");
        const restRes = await fetch(`${API_URL}/restaurants?pincode=110001`);
        const restaurants = await restRes.json();
        if (!restRes.ok || restaurants.length === 0) {
            console.error("Failed to fetch restaurants or none found:", restaurants);
            return;
        }
        const restaurant = restaurants[0];
        console.log(`Using Restaurant: ${restaurant.name} (ID: ${restaurant._id})`);

        const menuRes = await fetch(`${API_URL}/restaurants/${restaurant._id}/menu`);
        const menu = await menuRes.json();
        if (!menuRes.ok || menu.length === 0) {
            console.error("Failed to fetch menu or menu empty:", menu);
            return;
        }
        const menuItem = menu[0];
        console.log(`Ordering: ${menuItem.name} (Price: ${menuItem.price})`);

        console.log("\n--- 3. Testing Order Creation (Invalid Pincode) ---");
        const pinErrRes = await fetch(`${API_URL}/orders/create`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                restaurantId: restaurant._id,
                items: [{ menuItem: menuItem._id, quantity: 2 }],
                deliveryPincode: '999999' // Invalid
            })
        });
        const pinErrData = await pinErrRes.json();
        console.log(`Status with 999999: ${pinErrRes.status} (${pinErrData.message})`);

        console.log("\n--- 4. Testing Order Creation (Valid Flow with Coupon) ---");
        const orderDataBody = {
            restaurantId: restaurant._id,
            items: [{ menuItem: menuItem._id, quantity: 2 }],
            deliveryPincode: '110001',
            couponCode: 'SAVE20'
        };
        console.log("Sending order request:", orderDataBody);

        const createRes = await fetch(`${API_URL}/orders/create`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify(orderDataBody)
        });
        const createData = await createRes.json();
        if (createRes.ok) {
            console.log("Order Created Successfully!");
            console.log(`Razorpay Order ID: ${createData.razorpayOrder.id}`);
            console.log(`Total: ${createData.order.totalAmount}, Discount: ${createData.order.discountedAmount}`);
        } else {
            console.log("Failed to create order. Status:", createRes.status);
            console.log("Error details:", createData);
        }

        console.log("\n--- 5. Testing Order History (/api/orders/myorders) ---");
        const historyRes = await fetch(`${API_URL}/orders/myorders`, { headers: authHeader });
        const history = await historyRes.json();
        console.log(`Orders found in history: ${history.length}`);
        if (history.length > 0) {
            console.log(`Latest Order ID: ${history[0]._id}, Status: ${history[0].orderStatus}`);
        }

        console.log("\n✅ ORDER MANAGEMENT VERIFICATION COMPLETE!");

    } catch (err) {
        console.error("Error during verification:", err.message);
        console.error(err.stack);
    }
};

verifyOrders();
