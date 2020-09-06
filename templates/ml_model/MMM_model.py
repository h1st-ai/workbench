"""
The following is a boilerplate code that is provided by workbench. 
Please fill in each function with your own code.
"""

import h1st as h1
import config

class MMMModel(h1.MLModel):
    def __init__(self):
        # Instantiate your base (tensorflow, sklearn, pytorch, etc.) model here
	# self.base_model = xxx

    def load_data(self) -> dict:
        # Implement code to retrieve your data here
        return {"data_path": config.DATA_PATH}

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
        return {"result": True}

if __name__ == "__main__":
    model = MMMModel()
    model.predict({"input_data": None})

