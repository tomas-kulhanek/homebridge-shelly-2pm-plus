export class AccessoryResult {
  id = 0;
  name = '';
  in_mode = 'follow';
  initial_state = 'match_input';
  auto_on = false;
  auto_on_delay = 60.0;
  auto_off = false;
  auto_off_delay = 60.0;
  power_limit = 2800;
  voltage_limit = 280;
  undervoltage = 0;
  autorecover_voltage_errors = false;
  current_limit = 10.0;

  constructor(props: AccessoryResult | null = null) {
    Object.assign(this, props);
  }

}