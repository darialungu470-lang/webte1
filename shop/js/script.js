const PRODUCTS = [
  { id: 1, name: "Zvonček na bicykel", price: 8.5, tags: ["bike"] },
  { id: 2, name: "Fľaša na vodu", price: 12, tags: ["sport"] },
  { id: 3, name: "Svetlá na bicykel", price: 24.9, tags: ["bike", "safety"] },
  { id: 4, name: '<img src="x" onerror="alert(\'Hacked\')">', price: 1, tags: [] }
];

const list = document.getElementById("products");
console.log(list);

function createProductItem(product) {
  const item = document.createElement("li");

  const name = document.createElement("span");
  name.textContent = product.name;

  const price = document.createElement("span");
  price.textContent = `${product.price.toFixed(2)} €`;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Do košíka";

  button.addEventListener("click", () => addToCart(product));
  item.append(name, price, button);
  return item;
}

function renderProducts(products) {
    while (list.firstChild) {
     list.removeChild(list.firstChild);
    }
    const fragment = document.createDocumentFragment();
    for (const product of products) {
        fragment.appendChild(createProductItem(product));
    }
    console.log("before:", fragment.childNodes.length);
    list.appendChild(fragment);
    console.log("after:", fragment.childNodes.length);
}

renderProducts(PRODUCTS);


const cart = [];

function addToCart(product) {
  cart.push(product);
  renderCart();
}

function renderCart() {
  const items = discountActive ? applyDiscount(cart) : cart;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("cart-count").textContent = cart.length;
  document.getElementById("cart-total").textContent = total.toFixed(2);
}


const buttons = list.querySelectorAll("button");

const discountButton = document.getElementById("discount");

function applyDiscount(items) {
  const copy = [...items];
  for (const item of copy) {
    item.price = item.price * 0.9;
  }
  return copy;
}

discountButton.addEventListener("click", () => {
  discountActive = !discountActive;
  discountButton.textContent = discountActive ? "Zrušiť zľavu" : "Zľava 10 %";
  renderCart();
});

let discountActive = false;

function applyDiscount(items) {
  return items.map((item) => ({ ...item, price: item.price * 0.9 }));
}


const statusText = document.getElementById("status");
const reloadButton = document.getElementById("reload");

function loadProducts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error("Server neodpovedá"));
      } else {
        resolve(structuredClone(PRODUCTS));
      }
    }, 1500);
  });
}

reloadButton.addEventListener("click", () => {
  statusText.textContent = "Načítavam…";
  const products = loadProducts();
  renderProducts(products);
  statusText.textContent = `Načítaných produktov: ${products.length}`;
});


async function showProducts() {
    console.log("4")
    statusText.textContent = "Načítavam…";
    reloadButton.disabled = true;

    try {
        const products = await loadProducts();
        console.log("5")
        renderProducts(products);
        statusText.textContent = `Načítaných produktov: ${products.length}`;
    } catch (error) {
        statusText.textContent = `Chyba: ${error.message}. Skúste to znova.`;
    } finally {
        reloadButton.disabled = false;
    }
}

reloadButton.addEventListener("click", () => {
  console.log("1");
  setTimeout(() => console.log("2"), 0);
  Promise.resolve().then(() => console.log("3"));
  showProducts();
  console.log("6");
});

