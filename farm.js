// Initialize the game variables
const farm = document.getElementById("farm");
const tiles = [];
const crops = [];
const cropsData = [
  { name: "Carrot", growthTime: 5 },
  { name: "Corn", growthTime: 10 },
  { name: "Tomato", growthTime: 15 },
];

// Create the farm tiles
for (let i = 0; i < 100; i++) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.dataset.index = i;
  tile.addEventListener("click", (event) => {
    const index = parseInt(event.target.dataset.index);
    const tile = tiles[index];
    if (!tile.watered) {
      tile.watered = true;
      event.target.classList.add("watered");
    } else if (!tile.planted) {
      const cropData = cropsData[Math.floor(Math.random() * cropsData.length)];
      const growthTime = cropData.growthTime;
      tile.planted = true;
      tile.crop = {
        name: cropData.name,
        growthTime: growthTime,
        timePlanted: Date.now(),
      };
      event.target.classList.add("planted");
      crops.push({ index: index, crop: tile.crop });
    }
  });
  tiles.push({ watered: false, planted: false });
  farm.appendChild(tile);
}

// Main game loop
setInterval(() => {
  crops.forEach((crop) => {
    const tile = tiles[crop.index];
    const timePlanted = crop.crop.timePlanted;
    const growthTime = crop.crop.growthTime;
    const timeElapsed = (Date.now() - timePlanted) / 1000;
    if (tile.planted && timeElapsed >= growthTime) {
      tile.planted = false;
      const cropName = crop.crop.name;
      const harvestMessage = `You harvested a ${cropName} from tile ${
        crop.index + 1
      }!`;
      alert(harvestMessage);
      crops.splice(crops.indexOf(crop), 1);
      const tileElement = farm.childNodes[crop.index];
      tileElement.classList.remove("planted");
    }
  });
}, 1000);
