import oll
# You can choose algorithms in
# "P" -> Perceptron,
# "AP" -> Averaged Perceptron,
# "PA" -> Passive Agressive,
# "PA1" -> Passive Agressive-I,
# "PA2" -> Passive Agressive-II,
# "PAK" -> Kernelized Passive Agressive,
# "CW" -> Confidence Weighted Linear-Classification,
# "AL" -> ALMA
o = oll.oll("CW", C=1.0, bias=0.0)
o.add({0: 1.0, 1: 1.0, 2: 1.0, 4: 1.0}, -1)
o.add({0: 1.0, 1: -1.0, 2: 1.0, 3: -1.0}, -1)# train
o.add({0: -1.0, 1: -0.2, 2: 0.0}, 1)
o.add({0: -1.0, 1: 1.0, 2: 0.0}, 1)

print(o.classify({5: 1}))  # predict
o.save('oll.model')
o.load('oll.model')