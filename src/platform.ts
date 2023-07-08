import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
  Characteristic,
} from 'homebridge';

import {PLATFORM_NAME, PLUGIN_NAME} from './settings';
import {Shelly2PMPlusPlatformAccessory} from './platformAccessory';
import {BLUE, GREY, RED, RESET, GREEN, LIGHT_GREY} from './colors';
import SwitchApi from './Api/SwitchApi';
import {Accessory} from './DTO/Accessory';

export class Shelly2PMPlusPlatform implements DynamicPlatformPlugin {
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform');
    this.api.on('didFinishLaunching', () => {
      log.debug(`${GREY}Executed didFinishLaunching callback${RESET}`);
      this.initAccessories()
        .then(() => this.log.info(`${GREEN}Initialized${RESET}`))
        .catch((error) => this.log.error(`Initialize of plugin was failed ${error}`));

    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }

  async initAccessories() {
    this.log.debug(this.config.watch);
    const devices: { deviceIp: string; accessory: Accessory }[] = [];
    const activeUUIDs: Array<string> = [];
    const toRegister: Array<PlatformAccessory> = [];
    const toUpdate: Array<PlatformAccessory> = [];
    const toUnregister: Array<PlatformAccessory> = [];
    const switchApi = new SwitchApi();

    for (const deviceIp of this.config.watch) {
      for (let i = 0; i <= 1; i++) {
        this.log.info('Getting information about device from ' + deviceIp + ' with id ' + i);
        const switchAccessory = await switchApi.getBasicInformation(deviceIp, i);
        devices.push({
          deviceIp: deviceIp,
          accessory: switchAccessory,
        });
      }
    }

    for (const deviceDef of devices) {
      const uuid = this.api.hap.uuid.generate(deviceDef.accessory.src + 'id:' + deviceDef.accessory.id);
      activeUUIDs.push(uuid);
      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      if (deviceDef.accessory.result === undefined) {
        continue;
      }
      const device = {uuid: uuid, name: deviceDef.accessory.result.name};
      if (existingAccessory) {
        this.log.info(
          this.colorizedThermostatIdentifications(device) + 'Restoring existing switch from cache',
        );
        existingAccessory.context.device = device;
        existingAccessory.displayName = device.name;
        this.createSwitchPlatformAccessory(existingAccessory, deviceDef.deviceIp, deviceDef.accessory, switchApi);
        toUpdate.push(existingAccessory);
        continue;
      }

      this.log.info(
        this.colorizedThermostatIdentifications(device) + 'Adding new switch',
      );
      const accessory = new this.api.platformAccessory(device.name, uuid);
      accessory.context.device = device;
      this.createSwitchPlatformAccessory(accessory, deviceDef.deviceIp, deviceDef.accessory, switchApi);
      toRegister.push(accessory);
    }

    for (const accessory of this.accessories) {
      if (!activeUUIDs.includes(accessory.UUID)) {
        this.log.debug(
          this.colorizedThermostatIdentifications(accessory.context.device)
          + `${RED}Removing unused switch accessory ${RESET}`,
        );
        toUnregister.push(accessory);
      }
    }

    this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, toRegister);
    try {
      this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, toUnregister);
    } catch (error) {
      this.log.error(`Error while unregistering accessories: ${error}`);
    }
    try {
      this.api.updatePlatformAccessories(toUpdate);
    } catch (error) {
      this.log.error(`Error while updating accessories: ${error}`);
    }
  }

  private createSwitchPlatformAccessory(
    accessory,
    deviceIp: string,
    switchAccessory: Accessory,
    switchApi: SwitchApi,
  ): Shelly2PMPlusPlatformAccessory {
    const switchPlatformAccessory = new Shelly2PMPlusPlatformAccessory(
      this,
      accessory,
      deviceIp,
      switchAccessory,
      switchApi,
    );
    switchPlatformAccessory.initialize();
    return switchPlatformAccessory;
  }

  private colorizedThermostatIdentifications(device: { uuid: string; name: string }): string {
    return `${LIGHT_GREY}[${device.uuid}]${RESET} ${BLUE}[${device.name}]${RESET}: `;
  }
}
