import oll
import os, sys, json, pickle

conf = {}
feature_mapping = {}

with open('config.json') as config_file:    
  conf = json.load(config_file)
with open('feature_mapping.json') as feature_file:    
  feature_mapping = json.load(feature_file)
  
def load(path):
    with open(path, 'rb') as f:
        return pickle.load(f)    

def return_predict(model, features):
  print(model.classify(features))
      
def return_data(model, session, feature_count, genre_count):
  output = {
    'feature_preference': {},
    'genre_ranking': []
  }
  feature_indices = {}
  feature_histo = {}
  genre_path = os.path.join(conf["db"]["modelDirectory"], session + '.g')
  
  for i in range(feature_count):
    feature_indices[i] = model.classify({i: 1})
    
  for feature, val in feature_mapping.items():
    output['feature_preference'][feature] = feature_indices[val['key']]
   
  if os.path.isfile(genre_path):
    feature_histo = load(genre_path)
    for i in range(genre_count):
      if (i + feature_count) in feature_histo:
        pref = feature_histo[i + feature_count]
        output['genre_ranking'].append((pref, i))
    output['genre_ranking'].sort();  
    
  print(json.dumps(output))
      
def main():
  params = conf["hyperParams"]
  session = sys.argv[2]
  path = os.path.join(conf["db"]["modelDirectory"], session)
  model = oll.oll(params["algorithm"], C=params["regularization"], bias=params["bias"])
  model.load(path)
  if sys.argv[1] == '0':
    return_data(model, session, int(sys.argv[3]), int(sys.argv[4]))
  else:
    features = dict(json.loads(sys.argv[3]))
    return_predict(model, features)
  
if __name__ == '__main__':
  main()
