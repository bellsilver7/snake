// Initialize the game variables
const plant = document.getElementById("plant");
let height = 0;

// Event listener for the water button
const waterButton = document.getElementById("waterButton");
waterButton.addEventListener("click", (event) => {
  height += 10;
  plant.style.height = `${height}px`;
  if (height >= 200) {
    alert("Congratulations, your plant has fully grown!");
  }
});
