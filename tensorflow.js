class NeuralNetwork {

  constructor(i, h, o, n) {

    //Creating Neural Network
    if (i instanceof tf.Sequential) {
      this.model = i;
      this.input_nodes = h;
      this.hidden_nodes = o;
      this.output_nodes = n;
    } else {
      this.input_nodes = i;
      this.hidden_nodes = h;
      this.output_nodes = o;
      this.model = this.createModel();
    }

  }

  createModel() {
    //Initializing model
    const model = tf.sequential();

    //Initializing hiddenl layers
    const hidden = tf.layers.dense({
      inputShape: [this.input_nodes],
      units: this.hidden_nodes,
      activation: 'sigmoid'
    });

    model.add(hidden);

    //Initializing output layer
    const output = tf.layers.dense({
      units: this.output_nodes,
      activation: 'softmax'
    });

    model.add(output);

    return model;
  }

  predict(inputArr) {
    return tf.tidy(() => {
      //Turning input array into tensor
      const inputTnsr = tf.tensor2d([inputArr]);
      //Predicting output tensor
      const outputTnsr = this.model.predict(inputTnsr);
      //Creating and returning output array
      const outputArr = outputTnsr.dataSync();
      return outputArr;
    });
  }

  breed() {
    //Function for copying neural network 
    return tf.tidy(() => {

      //Creating model and getting weights
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();

      //Cloning weights
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }

      //Setting cloned weights and returning model
      modelCopy.setWeights(weightCopies);

      return new NeuralNetwork(
        modelCopy,
        this.input_nodes,
        this.hidden_nodes,
        this.output_nodes
      );
    });
  }

  mutate(rate) {
    //Function for mutating neural network   
    tf.tidy(() => {
      //Getting current weights
      const weights = this.model.getWeights();

      const mutatedWeights = [];

      for (let i = 0; i < weights.length; i++) {
        //Conserving weight shape & value 
        let tensor = weights[i];
        let shape = weights[i].shape;
        //Creating copy of weight value
        let values = tensor.dataSync().slice();

        //Changing values (normalized RoC) by P(rate) 
        for (let j = 0; j < values.length; j++) {
          if (random(1) < rate) {
            let w = values[j];
            values[j] = w + randomGaussian();
          }
        }

        //Creating new tensor with proper value and shape 
        let newTensor = tf.tensor(values, shape);
        //Adding proper value and shape into new weight array
        mutatedWeights[i] = newTensor;
      }
      //Setting new weights
      this.model.setWeights(mutatedWeights);
    });
  }

}