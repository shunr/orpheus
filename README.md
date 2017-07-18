# Orpheus

Node experiment for training an online classification model to learn individual music tastes using user feedback to 30-second Spotify previews.

[![preview](https://github.com/shunr/orpheus/blob/master/preview.png)](http://im-orphe.us)

## Installation
Clone this repo
```shell
git clone https://github.com/shunr/orpheus.git
cd code-curator
```
Install dependencies
```shell
npm install
```
Orpheus uses @ikegami-yukino's [python implementation](https://github.com/ikegami-yukino/oll-python) of OLL
```shell
pip install -r requirements.txt
```
Create configuration file
```shell
cp config.example.json config.json
```

### Usage
```shell
npm start
```

## Configuration
Configuration is done through the objects found in **/config.json**

### config.spotify

| Option | Description |
|---|---|
|```clientId```| Client id used to access Spotify API |
|```clientSecret```| Client secret used to authenticate with Spotify API |

### config&#46;db

| Option | Description |
|---|---|
|```firstInitialization```| Orpheus generates a database of song metadata retrieved from Spotify to overcome rate limits. Required to be ```true``` on the first time running Orpheus, then should be set to ```false``` to improve startup speed. |
|```storagePath```| Path to persistent JSON database |
|```modelDirectory```| Directory used to store classification models for each user session |

### config.tracks

| Option | Description |
|---|---|
|```minPopularity```| Integer from ```1``` to ```100``` representing minimum popularity of a song to be used as a training case. |
|```tracksPerGenre```| Integer from ```1``` to ```100``` of tracks to fetch per genre. A higher number is recommended for accurate training results but will take longer to initialize |
|```maxQueuedTracks```| Maximum number of tracks to play to a user |
|```ignoredGenres```| Array of genre names to not include on initialization |

### config.hyperParams

These represent training hyperparameters used by the [oll](https://code.google.com/archive/p/oll/wikis/OllMainEn.wiki) library. Tweak for possibly better results. ```CW``` should be optimal.

## Features

Features need to be normalized from the data retrieved from [Spotify API](https://developer.spotify.com/web-api/get-audio-features/). 

### Good feature scaling
Optimization cab be done with feature objects in **/feature_mapping.json**. Generally, mean values should correspond to zero. For example, while ```loudness``` can range for ```-60``` to ```0``` dB, the mean value is -8 and the feature should be normalized with this in mind.

### Example feature

```json
"loudness": {
  "min": -16,
  "max": 0,
  "key": 5,
  "icon": "volume up",
  "extremes": [
    "quiet",
    "loud"
  ]
}
```
