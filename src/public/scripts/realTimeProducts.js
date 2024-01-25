const socket = io();
const form = document.getElementById("newProductForm");
const productsBody = document.getElementById("productsBody");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target);
  const prod = Object.fromEntries(datForm);
  socket.emit("newProduct", prod);
  e.target.reset();
});

const createTableRow = (prod) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${prod.id}</td>
    <td>${prod.title}</td>
    <td>${prod.description}</td>
    <td class="m-auto">
    <image class="w-25" src="${prod.thumbnail}"></image>
    </td>
    <td>${prod.price}</td>
    <td>${prod.code}</td>
    <td>${prod.stock}</td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="removeProduct(${prod.id})">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
    </td>
  `;
  row.id = `productRow${prod.id}`;
  return row;
};

const renderProducts = (products) => {
  productsBody.innerHTML = "";
  if (products) {
    products.forEach((prod) => {
      const row = createTableRow(prod);
      productsBody.appendChild(row);
    });
  } else {
    console.error("Error al cargar los productos");
  }
};

const removeProduct = (prodId) => {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    socket.emit("removeProduct", prodId);
  }
};

socket.on("prodsData", renderProducts);

socket.on("productRemoved", (removedProductId) => {
  const tableRowToRemove = document.getElementById(
    `productRow${removedProductId}`
  );
  if (tableRowToRemove) {
    tableRowToRemove.remove();
  } else {
    console.error("No se encontró la fila del producto a eliminar");
  }
});

socket.emit("getProducts");