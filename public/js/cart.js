const addBtn = document.getElementById("addToCart");

addBtn.onclick = function () {
  //   localStorage.clear();

  const id = document.getElementById("plantIn").value;

  if (localStorage.getItem("cart") == null) {
    localStorage.setItem("cart", "[]");
  }

  let old_data = JSON.parse(localStorage.getItem("cart"));
  old_data.push(id);

  localStorage.setItem("cart", JSON.stringify(old_data));

  console.log("pressed");
  console.log(localStorage);
};
