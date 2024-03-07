!(function (e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? n(exports)
    : "function" == typeof define && define.amd
      ? define(["exports"], n)
      : n(
          ((e =
            "undefined" != typeof globalThis
              ? globalThis
              : e || self).yourLibrary = {}),
        );
})(this, function (e) {
  "use strict";
  e.yourLibFunction = function (e, n) {
    return e + n;
  };
});
