export const USER_ID_FIELD = "stress_analytics"
export const STUDY_ID_FIELD = "stress_analytics_study"

/**
 * Returns whether there currently exists an item with the given name.
 */
export function doesItemExist(name) {
    return window.localStorage.getItem(name) !== null;
}

/**
 * Returns the value of the item with the given name, or null if the cookie does not exist.
 */
export function getItem(name) {
    return window.localStorage.getItem(name);
}

/**
 * Sets the item with the given name to the given value.
 */
export function setItem(name, value) {
    window.localStorage.setItem(name, value);
}

/**
 * Clears the item with the given name.
 */
export function clearItem(name) {
    window.localStorage.removeItem(name);
}
