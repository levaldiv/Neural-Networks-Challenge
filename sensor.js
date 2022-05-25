class Sensor {
  // takes the car as the arg bc i want the sensors to know where the car is (attached to the car)
  constructor(car) {
    this.car = car;
    this.rayCount = 5; // having only one ray wont work bc of line
    this.rayLength = 150;
    this.raySpread = Math.PI / 2; // 90 degrees ; the angle spread of the rays

    this.rays = []; // will keep each ray one by one after i create theme
    this.readings = []; // is there a border ? And how far away is it ?
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];

    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  /** Checkkiong to see where this arr touches the road borders  */
  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      // intersection will be bw ray 0 and 1
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );

      if (touch) {
        touches.push(touch);
      }
    }

    /** account for traffic and polygns */
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );

        if (value) {
          touches.push(value);
        }
      }
    }

    // no reading here
    if (touches.length == 0) {
      return null;
    } else {
      // goes through all the elmts from the arr and for each elmt it takes its offset
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);

      return touches.find((e) => e.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          // this will take into account if there is only 1 ray count
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)) 
          + this.car.angle; // makes the rays move with the car

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]); // push these to form a segmentx
    }
  }

  /** Drawing the sensors */
  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];

      if (this.readings[i]) {
        end = this.readings[i]; // sett the end to the val of that readgin
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      //   ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);

      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
