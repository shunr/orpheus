import sys, json

# simple JSON echo script
for line in sys.stdin:
  print(str(dict(json.loads(line))))