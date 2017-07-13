import sys, json

# simple JSON echo script

def main():
  for line in sys.stdin:
    print(str(dict(json.loads(line))))

#start process
if __name__ == '__main__':
    main()
