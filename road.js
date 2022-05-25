class Road {
  // road centered around and x val and have a width, # of lanes
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    // makingf the roads go infinitely up and down
    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity; // y on a comp grows downwards

    /** Creating the side borders */
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  /** Creating a method to tell me what the center of a given lane */
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount; // helper var
    return (
      this.left +
      laneWidth / 2 +
      // ensures the car starts in the middle regardless of the # of lanes
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  /** Drawinf the road **/
  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    /** Creating the lanes */
    for (let i = 1; i <= this.laneCount - 1; i++) {
      /** What is the x coordinate of each of these vertical lines? Use linear interpolation **/
      const x = lerp(
        // need to get vals of left/right according to a %
        this.left,
        this.right,
        i / this.laneCount // this will be bw 0 and 1 when i = laneCount
      );

      //   adding dashes to the troad
      ctx.setLineDash([20, 20]); // 20 px and then a break of 20 px

      /* drawing vertical line on left/right side of screen */
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
