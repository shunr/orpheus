import oll
import os, sys, json

conf = {}
with open('config.json') as config_file:    
  conf = json.load(config_file)

def main():
  session = sys.argv[1]
  features = dict(json.loads(sys.argv[2]))
  verdict = int(sys.argv[3])
  path = os.path.join(conf["db"]["modelDirectory"], session)
  params = conf["hyperParams"]
  
  model = oll.oll(params["algorithm"], C=params["regularization"], bias=params["bias"])
  model.load(path)
  #print(verdict)
  #print(model.classify(features))
  model.add(features, verdict)
  model.save(path)
  
if __name__ == '__main__':
  main()
