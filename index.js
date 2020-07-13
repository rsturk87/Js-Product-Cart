//lib
const replaceAll = (from, to, text) => text.split(from).join(to);
String.prototype.replaceAll = function(from, to){ return this.split(from).join(to);};

const arrayContains = (value, array) => array.indexOf(value) > -1;
Array.prototype.contains = function(value){ return this.indexOf(value) > -1; };

//variáveis e constantes
let productItems = [];
const productList = document.querySelector('#lista-produtos');
const productTemplateElement = document.querySelector('#produtos-item');
const productTemplate = productTemplateElement.innerHTML;
const productDetails = document.getElementsByClassName('produtos-detalhes');
let cartItems = [];
const cartTemplateElement = document.querySelector('#carrinho-item');
const cartTemplate = cartTemplateElement.innerHTML;
const cartList = document.querySelector('#lista-carrinho');
const totalPrice = document.querySelector('#total');

//localStorage
const storageHandler = {
    key: 'cartItems',
    storage: localStorage,
    setItems: function (arr) {
      if (arr instanceof Array) this.storage.setItem(this.key, JSON.stringify(arr));
      else throw 'O valor passado para storageHandler.setItems() deve ser Array';
    },
    getItems: function () {
      return JSON.parse(this.storage.getItem(this.key) || '[]');
    }
};

const setItems = (arr) => {
    storageHandler.setItems(arr);
    cartItems = storageHandler.getItems();
    renderCart();
};

//Adicionar item no carrinho
const addItemToCart = (evt) => {
  if(evt.target.nodeName == 'BUTTON' && evt.target.attributes['data-name'])
  {
    const id = evt.target.attributes['data-id'].nodeValue;
    const itemDontExistInCart = cartItems.find( item => item.id === id );

    if(!itemDontExistInCart) {
      const data = [...evt.target.attributes];
      const product = data.reduce((obj, node) => {
      const attr = node.nodeName.replace('data-', '');
      const value = node.nodeValue;
        obj[attr] = value;
        return obj;
      }, {});
      const newCart = [...cartItems, product];
      setItems(newCart)
    }
    else {
      const index = cartItems.findIndex(item => item.id === id);
      cartItems[index].quantity = parseInt(cartItems[index].quantity) + 1;
      setItems(cartItems);
    }
  }
};

//Remover item do carrinho
const removeItem = (evt) => {  
  if(evt.target.nodeName === 'BUTTON')
  {
    const id = evt.target.attributes['data-id'].nodeValue;
    const newCart = cartItems.filter((c) => c.id !== id);
    setItems(newCart);
  }
};

//Mudar quantidade do item no carrinho
const changeQuantity = (evt) => {
  if(evt.target.nodeName === 'INPUT')
  {
    const id = evt.target.attributes['data-id'].nodeValue;
    const index = cartItems.findIndex(item => item.id === id);
    cartItems[index].quantity = parseInt(evt.target.value);
    setItems(cartItems);
  }
};

//Mostrar detalhes do produto
let toggle = false;
const toggleDetails = (evt) => {
  const id = evt.target.attributes['data-id'].nodeValue;
  if(evt.target.nodeName == 'BUTTON' && evt.target.attributes['data-details'] && toggle == false){
    productDetails[id].style.display = 'none';
    toggle = true;
  }
  else if(evt.target.attributes['data-details']){
    productDetails[id].style.display = 'inline';
    toggle = false;
  }
};

//template
const templateToHTML = (template, item) => {
  return template
    .replaceAll('{{NOME}}', item.name)
    .replaceAll('{{PRECO}}', item.price)
    .replaceAll('{{ID}}', item.id)
    .replaceAll('{{IMAGEM}}', item.image)
    .replaceAll('{{QUANTIDADE}}', item.quantity)
    .replaceAll('{{TELA}}', item.display)
    .replaceAll('{{RAM}}', item.ram)
    .replaceAll('{{PROCESSADOR}}', item.processor);
};

//get products from json
const getProductList = async(location) => {
  const response = await fetch(location);
  const json = await response.json();
  return json;
};

//render Products
const renderProducts = () => {
  const productsHTML = productItems.map((item) => templateToHTML(productTemplate, item));
  productList.innerHTML = productsHTML.join('\n');
};

//render Cart
const renderCart = () => {
  const cartHTML = cartItems.map((item) => templateToHTML(cartTemplate, item));
  cartList.innerHTML = cartHTML.join('\n');
  const total = cartItems.reduce((acc, item) => acc += parseInt(item.price) * parseFloat(item.quantity), 0);
  totalPrice.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

//init
const init = async () => {
    cartItems = storageHandler.getItems();

    productList.addEventListener('click', addItemToCart);
    productList.addEventListener('click', toggleDetails);
    cartList.addEventListener('click', removeItem);
    cartList.addEventListener('change', changeQuantity);

    const products = await getProductList('./data/data.json');
    productItems = products;
    renderProducts();
    renderCart();
};
init();