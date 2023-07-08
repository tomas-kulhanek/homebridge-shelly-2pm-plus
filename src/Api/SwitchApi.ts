import axios, {Axios} from 'axios';
import {Accessory} from '../DTO/Accessory';
import {AccessoryStatus} from "../DTO/AccessoryStatus";

export default class SwitchApi {

  private axiosClient: Axios;

  constructor() {
    this.axiosClient = axios.create({
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  getBasicInformation(ip: string, id: number): Promise<Accessory> {
    return new Promise((resolve, reject) => {
      this.axiosClient.post(
        'http://' + ip + '/rpc',
        {'id': id, 'method': 'Switch.GetConfig', 'params': {'id': id}},
      ).then((response) => resolve(new Accessory(response.data))).catch((reject));
    });
  }

  getStatus(ip: string, id: number): Promise<AccessoryStatus> {
    return new Promise((resolve, reject) => {
      this.axiosClient.post(
        'http://' + ip + '/rpc',
        {'id': id, 'method': 'Switch.GetStatus', 'params': {'id': id}},
      ).then((response) => resolve(new AccessoryStatus(response.data))).catch((reject));
    });
  }

  toggleStatus(ip: string, id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.axiosClient.post(
        'http://' + ip + '/rpc',
        {'id': id, 'method': 'Switch.Toggle', 'params': {'id': id}},
      ).then((response) => resolve(response.data.was_on === false)).catch((reject));
    });
  }
}