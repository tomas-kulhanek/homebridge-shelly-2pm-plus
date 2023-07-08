import {Logger, PlatformAccessory, Service} from 'homebridge';
import {Shelly2PMPlusPlatform} from './platform';
import {BLUE, CYAN, GREY, LIGHT_GREY, RESET} from './colors';
import {Accessory} from './DTO/Accessory';
import SwitchApi from './Api/SwitchApi';

export class Shelly2PMPlusPlatformAccessory {

  private service: Service;
  private name: string;
  private logger: Logger;
  private currentState = false;

  constructor(
    private readonly platform: Shelly2PMPlusPlatform,
    private readonly accessory: PlatformAccessory,
    private readonly deviceIp: string,
    private switchAccessory: Accessory,
    private readonly switchApi: SwitchApi,
  ) {
    this.logger = platform.log;
    this.name = platform.config.name as string;

    this.service = this.accessory.getService(this.platform.api.hap.Service.Switch)
      || this.accessory.addService(this.platform.api.hap.Service.Switch);
  }

  async updateValues() {
    this.debug('Update Shelly 2PM Plus accessory');
    this.switchApi.getStatus(this.deviceIp, this.switchAccessory.id)
      .then((data) => this.currentState = data.result?.output ?? false);

    const informationService = this.accessory.getService(this.platform.api.hap.Service.AccessoryInformation);
    if (informationService) {
      informationService
        .setCharacteristic(this.platform.api.hap.Characteristic.Manufacturer, 'Shelly')
        .setCharacteristic(this.platform.api.hap.Characteristic.Model, '2PM Plus')
        .setCharacteristic(this.platform.api.hap.Characteristic.SerialNumber, 'fghj');
    }
  }

  initialize() {
    this.debug('Initializing Shelly 2PM Plus accessory');
    this.service.setCharacteristic(this.platform.Characteristic.Name, this.switchAccessory.result?.name ?? 'Unnamed');

    // create handlers for required characteristics
    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onGet(this.handleOnGet.bind(this))
      .onSet(this.handleOnSet.bind(this));

    this.updateValues()
      .then(() => {
        setInterval(() => {
          this.updateValues()
            .then(() => this.debug('Value updates was successfully'))
            .catch((error) => this.error(`Is not possible to update values ${error}`));
        }, 10000); //every 10 second
      }).catch((error) => this.error(`Is not possible to update values ${error}`));
  }

  handleOnGet() {
    this.debug('Triggered GET On - ' + this.currentState);
    return this.currentState;
  }

  handleOnSet(value) {
    this.debug('Triggered SET On:' + value);
    this.switchApi.toggleStatus(this.deviceIp, this.switchAccessory.id)
      .then(() => this.currentState = value)
      .catch(() => this.error('Is not possible to update switch status'));
  }

  debug(message: string) {
    this.logger.debug(this.baseLogMessage + `${GREY}${message}${RESET}`);
  }

  info(message: string) {
    this.logger.info(this.baseLogMessage + message);
  }

  warning(message: string) {
    this.logger.warn(this.baseLogMessage + message);
  }

  error(message: string) {
    this.logger.error(this.baseLogMessage + message);
  }

  private get baseLogMessage(): string {
    return `${LIGHT_GREY}[${this.accessory.context.device.uuid}]${RESET} ${BLUE}[${this.accessory.displayName}]: ${RESET}`;
  }

  private cyanize(value: string | number | undefined): string {
    if (value === undefined) {
      return '';
    }
    return `${CYAN}${value}${RESET}`;
  }
}
