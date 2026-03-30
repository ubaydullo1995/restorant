document.addEventListener("DOMContentLoaded", function () {
    // 1. O'ZGARUVCHILAR
    const btnSaboy = document.querySelector(".btn");
    const btnStol = document.querySelector(".button");
    const loginlar = document.querySelector(".loginlar");
    const menuKurish = document.querySelector(".menu-kurish");
    const mainContent = document.getElementById("mainContent");
    const backBtn = document.getElementById("backBtn");
    const cartBtn = document.getElementById("cartBtn");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let selectedTable = null;

    // 2. NAVIGATSIYA
    btnSaboy.onclick = () => {
        selectedTable = null;
        loginlar.style.display = "none";
        mainContent.style.display = "block";
        cartBtn.style.display = "flex";
        backBtn.style.display = "block";
    };

    btnStol.onclick = () => {
        loginlar.style.display = "none";
        menuKurish.style.display = "flex";
        backBtn.style.display = "block";
    };

    document.querySelector(".btn-menu").onclick = () => {
        menuKurish.style.display = "none";
        mainContent.style.display = "block";
        cartBtn.style.display = "flex";
    };

    backBtn.onclick = () => {
        location.reload();
    };

    // 3. SAVAT MANTIQI
    window.addToCart = function (name, price, img) {
        let found = cart.find(item => item.name === name);
        if (found) {
            found.qty++;
        } else {
            cart.push({ name, price, img, qty: 1 });
        }
        updateCart();
    };

    window.updateCart = function () {
        const cartItems = document.getElementById("cartItems");
        const cartCount = document.getElementById("cartCount");
        const totalPrice = document.getElementById("totalPrice");

        cartItems.innerHTML = "";
        let total = 0;
        let count = 0;

        cart.forEach((item, i) => {
            total += item.price * item.qty;
            count += item.qty;

            // Savat ichidagi elementlar dizayni (Tugmalar ko'k rangga moslandi)
            cartItems.innerHTML += `
                <div class="cart-item" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="${item.img}" style="width: 55px; height: 55px; border-radius: 8px; object-fit: cover;">
                    <div style="flex: 1;">
                        <p style="font-size: 14px; font-weight: 600; margin: 0; color: #2d3436;">${item.name}</p>
                        <p style="font-size: 13px; margin: 0; color: #0984e3;">${item.price.toLocaleString()} so'm</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button onclick="changeQty(${i}, -1)" style="width: 28px; height: 28px; border: 1px solid #0984e3; background: white; color: #0984e3; border-radius: 4px; cursor: pointer;">-</button>
                        <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.qty}</span>
                        <button onclick="changeQty(${i}, 1)" style="width: 28px; height: 28px; border: none; background: #0984e3; color: white; border-radius: 4px; cursor: pointer;">+</button>
                        <button onclick="deleteItem(${i})" style="color: #e17055; border: none; background: none; cursor: pointer; font-size: 18px; margin-left: 5px;">🗑️</button>
                    </div>
                </div>`;
        });

        cartCount.innerText = count;
        totalPrice.innerText = total.toLocaleString();
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    window.changeQty = (index, val) => {
        if (cart[index].qty + val > 0) cart[index].qty += val;
        else cart.splice(index, 1);
        updateCart();
    };

    window.deleteItem = (index) => {
        if (confirm("O'chirilsinmi?")) {
            cart.splice(index, 1);
            updateCart();
        }
    };

    // 4. MODALLARNI BOSHQARISH
    cartBtn.onclick = () => document.getElementById("cartModal").classList.add("show");
    document.getElementById("closeCart").onclick = () => document.getElementById("cartModal").classList.remove("show");
    document.getElementById("closeTableModal").onclick = () => document.getElementById("tableModal").style.display = "none";
    document.querySelector(".btn-joy").onclick = () => document.getElementById("tableModal").style.display = "flex";

    window.selectTable = (num) => {
        selectedTable = num;
        alert(num + "-stol tanlandi");
        document.getElementById("tableModal").style.display = "none";
        document.querySelector(".btn-menu").click();
    };

    // 5. BUYURTMA BERISH
    document.getElementById("saveBtn").onclick = () => {
        if (cart.length === 0) return alert("Savat bo'sh!");

        if (selectedTable) {
            let confirmDineIn = confirm(`${selectedTable}-stol uchun buyurtma berilsinmi?`);
            if (confirmDineIn) {
                alert("Buyurtma qabul qilindi! Taomlar tez orada keltiriladi.");
                cart = [];
                updateCart();
                location.reload();
            }
        } else {
            document.getElementById("orderModal").style.display = "flex";
        }
    };

    document.getElementById("confirmOrder").onclick = () => {
        const phone = document.getElementById("userPhone").value;
        const name = document.getElementById("userName").value;

        if (name === "") return alert("Ismingizni kiriting!");
        if (phone.length < 13) return alert("Telefon raqami noto'g'ri!");

        alert("Buyurtma qabul qilindi! Tez orada operatorimiz bog'lanadi.");
        cart = [];
        updateCart();
        location.reload();
    };

    document.getElementById("cancelOrder").onclick = () => {
        document.getElementById("orderModal").style.display = "none";
    };

    // Qidiruv mantiqi
    document.getElementById("searchInput").oninput = function () {
        let val = this.value.toLowerCase();
        let cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            let title = card.querySelector("p").innerText.toLowerCase();
            card.style.display = title.includes(val) ? "block" : "none";
        });
    };

    updateCart();
});