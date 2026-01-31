// safe-storage.js (non-module)
// Include this BEFORE main.js to make safeGetItem / safeSetItem available globally.

window.safeSetItem = function (key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // ignore storage errors (tracking prevention / private mode)
  }
};

window.safeGetItem = function (key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

window.safeRemoveItem = function (key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
};
