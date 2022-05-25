// defining car class and constructor
class Car {
  // Properties of the car / where i want it to be / how big it should be
  constructor(x, y, width, height, controlType, maxSpeed = 3, color = "blue") {
    /* storing the attributes of the car inside the car object so the car "rememberrs" where it is and how big it is */
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    /** Giving the car speed attributs **/
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0; // this ensures that the car doest go the max speed when going left/right
    this.damaged = false;

    this.useBrain = controlType == "AI";

    if (controlType != "DUMMY") {
      /** Sensors */
      this.sensor = new Sensor(this); // passing the car
      // specifying array of neuron counts (sizse of layers) ; has 4 neurons; forward, backward, left, right
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }

    /* creating the controls for the car temporarily */
    this.controls = new Controls(controlType);

    /** Refering to the car png */
    this.img = new Image();
    this.img.src = "car.png";

    // creating new canavas
    this.mask = document.createElement("canvas");
    this.mask.width = width;
    this.mask.height = height;

    const maskCtx = this.mask.getContext("2d");
    // waiting for the img to load
    this.img.onload = () => {
      maskCtx.fillStyle = color;
      maskCtx.fillRect(0, 0, this.width, this.height);
      maskCtx.fill();

      // when im going to draw the car img, will keep the blue coloe only where it overlaps w the visible px of the car
      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    };
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);

      // first taking out the offsets from the sensor readings
      const offsets = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      // console.log(outputs);

      if (this.useBrain) {
        this.controls.up = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.down = outputs[3];
      }
    }
  }

  /** Detecting is the car has beenn damaged (touched the borders) **/
  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        // if there is an intersectiopn bw the poly and the road border of i then:
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        // if there is an intersectiopn bw the poly and the road border of i then:
        return true;
      }
    }
    return false;
  }

  /** Finding the corners of the car*/
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height); // gives me the angle knwoing the width and height

    // Top right point
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad, // center x of the car - the angle
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });

    // top left point
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #move() {
    if (this.controls.up) {
      this.speed += this.acceleration; // speed will increase by the acc ;  this.y -= 2;
    }

    if (this.controls.down) {
      this.speed -= this.acceleration; // speed will decrease by the acc
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed; // capping it
    }

    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2; // dont want it going fast in reverse so /2
    }

    /** Adding friction **/
    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0; // ensures that the car doesnt move
    }

    /** implementing left and right controls
     * Adjusting the reverse rotations/translations **/
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }

      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    /** Making sure that the car moves in the direction of whatever angle it is in **/
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  //   getting the Draw methiod which accetps context as a param
  draw(ctx, drawSensor = false) {
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    if (!this.damaged) {
      ctx.drawImage(
        this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = "multiply";
    }

    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
