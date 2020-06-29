//lib
const replaceAll = (from, to, text) => text.split(from).join(to);
String.prototype.replaceAll = function(from, to){ return this.split(from).join(to);};

const arrayContains = (value, array) => array.indexOf(value) > -1;
Array.prototype.contains = function(value){ return this.indexOf(value) > -1; };

//variáveis e constantes
let cartItems = [];
const button = document.querySelectorAll('.action-buttons');
const productList = document.querySelector('#lista-produtos');
const cartList = document.querySelector('#lista-carrinho');
const totalPrice = document.querySelector('#total');
const templateElement = document.querySelector('#carrinho-item');
const template = templateElement.innerHTML;

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
    render();
};


//Adicionar item no carrinho
const addItemToCart = (evt) => {
  if(evt.target.nodeName === 'BUTTON') //falta trabalhar essa lógica ainda
  {
  const product = evt.value;
    if (product) {
      const newItems = [...cartItems, itemName];
      setItems(newItems);
    }}
};

//Remover item do carrinho
const removeItem = (evt) => {  
  if(evt.target.nodeName === 'BUTTON')
  {
    //falta fazer
    setItems(newCart);
  }
};

//Mudar quantidade do item no carrinho
//falta fazer

//template
const templateToHTML = (template, item) => {
  return template
    .replaceAll('{{NOME}}', item.name)
    .replaceAll('{{PRECO}}', item.price)
    .replaceAll('{{ID}}', item.id)
    .replaceAll('{{IMAGEM}}', item.image)
    .replaceAll('{{QUANTIDADE}}', item.quantity);
};

//render
const render = () => {
  const cartHTML = cartItems.map((item) => templateToHTML(template, item));
  cartList.innerHTML = cartHTML.join('\n');
  //falta inserir preco total
};

//init
const init = () => {
    cartItems = storageHandler.getItems();
    button.addEventListener('click', addItemToCart);
    cartList.addEventListener('click', removeItem);
    render();
};
init();
