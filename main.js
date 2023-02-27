// ? API для запросов
const API = "http://localhost:8000/products";
//? list это блок куда мы добавляем карточки
const list = document.querySelector("#products-list");
//?форма с inputами для ввода данных
const addForm = document.querySelector("#add-form");
const titleInp = document.querySelector("#title");
const priceInp = document.querySelector("#price");
const descriptionInp = document.querySelector("#description");
const imageInp = document.querySelector("#image");
//? вытаскивам инпуты и кнопка из модалки
const editTitleInp = document.querySelector("#edit-title");
const editPriceInp = document.querySelector("#edit-price");
const editDescriptionInp = document.querySelector("#edit-descr");
const editImageInp = document.querySelector("#edit-image");
const editSaveBtn = document.querySelector("#btn-save-edit");

// ?первоначальное отображенеие данных
getProducts();

//?получаем(стягиваем) данные с сервера
async function getProducts() {
  const res = await fetch(API);
  const data = await res.json(); // ? расшифровка данных
  //? отображаем актуальные данные
  render(data);
}

//? функция для добавления в db.json
async function addProduct(product) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //? стягиваем и отображаем актуальные данные
  getProducts();
}

//?  функция для удаления из db.json
async function deleteProduct(id) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  //?  стягиваем и отображаем актуальные данные
  getProducts();
}
//? функция для получения одного продукта
async function getOneProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json(); // ? расшифровка данных
  //?  возвращаем продукт с db.json
  return data;
}
//? функция что бы изменить данные
async function editProduct(id, editedProduct) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //?  стягиваем и отображаем актуальные данные
  getProducts();
}
//? render функция для отображения на странице
function render(arr) {
  //? очищаем что бы карточки не дублировались
  list.innerHTML = "";
  arr.forEach((item) => {
    list.innerHTML += `
    <div class="card m-5" style="width: 18rem">
    <img
      src="${item.image}"
      class="card-img-top"
      alt="..."
    />
    <div class="card-body">
      <h5 class="card-title">${item.title}</h5>
      <p class="card-text">${item.description.slice(0, 70)}...
      </p>
      <p class="card-text">${item.price}
      </p>
      <button data-bs-toggle="modal" 
      data-bs-target="#exampleModal" 
      id="${item.id}" class="btn btn-dark btn-edit">EDIT</button>
      <button id="${item.id}"  class="btn btn-danger btn-delete">DELETE</button>
    </div>
  </div>`;
  });
}

//? обработчик события для добавления(create)
addForm.addEventListener("submit", (e) => {
  //?что бы стр не перезагружалась
  e.preventDefault();
  //? проверка на заполненность полей
  if (
    !titleInp.value.trim() ||
    !priceInp.value.trim() ||
    !descriptionInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }
  //?создаем объект для добавления db.json
  const product = {
    title: titleInp.value,
    price: priceInp.value,
    description: descriptionInp.value,
    image: imageInp.value,
  };
  //?оправдяем объект в db.json
  addProduct(product);
  //? очищаем инпуты
  titleInp.value = "";
  priceInp.value = "";
  descriptionInp.value = "";
  imageInp.value = "";
});
console.log("hello");

//?событие клик при удалении карточки
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    deleteProduct(e.target.id);
  }
});
//? переменная что бы сохранить id продукта на который мы нажали
let id = null;
//?обработчик события на открытие и заполнение модалки
document.addEventListener("click", async (e) => {
  //? в условии пишем содержит ли такой класс
  if (e.target.classList.contains("btn-edit")) {
    //?сохраняем id продукта
    id = e.target.id;
    //?получаем объект продукта на который мы нажали
    const product = await getOneProduct(e.target.id);
    //? заполняем инпуты данными продукта getOneProduct асинхронная функция
    //?поставили  await потому что
    editTitleInp.value = product.title;
    editPriceInp.value = product.price;
    editDescriptionInp.value = product.description;
    editImageInp.value = product.image;
  }
});
//? обработчик события на сохранение данных
editSaveBtn.addEventListener("click", () => {
  //? проверка на пустоту инпутов
  if (
    !editTitleInp.value.trim() ||
    !editPriceInp.value.trim() ||
    !editDescriptionInp.value.trim() ||
    !editImageInp.value.trim()
  ) {
    alert("заполните все поля ");
    //? если хотя бы один инпут пустой , выводим предупреждение  и останавливаем функцию
    return;
  }
  //?собираем измененный объект для изменения продукта
  const editedProduct = {
    title: editTitleInp.value,
    price: editPriceInp.value,
    description: editDescriptionInp.value,
    image: editImageInp.value,
  };
  //?вызываем функцию для изменения
  editProduct(id, editedProduct);
});
