document.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
  const r = yourLibrary.yourLibFunction(2, 5);
  document.getElementById("result").innerText = `2 + 5 = ${r}`;
}
