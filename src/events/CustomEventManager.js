class CustomEventManager {
  constructor(eventName) {
    this.eventName = eventName;
    this.handleCustomEvent = this.handleCustomEvent.bind(this);
  }

  init() {
    this.addEventListener();
  }

  handleCustomEvent(event) {
    console.log(`Received custom event: ${event.detail}`);
  }

  dispatchCustomEvent(data) {
    const event = new CustomEvent(this.eventName, { detail: data });
    document.dispatchEvent(event);
  }

  addEventListener() {
    document.addEventListener(this.eventName, this.handleCustomEvent);
  }

  removeEventListener() {
    document.removeEventListener(this.eventName, this.handleCustomEvent);
  }
}

export default CustomEventManager;
