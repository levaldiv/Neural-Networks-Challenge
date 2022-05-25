class NeuralNetwork {
  // # of neurons in each layer
  constructor(neuronCounts) {
    this.levels = []; // making neural network out of an array of levels
    // for each lvl, specify the input/output count
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]); // calling 1st lvl to produce  outputs

    // loopoing through the remaining levels
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  // randomize everything i had previously
  static mutate(network, amount = 1) {
    // going through all the lvls of the network
    network.levels.forEach((level) => {
      // iterating through all the biases
      for (let i = 0; i < level.biases.length; i++) {
        // the ith bias = lerp
        level.biases[i] = lerp(
          // current lvl of the bias
          level.biases[i],
          Math.random() * 2 - 1, // rnd val between -1 and 1
          amount // using lerp to go from the current val of the bias towards whatever that rnd val is depending on amount
        );
      }

      // iterating through all the weights now
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          // thee weight of i and j = lerp
          level.weights[i][j] = lerp(
            level.weights[i][j], // current val of the weight
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    /** Defining the "neurons" **/
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount); // each output has a bias (a val above which it will fire)

    // connecting every input neuron to every output neuron (these connections will hvae weights)
    this.weights = [];
    // gfor each input node, im gunna have ouput couny number of connections
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this); //  radom brain for now
  }

  // creating static method to be able to serialize the object afterwards
  static #randomize(level) {
    // given a lvl , im going to go through its inputs
    for (let i = 0; i < level.inputs.length; i++) {
      //   for each input, im going to go through its outputs
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; // for every input/output pair ; set the weight to a rnd val between -1 and 1
      }
    }

    // biases will be in the same range
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  //** Computing the outputs using the weights and biases from above (these are rnd but in a smart brain; they have a structure) */
  static feedForward(givenInputs, level) {
    // going though all the lvl inputs and set them to the givin inputs, for now
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i]; // vals that come from the sensor
    }

    // getting the outputs
    for (let i = 0; i < level.outputs.length; i++) {
      // calculating some kind of sum bw the value of the inputs and weights
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i]; // repeat this for every input neuron
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1; // essentially turing it on
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}
