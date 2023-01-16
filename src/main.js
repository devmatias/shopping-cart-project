// Imports
import { searchCep } from './helpers/cepFunctions';
import { fetchProduct, fetchProductsList } from './helpers/fetchFunctions';
import { createCartProductElement, createProductElement } from './helpers/shopFunctions';
import './style.css';

document.querySelector('.cep-button').addEventListener('click', searchCep);
const productsSection = document.querySelector('.products');
const cartSection = document.querySelector('.cart__products')
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

document.body.addEventListener('click', async (event) => {
  if (event.target.classList.contains('product__add')) {
    const getIdProduct = event.target.parentNode.querySelector('.product__id').innerHTML;
    const productData = await fetchProduct(getIdProduct);
    cartSection.appendChild(createCartProductElement(productData));
  }
});
