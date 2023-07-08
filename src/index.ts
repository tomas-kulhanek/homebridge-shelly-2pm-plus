import { API } from 'homebridge';
import { PLATFORM_NAME } from './settings';
import { Shelly2PMPlusPlatform } from './platform';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, Shelly2PMPlusPlatform);
};
