/** Stretching the canvas vertically **/
const carCanvas = document.getElementById("carCanvas");
// canvas.height = window.innerHeight; // leaving this here will leave a trail of the car on the screen
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

/* Getting the drawing context to be able to draw on the canvas */
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9); // centered to /2 the width of the canvas
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI"); // creating the car (x, y, width, height) in px
const N = 10;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain")); // parsing the json string i saved previously

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColors()),
];

/** Animating the car **/
animate();

/** Saving the best car brain that passes the car and  goes into a straight line */
function save() {
  // essentially serializing that brain into local storage
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// removing the local storage
function discard() {
  localStorage.removeItem("bestBrain");
}

//** Adding more traffic */
function addTraffic() {
  traffic.push(
    new Car(road.getLaneCenter((Math.random() * road.laneCount) | 0), bestCar.y - 900, 30, 50, "DUMMY",2, getRandomColors())
  );
}

/** adding more cars */
function generateCars(N) {
  const cars = [];
  for (let i = 0; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI")); // pushing a new car into thelanes
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic); // detecting where the side borders are
  }

  // focusing on the best car (one that goes upwards the most / minimum y)
  // find the car
  bestCar = cars.find(
    // of all the  y vals of the cars ; creatiung a new arr of only the y vals of the cars
    (c) => c.y == Math.min( ...cars.map((c) => c.y))
  );

  carCanvas.height = window.innerHeight; // moving it here make the car move and doesnt leave a trail
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7); // this is for translating tha canvas on one car from the 100

  road.draw(carCtx); // road comes first and then the car on top of it

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "orange");
  }

  carCtx.globalAlpha = 0.2; // making the cars transparent

  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue"); // Darwing the car using the context
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, bestCar.brain); // thijs will show the 'brain' of the car // printing the brain of this one car somewhere on the right
  requestAnimationFrame(animate);
}
