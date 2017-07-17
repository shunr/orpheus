import oll
import os, sys, json, pickle

conf = {}
with open('config.json') as config_file:    
  conf = json.load(config_file)

def save(obj, path):
    with open(path, 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load(path):
    with open(path, 'rb') as f:
        return pickle.load(f)  
  
def main():
  session = sys.argv[1]
  features = dict(json.loads(sys.argv[2]))
  verdict = int(sys.argv[3])
  path = os.path.join(conf['db']['modelDirectory'], session)
  genre_path = os.path.join(conf['db']['modelDirectory'], session + '.g')
  params = conf['hyperParams']
  feature_histo = {}
  
  model = oll.oll(params['algorithm'], C=params['regularization'], bias=params['bias'])
  model.load(path)
  model.add(features, verdict)
  model.save(path)
  
  if os.path.isfile(genre_path):
    feature_histo = load(genre_path)
    
  for i in features:
    if i in feature_histo:
      feature_histo[i] += verdict
    else:
      feature_histo[i] = verdict
  
  save(feature_histo, genre_path)
    
if __name__ == '__main__':
  main()
