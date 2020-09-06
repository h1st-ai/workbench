"""
You can test your model code here by typing "nose2" in the terminal.
"""
import unittest
from mmm_model import MMMModel

class TestMMMModel(unittest.TestCase):
    model = MMMModel()

    def test_load_data(self):
	self.data = self.model.load_data()
        self.assertIsInstance(self.data, dict)
	return self.data

    def test_explore(self):
	if self.data is None:
	    self.data = self.test_load_data()

        self.assertIsInstance(self.model.explore(self.data), None)

    def test_prep(self):
	if self.data is None:
	    self.data = self.test_load_data()

	self.prepared_data = self.model.prep(self.data)
        self.assertIsInstance(self.prepared_data, dict)

    def test_train(self):
	if self.prepared_data is None:
	    self.prepared_data = self.test_prep_data()

	self.trained_model = self.model.train(self.prepared_data)
        self.assertIsInstance(self.trained_model, TestMMMModel)

    def test_evaluate(self):
	if self.trained_model is None:
		self.trained_model = self.test_train()

	self.evaluation_metrics = self.trained_model.evaluate(self.prepared_data)
        self.assertIsInstance(self.evaluation_metrics, dict)

    def test_predict(self):
	if self.trained_model is None:
		self.trained_model = self.test_train()

	self.predictions = self.trained_model.predict(self.prepared_data)
        self.assertIsInstance(self.predictions, dict)
