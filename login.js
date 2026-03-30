// 1. O'ZGARUVCHILAR
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedTable = null;
let isDineIn = false; // MANA SHU YANGI: Iste'mol rejimida ekanligini bildiradi

const loginlar = document.querySelector(".loginlar");
const menuKurish = document.querySelector(".menu-kurish");
const mainContent = document.getElementById("mainContent");
const cartBtn = document.getElementById("cartBtn");

// 2. NAVIGATSIYA
document.querySelector(".btn").onclick = () => { // Dastavka
    isDineIn = false; // Dastavka rejimi
    selectedTable = null;
    loginlar.style.display = "none";
    mainContent.style.display = "block";
    cartBtn.style.display = "flex";
};

document.querySelector(".button").onclick = () => { // Iste'mol
    isDineIn = true; // Iste'mol rejimi yoqildi!
    loginlar.style.display = "none";
    menuKurish.style.display = "flex";
};

document.querySelector(".btn-menu").onclick = () => {
    menuKurish.style.display = "none";
    mainContent.style.display = "block";
    cartBtn.style.display = "flex";
};

document.querySelector(".btn-joy").onclick = () => {
    document.getElementById("tableModal").style.display = "flex";
};

// 3. STOL TANLASH
window.selectTable = (num) => {
    selectedTable = num;
    alert(num + "-stol tanlandi");
    document.getElementById("tableModal").style.display = "none";
    // Stol tanlagandan keyin menuga o'tkazamiz
    menuKurish.style.display = "none";
    mainContent.style.display = "block";
    cartBtn.style.display = "flex";
};

// 4. BUYURTMA BERISH (Tuzatilgan qismi)
document.getElementById("saveBtn").onclick = () => {
    if (cart.length === 0) return alert("Savat bo'sh!");

    // Agar foydalanuvchi "Iste'mol" tugmasi orqali kirgan bo'lsa
    if (isDineIn) {
        // Stol tanlanganmi?
        if (selectedTable === null) {
            alert("Iltimos, avval stol raqamini tanlang!");
            document.getElementById("tableModal").style.display = "flex";
            return;
        }

        // Stol tanlangan bo'lsa - TASDIQLASH (Ism so'ramaydi!)
        if (confirm(selectedTable + "-stol uchun buyurtma berilsinmi?")) {
            alert("Buyurtmangiz qabul qilindi!");
            clearOrder();
        }
    }
    // Agar "Dastavka" orqali kirgan bo'lsa
    else {
        document.getElementById("orderModal").style.display = "flex";
    }
};

// 5. SAVAT VA BOSHQA FUNKSIYALAR
window.addToCart = (name, price, img) => {
    let item = cart.find(i => i.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, img, qty: 1 });
    updateCart();
};

window.updateCart = () => {
    const list = document.getElementById("cartItems");
    let total = 0;
    list.innerHTML = "";
    cart.forEach((item, i) => {
        total += item.price * item.qty;
        list.innerHTML += `
            <div style="display:flex; align-items:center; margin-bottom:10px;">
                <img src="${item.img}" style="width:40px; height:40px; margin-right:10px;">
                <div style="flex:1"><b>${item.name}</b><br>${item.price.toLocaleString()}</div>
                <button onclick="changeQty(${i},-1)">-</button>
                <span style="margin:0 5px">${item.qty}</span>
                <button onclick="changeQty(${i},1)">+</button>
                <button onclick="removeItem(${i})" style="color:red; border:none; background:none; margin-left:10px;">🗑️</button>
            </div>`;
    });
    document.getElementById("cartCount").innerText = cart.length;
    document.getElementById("totalPrice").innerText = total.toLocaleString();
    localStorage.setItem("cart", JSON.stringify(cart));
};

window.changeQty = (i, v) => {
    if (cart[i].qty + v > 0) cart[i].qty += v;
    else cart.splice(i, 1);
    updateCart();
};

window.removeItem = (i) => {
    cart.splice(i, 1);
    updateCart();
};

document.getElementById("confirmOrder").onclick = () => {
    const name = document.getElementById("userName").value;
    if (!name) return alert("Ismingizni kiriting!");
    alert("Rahmat " + name + "! Buyurtma olindi.");
    clearOrder();
};

function clearOrder() {
    cart = [];
    localStorage.removeItem("cart");
    location.reload();
}

// Modallarni yopish
document.getElementById("closeCart").onclick = () => document.getElementById("cartModal").classList.remove("show");
document.getElementById("cartBtn").onclick = () => document.getElementById("cartModal").classList.add("show");
document.getElementById("closeTableModal").onclick = () => document.getElementById("tableModal").style.display = "none";
document.getElementById("cancelOrder").onclick = () => document.getElementById("orderModal").style.display = "none";

updateCart();