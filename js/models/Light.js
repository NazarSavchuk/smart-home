export class Light extends Device {
    constructor(name, isOn = false) {
        super(name, "Light", isOn);
    }
}