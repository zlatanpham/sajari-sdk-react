import { Tracking, valuesUpdatedEvent } from "./";

/**
 * Set up website tracking reset based on a query parameter changing.
 * @param {Values} values Values object to listen to.
 * @param {Tracking} tracking Tracking object to reset.
 * @param {string} [paramQ="q"] Paramter to use as query from values.
 */
const initWebsiteTracking = (values, tracking, paramQ = "q") => {
  let prevQ = "";
  return values.listen(valuesUpdatedEvent, changed => {
    if (changed[paramQ] === undefined) {
      return;
    }

    const newQ = changed[paramQ];
    const first3CharactersChanged = !newQ.startsWith(
      prevQ.substr(0, Math.min(newQ.length, 3))
    );
    const queryCleared = prevQ.length > 0 && newQ.length === 0;
    if (first3CharactersChanged || queryCleared) {
      tracking.reset();
    }

    prevQ = newQ;
  });
};

/**
 * Creates a new click tracking analytics object.
 * @param {string|undefined} [field="url"] Unique field to use for tracking.
 */
const ClickTracking = (field = "url") => {
  const tracking = new Tracking();
  tracking.clickTokens(field);
  return tracking;
};

export { initWebsiteTracking, ClickTracking };
