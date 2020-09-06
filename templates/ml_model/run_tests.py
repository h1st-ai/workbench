import os
os.chdir(os.path.dirname(__file__))
os.system("nose2 tests")
