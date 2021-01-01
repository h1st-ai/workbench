export default (workSpaceName: string, modelName: string) =>
  `"""
The following is a boilerplate code that is provided by workbench. 
Please fill in each function with your own code.
"""

import h1st as h1
import config

class ${modelName}(h1.Model):
    def __init__(self):
        # Please instantiate your ML/DL/Human model here if necessary
        self.model = None

    def load_data(self) -> dict:
        # Implement code to retrieve your data here
        print('data_path:', config.DATA_PATH)
        return {}

    def prep(self, data: dict) -> dict:
        # Implement code to prepare your data here
        return data

    def train(self, prepared_data: dict):
        # Implement your train logic here
        pass

    def evaluate(self, data: dict) -> dict:
        # Implement your evaluation logic here
        pass

    def predict(self, data: dict) -> dict:
        # Implement your predict logic here
        return {}
`;
