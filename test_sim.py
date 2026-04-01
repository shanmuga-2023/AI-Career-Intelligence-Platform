import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'ml-engine'))
from career_simulation import simulate_career_path
import pprint

print("Running test...")
res = simulate_career_path(["blender"], "3d artist")
pprint.pprint(res)
