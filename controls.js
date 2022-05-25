class Controls {
  constructor(type) {
    // these are false but will change depending on the key pressed
    this.up = false;
    this.left = false;
    this.right = false;
    this.down = false;

    switch (type) {
      case "KEYS":
        // defining method for adding keyboard listeners that checks whenever a key is pressed
        this.#addKbListeners();
        break;
      case "DUMMY":
        this.up = true;
        break;
    }
  }

  //  creting private (hence the #) method ; cant access this from outside of the controls class
  #addKbListeners() {
    // on key down this is the fcn that is being called
    document.onkeydown = (event) => {
      //   depending on what key was pressed
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;

        case "ArrowRight":
          this.right = true;
          break;

        case "ArrowUp":
          this.up = true;
          break;

        case "ArrowDown":
          this.down = true;
          break;
      }
      // console.table(this);
    };

    document.onkeyup = (event) => {
      //   depending on what key was pressed
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;

        case "ArrowRight":
          this.right = false;
          break;

        case "ArrowUp":
          this.up = false;
          break;

        case "ArrowDown":
          this.down = false;
          break;
      }
      // console.table(this);
    };
  }
}
