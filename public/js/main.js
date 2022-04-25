let x = document.querySelectorAll(".num");

const removeElement = document.querySelectorAll(".remove");

x.forEach((element) => {
  element.addEventListener("change", () => {
    let price = Number(
      element.parentNode.parentNode.parentNode.children[2].getAttribute(
        "data-val"
      )
    );
    element.parentNode.parentNode.parentNode.children[2].textContent =
      "$" + (price * Number(element.value)).toFixed(2);
    calc();
  });
});

function calc() {
  x = document.querySelectorAll(".num");

  let sum = Number(0);

  x.forEach((element) => {
    let price = Number(
      element.parentNode.parentNode.parentNode.children[2].getAttribute(
        "data-val"
      )
    );

    //new
    element.parentNode.parentNode.parentNode.children[2].textContent =
      "$" + (price * Number(element.value)).toFixed(2);
    //new
    sum += Number((price * Number(element.value)).toFixed(2));
  });

  let tax = Number((sum * 0.15).toFixed(2));

  document.getElementById("subtotal").textContent = "$" + sum;
  document.getElementById("taxes").textContent = "$" + tax;
  document.getElementById("total").textContent = "$" + (sum + tax).toFixed(2);
}

calc();

removeElement.forEach((elem) => {
  elem.addEventListener("click", () => {
    elem.parentNode.parentNode.parentNode.parentNode.remove();
    //classList.add('hide')
    calc();
  });
});
