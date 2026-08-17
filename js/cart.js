// ===============================
// CART PAGE RENDERER (cart.html)
// ===============================

function renderCartPage() {
    const cartTableBody = document.querySelector("#cart-items-body");
    const summarySubtotal = document.querySelector("#summary-subtotal");
    const summaryDiscount = document.querySelector("#summary-discount");
    const summaryTax = document.querySelector("#summary-tax");
    const summaryTotal = document.querySelector("#summary-total");

    if (!cartTableBody) return;

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("clicon_cart")) || [];
    } catch (e) {
        cart = [];
    }

    cartTableBody.innerHTML = "";

    if (cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #5F6C72;">
                    Your cart is currently empty.
                </td>
            </tr>
        `;
        if (summarySubtotal) summarySubtotal.textContent = "$0.00";
        if (summaryDiscount) summaryDiscount.textContent = "$0.00";
        if (summaryTax) summaryTax.textContent = "$0.00";
        if (summaryTotal) summaryTotal.textContent = "$0.00 USD";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQty = parseInt(item.quantity) || 1;
        const itemSubtotal = itemPrice * itemQty;
        subtotal += itemSubtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="product-info-cell">
                <button class="remove-btn" onclick="removeCartItem(${index})" aria-label="Remove item">✕</button>
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <span>${item.name}</span>
            </td>
            <td class="price-cell">
                <span class="current-price">$${itemPrice.toFixed(2)}</span>
            </td>
            <td>
                <div class="quantity-control">
                    <button class="qty-btn minus" onclick="changeCartQty(${index}, -1)">−</button>
                    <span class="qty-val">${String(itemQty).padStart(2, '0')}</span>
                    <button class="qty-btn plus" onclick="changeCartQty(${index}, 1)">+</button>
                </div>
            </td>
            <td class="subtotal-cell">$${itemSubtotal.toFixed(2)}</td>
        `;

        cartTableBody.appendChild(row);
    });

    // Summary calculations
    const discount = subtotal > 0 ? 24.00 : 0.00;
    const tax = subtotal * 0.10;
    const total = subtotal > 0 ? (subtotal - discount + tax) : 0;

    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryDiscount) summaryDiscount.textContent = `$${discount.toFixed(2)}`;
    if (summaryTax) summaryTax.textContent = `$${tax.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)} USD`;
}

// Quantity change handler
function changeCartQty(index, change) {
    let cart = JSON.parse(localStorage.getItem("clicon_cart")) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem("clicon_cart", JSON.stringify(cart));
        renderCartPage();
        if (typeof updateCartBadge === "function") updateCartBadge();
    }
}

// Remove item handler
function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem("clicon_cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("clicon_cart", JSON.stringify(cart));
    renderCartPage();
    if (typeof updateCartBadge === "function") updateCartBadge();
}

// Render on page load
document.addEventListener("DOMContentLoaded", renderCartPage);