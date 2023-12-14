document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      displayData(data);
    });
});

function displayData(data) {
  const dataList = document.getElementById("data-list");
  data.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.field1}: ${item.field2}`; // Sesuaikan dengan nama kolom di tabel
    dataList.appendChild(listItem);
  });
}
