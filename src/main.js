// Imports
import { getSavedCartIDs, saveCartID } from './helpers/cartFunctions';
import { searchCep } from './helpers/cepFunctions';
import { fetchProduct, fetchProductsList } from './helpers/fetchFunctions';
import { createCartProductElement, createProductElement } from './helpers/shopFunctions';
import './style.css';

document.querySelector('.cep-button').addEventListener('click', searchCep);
const productsSection = document.querySelector('.products');
const cartSection = document.querySelector('.cart__products');

function createErrorMessage() {
  const fetchErrorEl = document.createElement('h2');
  fetchErrorEl.innerHTML = 'Algum erro ocorreu, recarregue a página e tente novamente';
  fetchErrorEl.classList.add('error');
  productsSection.appendChild(fetchErrorEl);
}

function removeItemFromDOM(item) {
  if (item.length > 0) {
    item[0].remove();
  }
}

function createLoading() {
  const loadingElement = document.createElement('h2');
  loadingElement.innerHTML = 'carregando...';
  loadingElement.classList.add('loading');
  productsSection.appendChild(loadingElement);
}

async function renderProducts() {
  const loadingElement = document.getElementsByClassName('loading');
  const errorElement = document.getElementsByClassName('error');

  try {
    removeItemFromDOM(errorElement);
    createLoading();
    const products = await fetchProductsList('computador');
    removeItemFromDOM(loadingElement);
    return products.forEach((product) => {
      productsSection.appendChild(createProductElement(product));
    });
  } catch (e) {
    removeItemFromDOM(loadingElement);
    console.error(e.message);
    createErrorMessage();
  }
}

function addProductsToCart() {
  document.body.addEventListener('click', async (event) => {
    if (event.target.classList.contains('product__add')) {
      const getIdProduct = event.target.parentNode
        .querySelector('.product__id').innerHTML;
      const productData = await fetchProduct(getIdProduct);
      saveCartID(productData);
      const createElement = createCartProductElement(productData);
      cartSection.appendChild(createElement);
    }
  });
}

async function renderSavedCartItems() {
  const savedItems = getSavedCartIDs();
  const itemsId = savedItems.map(({ id }) => fetchProduct(id));
  const fetchItems = await Promise.all(itemsId);
  fetchItems.forEach((item) => cartSection.appendChild(createCartProductElement(item)));
}

async function changeTotalPrice() {
  const totalPriceElement = document.querySelector('.total-price');
  const items = getSavedCartIDs();
  const itemsId = items.map(({ id }) => fetchProduct(id));
  const fetchItems = await Promise.all(itemsId);
  const total = fetchItems.reduce((acc, cur) => acc + cur.price, 0);
  totalPriceElement.innerText = total;
}

function eventsToChangePrice() {
  const config = { childList: true };
  const callback = function (mutationsList) {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') changeTotalPrice();
    });
  };
  const observer = new MutationObserver(callback);
  observer.observe(cartSection, config);
  cartSection.addEventListener('load', changeTotalPrice);
}

window.onload = () => {
  renderProducts();
  addProductsToCart();
  renderSavedCartItems();
  changeTotalPrice();
  eventsToChangePrice();
};
