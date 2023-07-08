[![GitHub last commit](https://img.shields.io/github/last-commit/tomas-kulhanek/homebridge-shelly-2pm-plus.svg)](https://github.com/tomas-kulhanek/homebridge-shelly-2pm-plus)
[![npm](https://img.shields.io/npm/dt/homebridge-shelly-2pm-plus.svg)](https://www.npmjs.com/package/homebridge-shelly-2pm-plus)
[![npm version](https://badge.fury.io/js/homebridge-shelly-2pm-plus.svg)](https://badge.fury.io/js/homebridge-shelly-2pm-plus)

<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

# homebridge-shelly-2pm-plus

## Homebridge Platform Plugin Shelly 2PM Plus


This [homebridge](https://github.com/homebridge/homebridge) plugin allows you to control the Shelly 2PM Plus switch in your Apple Home App (HomeKit).

## Instructions

1. Install the plugin as `root` (`sudo su -`) with `npm install -g homebridge-shelly-2pm-plus@latest --unsafe-perm`.
2. Customize you homebridge configuration `config.json`.
3. Restart homebridge, ggf. `service homebridge restart`.

- Example `config.json` with one vacuum and room cleaning:

```
   "platforms": [
        {
            "watch": [
                "192.168.23.254"
            ],
        }
    ],
```

Or you can use Homebridge UI 