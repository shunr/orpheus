import oll
import os, sys, json
import bisect

conf = {}
feature_mapping = {}
with open('config.json') as config_file:    
  conf = json.load(config_file)
with open('feature_mapping.json') as feature_file:    
  feature_mapping = json.load(feature_file)
  
def main():
  output = {
    'feature_preference': {},
    'genre_ranking': []
  }
  feature_indices = {}
  session = sys.argv[1]
  feature_count = int(sys.argv[2])
  genre_count = int(sys.argv[3])
  path = os.path.join(conf["db"]["modelDirectory"], session)
  params = conf["hyperParams"]
  
  model = oll.oll(params["algorithm"], C=params["regularization"], bias=params["bias"])
  model.load(path)
  
  for i in range(feature_count):
    feature_indices[i] = model.classify({i: 1})
    
  for feature, val in feature_mapping.items():
    output['feature_preference'][feature] = feature_indices[val['key']]
    
  for i in range(genre_count):
    pref = model.classify({i + feature_count: 1})
    if pref != 0:
      bisect.insort(output['genre_ranking'], (pref, i))
    
  print(json.dumps(output))
  
if __name__ == '__main__':
  main()
