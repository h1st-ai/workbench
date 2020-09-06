import h1st as h1
from mmm_model import MMMModel

class MMMGraph(h1.Graph):
    def __init__(self):
        super().__init__()

	# Construct the execution graph
        self.start()
        self.add(MMMModel())
        self.end()

if __name__ == "__main__":
    graph = MMMGraph()
    graph.predict({"input_data": {}})

