let listaProductos = [];
let productShown = 0; 
let productPerPage = 3; 

// Consumo de API con axios y async/await del profesor
async function apiProduts() {
   try {
         const res = await axios.get('./productos.json');
         listaProductos = res.data.products;
         crearProductos();  
   }
   catch (err) {
      console.log(err);
   }
}

// Persistencia y contadores del docente
let shoppingCart = JSON.parse(localStorage.getItem('productarticle')) || [];
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
let count = parseInt(localStorage.getItem('totalCount')) || 0;

// Función del profesor para armar la tabla en carrito.html
const handleCart = () => {
   const shoppingCart = JSON.parse(localStorage.getItem('productarticle')) || [];
   const carritoProduct = document.getElementById('itemProducts');

   if (!carritoProduct) return;

   if (shoppingCart.length === 0) {
      carritoProduct.innerHTML = '<p style="text-align:center; padding:1.5rem;">El carrito está vacío</p>';
      return;
   }

   const emptyMessage = document.querySelector('.carrito-empty');
   if (emptyMessage) { emptyMessage.remove(); }

   const tabla = document.createElement('table');
   tabla.classList.add('name-class-tabla');

   let encabezado = `
      <thead>
         <tr>
            <th>Nombre del Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
         </tr>
      </thead>
   `;

   let cuerpo = '<tbody>';
   shoppingCart.forEach( producto => {
      cuerpo += `
         <tr>
            <td>${producto.title}</td>
            <td>$${producto.price}</td>
            <td>${producto.count}</td>
         </tr>
      `;
   });
   cuerpo += '</tbody>';

   tabla.innerHTML = encabezado + cuerpo;
   carritoProduct.appendChild(tabla);
};

// Limpieza de datos en simulación de checkout
function finalizarCompra() {
   const isLogin = localStorage.getItem('isLogin') || null;
   if (isLogin === null) {
      alert('Por favor, inicie sesión para finalizar la compra.');
      return;
   }
   if (confirm('Revise su pedido antes de finalizar la operación')) {
      shoppingCart = [];
      totalPrice = 0;
      count = 0;
      localStorage.clear();
      location.reload();
   }
}

// Inyección dinámica mapeada con tus componentes de diseño Flexbox
function crearProductos () {
   const nextProducts = listaProductos.slice(productShown, productPerPage + productShown);
   const cardProductos = document.getElementById('productCard');

   if(!cardProductos) return;

   nextProducts.forEach( productos => {
      const card = document.createElement('article');
      card.className = 'product-card';

      card.innerHTML = `
               <div class="product-image-container">
                  <img src="${productos.images[0]}" alt="imagen de ${productos.title}">
               </div>
               <div class="product-content">
                  <h3 class="product-title">${productos.title}</h3>
                  <p class="product-description">${productos.description}</p>
                  <p class="product-price">
                     <span class="price">$${productos.price}</span>
                  </p>
                  <button type="button" class="product-button btn-buy" style="width:100%; border:none; cursor:pointer;">
                     Añadir al Carrito
                  </button>
               </div>
      `;
      cardProductos.appendChild(card);
   });
  
   const articles = document.querySelectorAll('.product-card');
   articles.forEach( article => {
      const button = article.querySelector('.product-button');
      const titleProduct = article.querySelector('.product-title').textContent.trim();
      const priceProduct = article.querySelector('.product-price .price').textContent.trim().slice(1);
  
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener('click', () => {
         const product = {
            title: titleProduct,
            price: priceProduct,
            count: 1,
         };
  
         shoppingCart.push(product);
         totalPrice += parseFloat(product.price);
         count += 1;
  
         localStorage.setItem('productarticle', JSON.stringify(shoppingCart));
         localStorage.setItem('totalPrice', totalPrice.toFixed(2));
         localStorage.setItem('totalCount', count);
  
         const numerito = document.querySelector('.count');
         if(numerito) numerito.textContent = count;
         alert("Producto añadido: " + titleProduct);
      });
   });

   const btnMas = document.getElementById('mostrarProducts');
   productShown += 3;
   
   if (productShown >= listaProductos.length && btnMas) {
      btnMas.style.display = 'none';
   }
}

// Escuchas del DOMContentLoaded del profesor
document.addEventListener('DOMContentLoaded', () => {
   if (document.getElementById('productCard')) {
      apiProduts();
      const btnMas = document.getElementById('mostrarProducts');
      if(btnMas) btnMas.addEventListener('click', crearProductos );
      
      const numerito = document.querySelector('.count');
      if (count > 0 && numerito) {
         numerito.textContent = count;
      }
   }

   if (document.getElementById('itemProducts')) {
      handleCart();
      const btnFinalizar = document.getElementById('finalizarCompraBtn');
      if(btnFinalizar) btnFinalizar.addEventListener('click', finalizarCompra);
   }
});