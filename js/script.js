// ===============================
// GLOBAL CART STATE & NAVIGATION
// ===============================

// Retrieve cart from storage
function getCart() {
    try {
        return JSON.parse(localStorage.getItem("clicon_cart")) || [];
    } catch (e) {
        return [];
    }
}

// Save cart to storage and update UI
function saveCart(cart) {
    localStorage.setItem("clicon_cart", JSON.stringify(cart));
    updateCartBadge();
}

// Global update badge counter
function updateCartBadge() {
    const cart = getCart();
    const cartCountBadge = document.querySelector("#cart-count");
    if (cartCountBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalItems;
    }
}

// Redirect header cart icon to cart page
const cartIcon = document.querySelector(".cart-icon");
if (cartIcon) {
    cartIcon.style.cursor = "pointer";
    cartIcon.addEventListener("click", () => {
        window.location.href = "cart.html";
    });
}

// Add Item Function with fallbacks
function addToCart(productData, quantity = 1) {
    let cart = getCart();

    // Clean up product values and set defaults if missing
    const name = productData.name || "Product Item";
    const image = productData.image || "images/product-1.png";
    const rawPrice = String(productData.price || "0").replace(/[^0-9.]/g, '');
    const price = parseFloat(rawPrice) || 0;

    const existingIndex = cart.findIndex(item => item.name === name);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: quantity
        });
    }

    saveCart(cart);
}

// Initial badge update on script load
updateCartBadge();


// ===============================
// HOMEPAGE CLICK HANDLERS
// ===============================
const productsGrid = document.querySelector(".products-grid");
const modal = document.querySelector("#product-modal");
const modalClose = document.querySelector("#modal-close");
const modalImage = document.querySelector("#modal-product-image");
const modalName = document.querySelector("#modal-product-name");
const modalDescription = document.querySelector("#modal-product-description");
const modalPrice = document.querySelector("#modal-product-price");
const modalBrand = document.querySelector("#modal-product-brand");
const modalQuantity = document.querySelector("#modal-quantity");
const modalPlus = document.querySelector("#modal-plus");
const modalMinus = document.querySelector("#modal-minus");
const modalAddCart = document.querySelector("#modal-add-cart");

let selectedProduct = null;
let selectedQuantity = 1;

if (productsGrid) {
    productsGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card");
        if (!card) return;

        // Pull dataset values or fall back to visible text inside card
        const name = card.dataset.name || card.querySelector("h3")?.innerText.trim() || "Product Item";
        const price = card.dataset.price || card.querySelector(".price, .current-price")?.innerText.trim() || "0";
        const image = card.dataset.image || card.querySelector("img")?.getAttribute("src") || "images/product-1.png";
        const description = card.dataset.description || "No description available.";
        const brand = card.dataset.brand || "Clicon";

        const productData = { name, price, image, description, brand };

        // 1. If clicking directly on "ADD TO CART" button
        if (e.target.closest(".add-cart-btn")) {
            e.stopPropagation();
            addToCart(productData, 1);
            alert(`${productData.name} added to cart!`);
            return;
        }

        // 2. Otherwise open preview modal
        selectedProduct = productData;
        if (modalName) modalName.textContent = selectedProduct.name;
        if (modalPrice) modalPrice.textContent = `$${selectedProduct.price}`;
        if (modalImage) modalImage.src = selectedProduct.image;
        if (modalDescription) modalDescription.textContent = selectedProduct.description;
        if (modalBrand) modalBrand.textContent = selectedProduct.brand;

        selectedQuantity = 1;
        if (modalQuantity) modalQuantity.textContent = selectedQuantity;
        if (modal) modal.classList.add("active");
    });
}

// Modal Buttons Logic
if (modalClose) modalClose.addEventListener("click", () => modal.classList.remove("active"));

if (modalPlus) {
    modalPlus.addEventListener("click", () => {
        selectedQuantity++;
        if (modalQuantity) modalQuantity.textContent = selectedQuantity;
    });
}

if (modalMinus) {
    modalMinus.addEventListener("click", () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            if (modalQuantity) modalQuantity.textContent = selectedQuantity;
        }
    });
}

if (modalAddCart) {
    modalAddCart.addEventListener("click", () => {
        if (selectedProduct) {
            addToCart(selectedProduct, selectedQuantity);
            if (modal) modal.classList.remove("active");
            alert(`${selectedProduct.name} added to cart!`);
        }
    });
}

// Carousel Logic
const categories = document.querySelector("#categories-track");
const nextButton = document.querySelector("#category-next");
const prevButton = document.querySelector("#category-prev");

if (nextButton && prevButton && categories) {
    nextButton.addEventListener("click", () => categories.scrollBy({ left: 300, behavior: "smooth" }));
    prevButton.addEventListener("click", () => categories.scrollBy({ left: -300, behavior: "smooth" }));
}