/* globals $ */

import CustomEventManager from "./CustomEventManager";

class SkeletonLoaderEvent extends CustomEventManager {
  constructor(eventName) {
    if (!SkeletonLoaderEvent.instance) {
      super(eventName);
      SkeletonLoaderEvent.instance = this;
    }
    return SkeletonLoaderEvent.instance;
  }

  handleCustomEvent(event) {
    const { targetElements, isLoading } = event.detail;
    if (isLoading) {
      this.addSkeletonToElement(targetElements);
    } else {
      this.removeSkeletonFromElement(targetElements);
    }
  }

  /**
   * Triggers event in indicated element
   * @param {NodeList} targetElements
   * @param {Boolean} isLoading
   */

  dispatchCustomEvent(targetElements, isLoading) {
    const event = new CustomEvent(this.eventName, {
      detail: { isLoading, targetElements },
    });
    document.dispatchEvent(event);
  }

  SKELETON_LOADER_CLASS = "skeleton-loader";

  addSkeletonToElement(target) {
    // run through all targeted elements and make them relative
    $(target).each((i, elem) => {
      const children = $(elem);
      children.css("position", "relative");
      // append absolute skeleton div to each
      children.append(`<div class='${this.SKELETON_LOADER_CLASS}'></div>`);
    });
  }

  removeSkeletonFromElement = (target) => {
    // Remove the skeleton div from the current element
    $(target).each((i, elem) => {
      const children = $(elem);
      children.css("position", "");
      children.find(`.${this.SKELETON_LOADER_CLASS}`).remove();
    });
  };
}

export default new SkeletonLoaderEvent("skeletonLoader");
