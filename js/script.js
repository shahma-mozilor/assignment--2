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
// MODAL & PRODUCT CLICK HANDLERS
// ===============================

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

// Function to populate and open modal
function openProductModal(productData) {
    selectedProduct = productData;
    selectedQuantity = 1;

    if (modalName) modalName.textContent = selectedProduct.name;
    if (modalPrice) modalPrice.textContent = `$${selectedProduct.price}`;
    if (modalImage) modalImage.src = selectedProduct.image;
    if (modalDescription) modalDescription.textContent = selectedProduct.description;
    if (modalBrand) modalBrand.textContent = selectedProduct.brand;
    if (modalQuantity) modalQuantity.textContent = String(selectedQuantity).padStart(2, '0');

    if (modal) modal.classList.add("active");
}

// Unified Click Event Listener
document.addEventListener("click", function (e) {

    // 1. CLICKED ON A SMALL PRODUCT (List Section)
    const smallProduct = e.target.closest(".small-product");
    if (smallProduct) {
        const productData = {
            name: smallProduct.dataset.name || smallProduct.querySelector("p")?.innerText.trim() || "Product Item",
            price: smallProduct.dataset.price || smallProduct.querySelector("strong")?.innerText.replace("$", "").trim() || "0",
            image: smallProduct.dataset.image || smallProduct.querySelector("img")?.getAttribute("src") || "",
            description: smallProduct.dataset.description || "No description available.",
            brand: smallProduct.dataset.brand || "Generic"
        };
        openProductModal(productData);
        return;
    }

    // 2. CLICKED ON A PRODUCT CARD (Best Deals Grid)
    const card = e.target.closest(".product-card");
    if (card) {
        const productData = {
            name: card.dataset.name || card.querySelector("h3")?.innerText.trim() || "Product Item",
            price: card.dataset.price || card.querySelector(".price, .current-price")?.innerText.replace("$", "").trim() || "0",
            image: card.dataset.image || card.querySelector("img")?.getAttribute("src") || "images/product-1.png",
            description: card.dataset.description || "No description available.",
            brand: card.dataset.brand || "Clicon"
        };

        // If clicking directly on "ADD TO CART" inside grid
        if (e.target.closest(".add-cart-btn")) {
            e.stopPropagation();
            addToCart(productData, 1);
            alert(`${productData.name} added to cart!`);
            return;
        }

        // Open Modal for rest of card click / quick view button
        openProductModal(productData);
        return;
    }

    // 3. CLOSE MODAL IF CLICKED OUTSIDE CONTENT
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});


// ===============================
// MODAL BUTTON CONTROLS
// ===============================

if (modalClose) {
    modalClose.addEventListener("click", () => {
        if (modal) modal.classList.remove("active");
    });
}

if (modalPlus) {
    modalPlus.addEventListener("click", () => {
        selectedQuantity++;
        if (modalQuantity) modalQuantity.textContent = String(selectedQuantity).padStart(2, '0');
    });
}

if (modalMinus) {
    modalMinus.addEventListener("click", () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            if (modalQuantity) modalQuantity.textContent = String(selectedQuantity).padStart(2, '0');
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


// ===============================
// CAROUSEL LOGIC
// ===============================

const categories = document.querySelector("#categories-track");
const nextButton = document.querySelector("#category-next");
const prevButton = document.querySelector("#category-prev");

if (nextButton && prevButton && categories) {
    
    // Function to check scroll position and disable/gray out arrows
    function updateArrowStates() {
        const scrollLeft = categories.scrollLeft;
        const maxScrollLeft = categories.scrollWidth - categories.clientWidth;

        // Disable Left Arrow if scrolled all the way left (or close to 0)
        if (scrollLeft <= 5) {
            prevButton.classList.add("disabled");
            prevButton.disabled = true;
        } else {
            prevButton.classList.remove("disabled");
            prevButton.disabled = false;
        }

        // Disable Right Arrow if scrolled all the way right
        if (scrollLeft >= maxScrollLeft - 5) {
            nextButton.classList.add("disabled");
            nextButton.disabled = true;
        } else {
            nextButton.classList.remove("disabled");
            nextButton.disabled = false;
        }
    }

    // Scroll handlers
    nextButton.addEventListener("click", () => {
        categories.scrollBy({ left: 300, behavior: "smooth" });
    });

    prevButton.addEventListener("click", () => {
        categories.scrollBy({ left: -300, behavior: "smooth" });
    });

    // Listen for manual horizontal scrolling or touch swipes
    categories.addEventListener("scroll", updateArrowStates);

    // Initial check on load
    updateArrowStates();
}
