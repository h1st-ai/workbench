"""
You can test your H1st model here. Run the following command in the terminal execute the script:

python rulebasedmodel_modeling.py

Jupyter Notebook will be released in next version!
"""

from mmm_model import MMMModel

model = MMMModel()

# load your data
data = model.load_data()

# prepare your data
prepared_data = model.prep(data)

# train your model
model.train(prepared_data)

# blah
model.evaluate(prepared_data)

# predict
model.predict({"input_data": {}})
