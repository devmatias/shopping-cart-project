// Imports
import { getSavedCartIDs, saveCartID } from './helpers/cartFunctions';
import { searchCep } from './helpers/cepFunctions';
import { fetchProduct, fetchProductsList } from './helpers/fetchFunctions';
import { createCartProductElement, createProductElement } from './helpers/shopFunctions';
import './style.css';

document.querySelector('.cep-button').addEventListener('click', searchCep);
const productsSection = document.querySelector('.products');
const cartSection = document.querySelector('.cart__products');
const getFetchErrorElements = document.getElementsByClassName('error');
const getLoadingElements = document.getElementsByClassName('loading');

function createErrorMessage() {
  const fetchErrorEl = document.createElement('h2');
  fetchErrorEl.innerHTML = 'Algum erro ocorreu, recarregue a página e tente novamente';
  fetchErrorEl.classList.add('error');
  productsSection.appendChild(fetchErrorEl);
}

function removeItemFromDOM(item) {
  if (item.length > 0) {
    item[0].parentNode.removeChild(item[0]);
  }
}

function createLoading() {
  const loadingElement = document.createElement('h2');
  loadingElement.innerHTML = 'carregando...';
  loadingElement.classList.add('loading');
  productsSection.appendChild(loadingElement);
}

async function renderProducts() {
  try {
    removeItemFromDOM(getFetchErrorElements);
    createLoading();
    const products = await fetchProductsList('computador');
    removeItemFromDOM(getLoadingElements);
    return products.forEach((product) => {
      productsSection.appendChild(createProductElement(product));
    });
  } catch (e) {
    removeItemFromDOM(getLoadingElements);
    console.error(e.message);
    createErrorMessage();
  }
}

renderProducts();

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

addProductsToCart();

function renderSavedCartItems() {
  const savedItems = getSavedCartIDs();
  savedItems.forEach((item) => cartSection.appendChild(createCartProductElement(item)));
}

renderSavedCartItems();

function changeTotalPrice() {
  const totalPriceElement = document.querySelector('.total-price');
  const items = getSavedCartIDs();
  const total = items.reduce((acc, cur) => acc + cur.price, 0);
  totalPriceElement.innerText = total;
}

changeTotalPrice();

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

eventsToChangePrice();
