/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/worklets/AudioWorkletProxyProcessor.ts":
/*!*********************************************************!*\
  !*** ./src/core/worklets/AudioWorkletProxyProcessor.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var _a;
const { AudioWorkletProcessor } = globalThis;
const Processor = (_a = class extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this._disposed = false;
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;
    const handleDisposed = () => {
      this.port.removeEventListener("message", handleMessage);
      this.port.close();
    };
    const handleMessage = async (e) => {
      var _a2, _b;
      const { id, call: call2, args, value, error } = e.data;
      if (call2) {
        const r = { id };
        try {
          r.value = await this[call2](...args);
        } catch (e2) {
          r.error = e2;
        }
        this.port.postMessage(r);
        if (this._disposed)
          handleDisposed();
      } else {
        if (error)
          (_a2 = rejects[id]) == null ? void 0 : _a2.call(rejects, error);
        else if (resolves[id])
          (_b = resolves[id]) == null ? void 0 : _b.call(resolves, value);
        delete resolves[id];
        delete rejects[id];
      }
    };
    const call = (call2, ...args) => new Promise((resolve, reject) => {
      const id = messagePortRequestId--;
      resolves[id] = resolve;
      rejects[id] = reject;
      this.port.postMessage({ id, call: call2, args });
    });
    const Ctor = this.constructor;
    Ctor.fnNames.forEach((name) => this[name] = (...args) => call(name, ...args));
    this.port.start();
    this.port.addEventListener("message", handleMessage);
  }
}, _a.fnNames = [], _a);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Processor);


/***/ }),

/***/ "./src/utils/buffer.ts":
/*!*****************************!*\
  !*** ./src/utils/buffer.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "mean": () => (/* binding */ mean),
/* harmony export */   "median": () => (/* binding */ median),
/* harmony export */   "maxIndex": () => (/* binding */ maxIndex),
/* harmony export */   "energy": () => (/* binding */ energy),
/* harmony export */   "rms": () => (/* binding */ rms),
/* harmony export */   "absMax": () => (/* binding */ absMax),
/* harmony export */   "zcr": () => (/* binding */ zcr),
/* harmony export */   "centroid": () => (/* binding */ centroid),
/* harmony export */   "conjugatedCentroid": () => (/* binding */ conjugatedCentroid),
/* harmony export */   "geometricMean": () => (/* binding */ geometricMean),
/* harmony export */   "flatness": () => (/* binding */ flatness),
/* harmony export */   "flux": () => (/* binding */ flux),
/* harmony export */   "kurtosis": () => (/* binding */ kurtosis),
/* harmony export */   "skewness": () => (/* binding */ skewness),
/* harmony export */   "rolloff": () => (/* binding */ rolloff),
/* harmony export */   "slope": () => (/* binding */ slope),
/* harmony export */   "spread": () => (/* binding */ spread),
/* harmony export */   "setTypedArray": () => (/* binding */ setTypedArray),
/* harmony export */   "getSubTypedArray": () => (/* binding */ getSubTypedArray),
/* harmony export */   "sliceBuffer": () => (/* binding */ sliceBuffer),
/* harmony export */   "fftw2Amp": () => (/* binding */ fftw2Amp),
/* harmony export */   "estimateFreq": () => (/* binding */ estimateFreq),
/* harmony export */   "indexToFreq": () => (/* binding */ indexToFreq)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./src/utils/math.ts");

const sum = (array, from = 0, length = array.length) => {
  let sum2 = 0;
  const l = array.length;
  for (let i = 0; i < length; i++) {
    sum2 += array[(from + i) % l];
  }
  return sum2;
};
const mean = (array, from = 0, length = array.length) => sum(array, from, length) / length;
const median = (array, from = 0, length = array.length) => {
  if (length === 0)
    throw new Error("trying to calculate median of empty array");
  const sortedArray = (from + length > array.length ? Array.isArray(array) ? array.slice(from).concat(array.slice(0, from + length - array.length)) : sliceBuffer(array, length, from) : array.slice(from, from + length)).sort();
  if (length % 2 === 0)
    return (sortedArray[length / 2 - 1] + sortedArray[length / 2]) / 2;
  return sortedArray[~~(length / 2)];
};
const maxIndex = (array, from = 0, length = array.length) => {
  const l = array.length;
  if (!l)
    return 0;
  let index = 0;
  let max = array[0];
  let i = length;
  while (i-- > 1) {
    const cur = array[(from + i) % l];
    if (cur <= max)
      continue;
    max = cur;
    index = i;
  }
  return index;
};
const energy = (signal, from = 0, length = signal.length) => {
  let sum2 = 0;
  let sample = 0;
  const l = signal.length;
  for (let i = 0; i < length; i++) {
    sample = signal[(from + i) % l];
    sum2 += sample * sample;
  }
  return sum2;
};
const rms = (signal, from = 0, length = signal.length) => Math.sqrt(energy(signal, from, length) / signal.length);
const absMax = (signal, from = 0, length = signal.length) => {
  let max = 0;
  let sample = 0;
  const l = signal.length;
  for (let i = 0; i < length; i++) {
    sample = Math.abs(signal[(from + i) % l]);
    if (sample > max)
      max = sample;
  }
  return max;
};
const zcr = (signal, from = 0, length = signal.length) => {
  let zcr2 = 0;
  let lastPositive = true;
  let positive = true;
  const l = signal.length;
  for (let i = 0; i < length; i++) {
    positive = signal[(from + i) % l] >= 0;
    if (positive !== lastPositive)
      zcr2++;
    lastPositive = positive;
  }
  return zcr2;
};
const centroid = (array, from = 0, length = array.length) => {
  let weightedSum = 0;
  let weight = 0;
  let sample = 0;
  const l = array.length;
  for (let i = 0; i < length; i++) {
    sample = array[(from + i) % l];
    weightedSum += i * Math.abs(sample);
    weight += sample;
  }
  return weight === 0 ? 0 : weightedSum / weight;
};
const conjugatedCentroid = (array, factor, from = 0, length = array.length) => {
  let weightedSum = 0;
  let weight = 0;
  let sample = 0;
  const l = array.length;
  for (let i = 0; i < length; i++) {
    sample = array[(from + i) % l];
    weightedSum += i ** factor * Math.abs(sample);
    weight += sample;
  }
  return weight === 0 ? 0 : weightedSum / weight;
};
const geometricMean = (array, from = 0, length = array.length) => {
  let sum2 = 0;
  let sample = 0;
  const l = array.length;
  for (let i = 0; i < length; i++) {
    sample = array[(from + i) % l];
    if (sample <= 0)
      return 0;
    sum2 += Math.log(sample);
  }
  return Math.exp(sum2 / length);
};
const flatness = (array, from = 0, length = array.length) => geometricMean(array, from, length) / mean(array, from, length);
const flux = (cur, prev, norm, halfRectify) => {
  let flux2 = 0;
  if (norm === "L2") {
    if (halfRectify === true) {
      for (let i = 0; i < cur.length; i++) {
        const diff = cur[i] - prev[i];
        if (diff < 0)
          continue;
        flux2 += diff * diff;
      }
      return Math.sqrt(flux2);
    }
    for (let i = 0; i < cur.length; i++) {
      const diff = cur[i] - prev[i];
      flux2 += diff * diff;
    }
    return Math.sqrt(flux2);
  }
  if (halfRectify === true) {
    for (let i = 0; i < cur.length; i++) {
      const diff = cur[i] - prev[i];
      if (diff < 0)
        continue;
      flux2 += diff;
    }
    return flux2;
  }
  for (let i = 0; i < cur.length; i++) {
    const diff = cur[i] - prev[i];
    flux2 += Math.abs(diff);
  }
  return flux2;
};
const kurtosis = (array, from = 0, length = array.length) => {
  const c1 = centroid(array, from, length);
  const c2 = conjugatedCentroid(array, 2, from, length);
  const c3 = conjugatedCentroid(array, 3, from, length);
  const c4 = conjugatedCentroid(array, 4, from, length);
  const numerator = -3 * c1 ** 4 + 6 * c1 * c2 - 4 * c1 * c3 + c4;
  const denominator = (c2 - c1 ** 2) ** 2;
  return numerator / denominator;
};
const skewness = (array, from = 0, length = array.length) => {
  const c1 = centroid(array, from, length);
  const c2 = conjugatedCentroid(array, 2, from, length);
  const c3 = conjugatedCentroid(array, 3, from, length);
  const numerator = 2 * c1 ** 3 - 3 * c1 * c2 + c3;
  const denominator = (c2 - c1 ** 2) ** 1.5;
  return numerator / denominator;
};
const rolloff = (array, from = 0, length = array.length, cutoff) => {
  let e = energy(array, from, length);
  const threshold = (cutoff || 0.99) * e;
  let n = length - 1;
  let element;
  while (e > threshold && n >= 0) {
    element = array[(n + from) % length];
    e -= element * element;
    --n;
  }
  return n + 1;
};
const slope = (array, from = 0, n = array.length) => {
  const xSum = n * n / 2;
  const x2Sum = (n - 1) * n * (2 * n - 1) / 6;
  let ySum = 0;
  let xySum = 0;
  let y;
  for (let x = 0; x < n; x++) {
    y = array[(x + from) % n];
    ySum += y;
    xySum += x * y;
  }
  return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
};
const spread = (array, from = 0, length = array.length) => Math.sqrt(conjugatedCentroid(array, 2, from, length)) - centroid(array, from, length) ** 2;
const setTypedArray = (to, from, offsetTo, offsetFrom) => {
  const toLength = to.length;
  const fromLength = from.length;
  const spillLength = Math.min(toLength, fromLength);
  let spilled = 0;
  let $to = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offsetTo, toLength) || 0;
  let $from = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offsetFrom, fromLength) || 0;
  while (spilled < spillLength) {
    const $spillLength = Math.min(spillLength - spilled, toLength - $to, fromLength - $from);
    const $fromEnd = $from + $spillLength;
    if ($from === 0 && $fromEnd === fromLength)
      to.set(from, $to);
    else
      to.set(from.subarray($from, $fromEnd), $to);
    $to = ($to + $spillLength) % toLength;
    $from = $fromEnd % fromLength;
    spilled += $spillLength;
  }
  return $to;
};
const getSubTypedArray = (from, length, offset = 0) => {
  const fromLength = from.length;
  const $ = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength)
    return from;
  if ($ + length < fromLength)
    return from.subarray($, $ + length);
  const to = new from.constructor(length);
  setTypedArray(to, from, 0, $);
  return to;
};
const sliceBuffer = (from, length, offset) => {
  const fromLength = from.length;
  const $ = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength)
    return from.slice();
  if ($ + length < fromLength)
    return from.slice($, $ + length);
  const to = new from.constructor(length);
  setTypedArray(to, from, 0, $);
  return to;
};
const fftw2Amp = (from, windowEnergyFactor) => {
  const { length } = from;
  const amps = new Float32Array(length / 2);
  for (let i = 0; i < length / 2; i++) {
    const real = from[i];
    const imag = i === 0 || i === length / 2 - 1 ? 0 : from[length - i];
    amps[i] = (real * real + imag * imag) ** 0.5 / length * windowEnergyFactor;
  }
  return amps;
};
const estimateFreq = (amps, sampleRate) => indexToFreq(maxIndex(amps), amps.length, sampleRate);
const indexToFreq = (i, fftBins, sampleRate) => i % fftBins / fftBins * sampleRate / 2;


/***/ }),

/***/ "./src/utils/math.ts":
/*!***************************!*\
  !*** ./src/utils/math.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mod": () => (/* binding */ mod),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "floor": () => (/* binding */ floor),
/* harmony export */   "ceil": () => (/* binding */ ceil),
/* harmony export */   "toRad": () => (/* binding */ toRad),
/* harmony export */   "toMIDI": () => (/* binding */ toMIDI),
/* harmony export */   "atodb": () => (/* binding */ atodb),
/* harmony export */   "dbtoa": () => (/* binding */ dbtoa),
/* harmony export */   "iNormExp": () => (/* binding */ iNormExp),
/* harmony export */   "normExp": () => (/* binding */ normExp),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "scaleClip": () => (/* binding */ scaleClip),
/* harmony export */   "isIdentityMatrix": () => (/* binding */ isIdentityMatrix),
/* harmony export */   "identityMatrix": () => (/* binding */ identityMatrix)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/utils.ts");

const mod = (x, y) => (x % y + y) % y;
const round = (x, to) => Math.abs(to) < 1 ? Math.round(x * (1 / to)) / (1 / to) : Math.round(x / to) * to;
const floor = (x, to) => Math.abs(to) < 1 ? Math.floor(x * (1 / to)) / (1 / to) : Math.floor(x / to) * to;
const ceil = (x, to) => Math.abs(to) < 1 ? Math.ceil(x * (1 / to)) / (1 / to) : Math.ceil(x / to) * to;
const toRad = (degrees) => degrees * Math.PI / 180;
const toMIDI = (f) => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
const atodb = (a) => 20 * Math.log10(a);
const dbtoa = (db) => 10 ** (db / 20);
const iNormExp = (x, e) => Math.max(0, x) ** 1.5 ** -e;
const normExp = (x, e) => Math.max(0, x) ** 1.5 ** e;
const scale = (x, l1, h1, l2, h2) => {
  const r1 = h1 - l1;
  const r2 = h2 - l2;
  return (x - l1) / r1 * r2 + l2;
};
const scaleClip = (x, l1, h1, l2, h2) => Math.max(l2, Math.min(h2, scale(x, l1, h1, l2, h2)));
const isIdentityMatrix = (x) => {
  return Array.isArray(x) && x.every((row, i) => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumberArray)(row) && row.length === x.length && row.every((e, j) => e === (j === i ? 1 : 0)));
};
const identityMatrix = (dim) => new Array(dim).fill(void 0).map((x, i) => new Array(dim).fill(void 0).map((y, j) => +(i === j)));


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "uuid": () => (/* binding */ uuid),
/* harmony export */   "getTimestamp": () => (/* binding */ getTimestamp),
/* harmony export */   "isStringArray": () => (/* binding */ isStringArray),
/* harmony export */   "isNumberArray": () => (/* binding */ isNumberArray),
/* harmony export */   "isTRect": () => (/* binding */ isTRect),
/* harmony export */   "isTPresentationRect": () => (/* binding */ isTPresentationRect),
/* harmony export */   "isRectMovable": () => (/* binding */ isRectMovable),
/* harmony export */   "isRectResizable": () => (/* binding */ isRectResizable),
/* harmony export */   "isMIDIEvent": () => (/* binding */ isMIDIEvent),
/* harmony export */   "stringifyError": () => (/* binding */ stringifyError),
/* harmony export */   "parseToPrimitive": () => (/* binding */ parseToPrimitive),
/* harmony export */   "rgbaMax2Css": () => (/* binding */ rgbaMax2Css),
/* harmony export */   "css2RgbaMax": () => (/* binding */ css2RgbaMax),
/* harmony export */   "chunkArray": () => (/* binding */ chunkArray),
/* harmony export */   "decodeBPF": () => (/* binding */ decodeBPF),
/* harmony export */   "decodeCurve": () => (/* binding */ decodeCurve),
/* harmony export */   "decodeLine": () => (/* binding */ decodeLine),
/* harmony export */   "detectOS": () => (/* binding */ detectOS),
/* harmony export */   "detectBrowserCore": () => (/* binding */ detectBrowserCore),
/* harmony export */   "roundedRect": () => (/* binding */ roundedRect),
/* harmony export */   "fillRoundedRect": () => (/* binding */ fillRoundedRect),
/* harmony export */   "selectElementRange": () => (/* binding */ selectElementRange),
/* harmony export */   "selectElementPos": () => (/* binding */ selectElementPos),
/* harmony export */   "findFromAscendants": () => (/* binding */ findFromAscendants),
/* harmony export */   "getPropertyDescriptor": () => (/* binding */ getPropertyDescriptor),
/* harmony export */   "getPropertyDescriptors": () => (/* binding */ getPropertyDescriptors),
/* harmony export */   "extToType": () => (/* binding */ extToType),
/* harmony export */   "max2js": () => (/* binding */ max2js),
/* harmony export */   "js2max": () => (/* binding */ js2max),
/* harmony export */   "convertSampleToUnit": () => (/* binding */ convertSampleToUnit),
/* harmony export */   "MEASURE_UNIT_REGEX": () => (/* binding */ MEASURE_UNIT_REGEX),
/* harmony export */   "TIME_UNIT_REGEX": () => (/* binding */ TIME_UNIT_REGEX),
/* harmony export */   "convertUnitToSample": () => (/* binding */ convertUnitToSample),
/* harmony export */   "ab2sab": () => (/* binding */ ab2sab),
/* harmony export */   "sab2ab": () => (/* binding */ sab2ab),
/* harmony export */   "ab2str": () => (/* binding */ ab2str),
/* harmony export */   "str2ab": () => (/* binding */ str2ab),
/* harmony export */   "getFactors": () => (/* binding */ getFactors),
/* harmony export */   "getRuler": () => (/* binding */ getRuler)
/* harmony export */ });
const uuid = () => {
  var _a;
  return ((_a = globalThis == null ? void 0 : globalThis.crypto) == null ? void 0 : _a.randomUUID) ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
const getTimestamp = () => {
  if (globalThis.performance) {
    return performance.now() + (performance.timeOrigin || performance.timing.navigationStart);
  }
  return Date.now();
};
const isStringArray = (x) => Array.isArray(x) && x.every((e) => typeof e === "string");
const isNumberArray = (x) => Array.isArray(x) && x.every((e) => typeof e === "number");
const isTRect = (x) => {
  return isNumberArray(x) && x.length === 4 && x[0] >= 0 && x[1] >= 0 && x[2] >= 15 && x[3] >= 15;
};
const isTPresentationRect = (x) => {
  return Array.isArray(x) && x.length === 4 && x.every((v) => typeof v === "number" || typeof v === "string");
};
const isRectMovable = (x) => {
  return isTPresentationRect(x) && typeof x[0] === "number" && typeof x[1] === "number";
};
const isRectResizable = (x) => isTRect(x);
const isMIDIEvent = (x) => (isNumberArray(x) || x instanceof Uint8Array) && x.length === 3;
const stringifyError = (data) => {
  if (typeof data === "string")
    return data;
  if (data instanceof Error)
    return data.message;
  if (typeof data === "object")
    return JSON.stringify(data);
  return `${data}`;
};
const parseToPrimitive = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value.toString();
  }
};
const rgbaMax2Css = (maxColor) => {
  const cssColor = [255, 255, 255, 1];
  if (Array.isArray(maxColor)) {
    for (let i = 0; i < 3; i++) {
      if (typeof maxColor[i] === "number")
        cssColor[i] = Math.floor(maxColor[i] * 255);
    }
    if (typeof maxColor[3] === "number")
      cssColor[3] = maxColor[3];
  }
  return `rgba(${cssColor.join(",")})`;
};
const css2RgbaMax = (color) => {
  const maxColor = [0.2, 0.2, 0.2, 1];
  const matched = color.match(/rgba\((.+)\)/);
  if (!matched)
    return maxColor;
  const cssColor = matched[1].split(",").map((s) => +s);
  for (let i = 0; i < 3; i++) {
    if (typeof cssColor[i] === "number")
      maxColor[i] = cssColor[i] / 255;
    if (typeof cssColor[3] === "number")
      maxColor[3] = cssColor[3];
  }
  return maxColor;
};
const chunkArray = (array, perChunk) => {
  return array.reduce((acc, cur, idx) => {
    const i = ~~(idx / perChunk);
    acc[i] = [...acc[i] || [], cur];
    return acc;
  }, []);
};
const decodeBPF = (sIn, tupleLength) => {
  if (typeof sIn === "number")
    return [[sIn]];
  if (isNumberArray(sIn))
    return chunkArray(sIn, tupleLength);
  if (Array.isArray(sIn) && sIn.every((a) => isNumberArray(a)))
    return sIn;
  if (typeof sIn !== "string")
    throw new Error("Failed to decode curve.");
  const numbers = sIn.split(" ").filter((s) => !!s).map((s) => +s);
  if (numbers.find((v) => !isFinite(v)))
    throw new Error("BPF contains invalid number.");
  return chunkArray(numbers, tupleLength);
};
const decodeCurve = (sIn) => decodeBPF(sIn, 3);
const decodeLine = (sIn) => decodeBPF(sIn, 2);
const detectOS = () => {
  const { appVersion } = navigator;
  if (appVersion.indexOf("Win") !== -1)
    return "Windows";
  if (appVersion.indexOf("Mac") !== -1)
    return "MacOS";
  if (appVersion.indexOf("X11") !== -1)
    return "UNIX";
  if (appVersion.indexOf("Linux") !== -1)
    return "Linux";
  return "Unknown";
};
const detectBrowserCore = () => {
  if (window.chrome)
    return "Chromium";
  if (window.InstallTrigger)
    return "Gecko";
  if (navigator.vendor.indexOf("Apple") !== -1)
    return "WebKit";
  return "Unknown";
};
const roundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number")
    radii.fill(radius);
  else
    radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.stroke();
};
const fillRoundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number")
    radii.fill(radius);
  else
    radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.fill();
};
const selectElementRange = (e) => {
  const elementIsEditable = (e2) => !!e2.nodeName.match(/^(INPUT|TEXTAREA)$/i);
  const selection = window.getSelection();
  if (elementIsEditable(e)) {
    e.focus();
    e.select();
    return;
  }
  if (selection.setBaseAndExtent) {
    selection.setBaseAndExtent(e, 0, e, e.hasChildNodes() ? 1 : 0);
    return;
  }
  if (selection.addRange && selection.removeAllRanges && document.createRange) {
    const range = document.createRange();
    range.selectNodeContents(e);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
const selectElementPos = (e, pos) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(e.childNodes[0], pos);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};
const findFromAscendants = (e, predict) => {
  const ascendants = [];
  let parent = e.parentElement;
  while (parent !== document.body) {
    ascendants.push(parent);
    parent = parent.parentElement;
  }
  return ascendants.find(predict);
};
const getPropertyDescriptor = (obj, key) => {
  return Object.getOwnPropertyDescriptor(obj, key) || getPropertyDescriptor(Object.getPrototypeOf(obj), key);
};
const getPropertyDescriptors = (obj) => {
  if (typeof obj === "function")
    return Object.getOwnPropertyDescriptors(obj);
  const proto = Object.getPrototypeOf(obj);
  if (obj !== Object.prototype && proto === Object.prototype)
    return Object.getOwnPropertyDescriptors(obj);
  return Object.assign(proto ? getPropertyDescriptors(proto) : {}, Object.getOwnPropertyDescriptors(obj));
};
const extToType = (ext) => {
  if (["jspat", "maxpat", "gendsp", "dsppat"].indexOf(ext) !== -1)
    return "patcher";
  if (["wav", "aif", "aiff", "mp3", "aac", "flac", "ogg", "m4a"].indexOf(ext) !== -1)
    return "audio";
  if (["txt", "json"].indexOf(ext) !== -1)
    return "text";
  if (["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp", "bmp", "ico", "cur", "tif", "tiff"].indexOf(ext) !== -1)
    return "image";
  if (["mp4", "webm", "3gp"].indexOf(ext) !== -1)
    return "video";
  return "unknown";
};
const max2js = (patcherIn, mode = "max") => {
  const patcher = { boxes: {}, lines: {} };
  const maxPatcher = patcherIn.patcher;
  patcher.props = {
    bgColor: rgbaMax2Css(maxPatcher.bgcolor),
    editingBgColor: rgbaMax2Css(maxPatcher.editing_bgcolor),
    dependencies: [],
    grid: maxPatcher.gridsize,
    openInPresentation: !!maxPatcher.openinpresentation,
    mode
  };
  const maxBoxes = maxPatcher.boxes;
  const maxLines = maxPatcher.lines;
  for (let i = 0; i < maxBoxes.length; i++) {
    const maxBox = maxBoxes[i].box;
    const numID = parseInt(maxBox.id.match(/\d+/)[0]);
    const id = "box-" + numID;
    patcher.boxes[id] = {
      id,
      inlets: maxBox.numinlets,
      outlets: maxBox.numoutlets,
      rect: maxBox.patching_rect,
      presentationRect: maxBox.presentation_rect,
      background: !!maxBox.background,
      presentation: !!maxBox.presentation,
      text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
    };
  }
  for (let i = 0; i < maxLines.length; i++) {
    const lineArgs = maxLines[i].patchline;
    const id = "line-" + i;
    patcher.lines[id] = {
      id,
      src: [lineArgs.source[0].replace(/obj/, "box"), lineArgs.source[1]],
      dest: [lineArgs.destination[0].replace(/obj/, "box"), lineArgs.destination[1]]
    };
  }
  return patcher;
};
const js2max = (patcherIn) => {
  const maxPatcher = {
    boxes: [],
    lines: [],
    rect: void 0,
    bgcolor: css2RgbaMax(patcherIn.props.bgColor),
    editing_bgcolor: css2RgbaMax(patcherIn.props.editingBgColor),
    gridsize: patcherIn.props.grid,
    openinpresentation: +patcherIn.props.openInPresentation
  };
  for (const id in patcherIn.boxes) {
    const box = patcherIn.boxes[id];
    const numID = parseInt(id.match(/\d+/)[0]);
    maxPatcher.boxes.push({
      box: {
        id: `obj-${numID}`,
        maxclass: "newobj",
        numinlets: box.inlets,
        numoutlets: box.outlets,
        patching_rect: box.rect,
        presentation: +box.presentation,
        background: +box.background,
        text: box.text
      }
    });
  }
  for (const id in patcherIn.lines) {
    const line = patcherIn.lines[id];
    maxPatcher.lines.push({
      patchline: {
        source: [line.src[0].replace(/box/, "obj"), line.src[1]],
        destination: [line.dest[0].replace(/box/, "obj"), line.dest[1]]
      }
    });
  }
  return { patcher: maxPatcher };
};
const convertSampleToUnit = (sample, unit, { sampleRate = 48e3, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
  if (unit === "sample")
    return { unit, str: sample.toString(), value: sample, values: [sample] };
  const milliseconds = sample * 1e3 / sampleRate;
  const roundedMs = Math.round(milliseconds);
  if (unit === "measure") {
    const dpms = bpm * division / 6e4;
    const totalDivisions = dpms * milliseconds;
    const roundedTotalDivisions = dpms * milliseconds;
    const divisions = ~~(roundedTotalDivisions % division);
    const beats = ~~(roundedTotalDivisions / division) % beatsPerMeasure + 1;
    const measure = ~~(roundedTotalDivisions / beatsPerMeasure / division) + 1;
    const str2 = `${measure}:${beats}.${divisions.toString().padStart(2, "0")}`;
    return { unit, str: str2, value: totalDivisions / division, values: [measure, beats, divisions] };
  }
  const ms = roundedMs % 1e3;
  const s = ~~(roundedMs / 1e3) % 60;
  const min = ~~(roundedMs / 6e4) % 60;
  const h = ~~(roundedMs / 36e5);
  const str = !min ? `${s}.${ms.toString().padStart(3, "0")}` : !h ? `${min}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}` : `${h}:${min.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  return { unit, str, value: milliseconds / 1e3, values: [h, min, s, ms] };
};
const MEASURE_UNIT_REGEX = /^((\d+):)?(\d+)\.?(\d+)?$/;
const TIME_UNIT_REGEX = /^((\d+):)??((\d+):)?(\d+)\.?(\d+)?$/;
const convertUnitToSample = (str, unit, { sampleRate = 48e3, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
  if (unit === "sample")
    return +str || 0;
  if (unit === "measure") {
    const matched2 = str.match(MEASURE_UNIT_REGEX);
    if (!matched2)
      throw new Error(`String ${str} cannot be parsed to ${unit}`);
    const [, , measureIn, beatsIn, divisionsIn] = matched2;
    const bps = bpm / 60;
    const samplesPerBeat = sampleRate / bps;
    let measures = +measureIn || 0;
    let beats = +beatsIn || 0;
    let divisions = +divisionsIn || 0;
    beats += ~~(divisions / division);
    divisions %= division;
    measures += ~~(beats / beatsPerMeasure);
    beats %= beatsPerMeasure;
    return (measures * beatsPerMeasure + beats + divisions / division) * samplesPerBeat;
  }
  const matched = str.match(TIME_UNIT_REGEX);
  if (!matched)
    throw new Error(`String ${str} cannot be parsed to ${unit}`);
  const [, , hIn, , minIn, sIn, msIn] = matched;
  let h = +hIn || 0;
  let min = +minIn || 0;
  let s = +sIn || 0;
  let ms = +msIn || 0;
  s += ~~(ms / 1e3);
  ms %= 1e3;
  min += ~~(s / 60);
  s %= 60;
  h += ~~(min / 60);
  min %= 60;
  return (h * 3600 + min * 60 + s + ms / 1e3) * sampleRate;
};
const ab2sab = (ab) => {
  if (ab instanceof ArrayBuffer)
    return ab;
  const sab = new SharedArrayBuffer(ab.byteLength);
  const ui8ab = new Uint8Array(ab);
  const ui8sab = new Uint8Array(sab);
  for (let i = 0; i < ui8ab.length; i++) {
    ui8sab[i] = ui8ab[i];
  }
  return sab;
};
const sab2ab = (sab) => {
  if (sab instanceof SharedArrayBuffer)
    return sab;
  const ab = new ArrayBuffer(sab.byteLength);
  const ui8ab = new Uint8Array(ab);
  const ui8sab = new Uint8Array(sab);
  for (let i = 0; i < ui8sab.length; i++) {
    ui8ab[i] = ui8sab[i];
  }
  return ab;
};
const ab2str = (buf) => {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
};
const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length * 2);
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
const getFactors = (n) => {
  const factors = [1];
  let i = 2;
  while (i < Math.sqrt(n)) {
    if (n % i === 0)
      factors.push(i, n / i);
    i++;
  }
  return factors.sort((a, b) => a - b);
};
const getRuler = (range, unit, { sampleRate = 48e3, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
  const ruler = {};
  const length = range[1] - range[0];
  let coarse;
  let refined;
  if (unit === "sample") {
    const steps = [1, 2, 5];
    let mag = 1;
    let step = 0;
    do {
      const grid = steps[step] * mag;
      if (step + 1 < steps.length) {
        step++;
      } else {
        step = 0;
        mag *= 10;
      }
      if (!coarse && length / grid <= 10)
        coarse = grid;
      if (!refined && length / grid <= 50)
        refined = grid;
    } while (!coarse || !refined);
  } else if (unit === "measure") {
    const bps = bpm / 60;
    const samplesPerBeat = sampleRate / bps;
    const divisionFactors = getFactors(division);
    const beatsFactors = getFactors(beatsPerMeasure);
    const measureFactors = [1, 2, 5];
    let actualUnit = "division";
    let mag = 1;
    let step = 0;
    do {
      const grid = actualUnit === "division" ? samplesPerBeat * divisionFactors[step] / division : actualUnit === "beat" ? samplesPerBeat * beatsFactors[step] : samplesPerBeat * measureFactors[step] * mag * beatsPerMeasure;
      if (actualUnit === "division") {
        if (step + 1 < divisionFactors.length) {
          step++;
        } else {
          actualUnit = "beat";
          step = 0;
        }
      } else if (actualUnit === "beat") {
        if (step + 1 < beatsFactors.length) {
          step++;
        } else {
          actualUnit = "measure";
          step = 0;
        }
      } else {
        if (step + 1 < measureFactors.length) {
          step++;
        } else {
          step = 0;
          mag *= 10;
        }
      }
      if (!coarse && length / grid <= 10)
        coarse = grid;
      if (!refined && length / grid <= 50)
        refined = grid;
    } while (!coarse || !refined);
  } else {
    const msFactors = [1, 2, 5, 10, 20, 50, 100, 200, 500];
    const sFactors = getFactors(60);
    const minFactors = sFactors;
    const hFactors = [1, 2, 5];
    let actualUnit = "ms";
    let mag = 1;
    let step = 0;
    do {
      const grid = actualUnit === "ms" ? sampleRate * msFactors[step] / 1e3 : actualUnit === "s" ? sampleRate * sFactors[step] : actualUnit === "min" ? sampleRate * minFactors[step] * 60 : sampleRate * hFactors[step] * mag * 60;
      if (actualUnit === "ms") {
        if (step + 1 < msFactors.length) {
          step++;
        } else {
          actualUnit = "s";
          step = 0;
        }
      } else if (actualUnit === "s") {
        if (step + 1 < sFactors.length) {
          step++;
        } else {
          actualUnit = "min";
          step = 0;
        }
      } else if (actualUnit === "min") {
        if (step + 1 < minFactors.length) {
          step++;
        } else {
          actualUnit = "h";
          step = 0;
        }
      } else {
        if (step + 1 < hFactors.length) {
          step++;
        } else {
          step = 0;
          mag *= 10;
        }
      }
      if (!coarse && length / grid <= 10)
        coarse = grid;
      if (!refined && length / grid <= 50)
        refined = grid;
    } while (!coarse || !refined);
  }
  let m = ~~(range[0] / refined);
  if (m * refined < range[0])
    m++;
  while (m * refined < range[1]) {
    const t = m * refined;
    if (t && t % coarse < 1e-3 || coarse - t % coarse < 1e-3) {
      ruler[t] = unit === "sample" ? t.toString() : convertSampleToUnit(t, unit, { sampleRate, bpm, beatsPerMeasure, division }).str.replace(/\.[0.]+$/, "");
    } else {
      ruler[t] = "";
    }
    m++;
  }
  return { ruler, coarse, refined };
};


/***/ }),

/***/ "./src/utils/yin.ts":
/*!**************************!*\
  !*** ./src/utils/yin.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const detect = (bufferIn, paramsIn) => {
  const { threshold = 0.1, sampleRate = 48e3, probabilityThreshold = 0.1 } = paramsIn;
  let bufferSize = 1;
  while (bufferSize < bufferIn.length) {
    bufferSize *= 2;
  }
  bufferSize /= 2;
  const yinBufferSize = bufferSize / 2;
  const yinBuffer = new Float32Array(yinBufferSize);
  let prob = 0;
  let tau;
  let delta;
  for (let t = 1; t < yinBufferSize; t++) {
    for (let i = 0; i < yinBufferSize; i++) {
      delta = bufferIn[i] - bufferIn[i + t];
      yinBuffer[t] += delta * delta;
    }
  }
  yinBuffer[0] = 1;
  yinBuffer[1] = 1;
  let runningSum = 0;
  for (let t = 1; t < yinBufferSize; t++) {
    runningSum += yinBuffer[t];
    yinBuffer[t] *= t / runningSum;
  }
  for (tau = 2; tau < yinBufferSize; tau++) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < yinBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      prob = 1 - yinBuffer[tau];
      break;
    }
  }
  if (tau === yinBufferSize || yinBuffer[tau] >= threshold) {
    return null;
  }
  if (prob < probabilityThreshold) {
    return null;
  }
  let betterTau;
  let x0;
  let x2;
  if (tau < 1) {
    x0 = tau;
  } else {
    x0 = tau - 1;
  }
  if (tau + 1 < yinBufferSize) {
    x2 = tau + 1;
  } else {
    x2 = tau;
  }
  if (x0 === tau) {
    if (yinBuffer[tau] <= yinBuffer[x2]) {
      betterTau = tau;
    } else {
      betterTau = x2;
    }
  } else if (x2 === tau) {
    if (yinBuffer[tau] <= yinBuffer[x0]) {
      betterTau = tau;
    } else {
      betterTau = x0;
    }
  } else {
    const s0 = yinBuffer[x0];
    const s1 = yinBuffer[tau];
    const s2 = yinBuffer[x2];
    betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
  }
  return sampleRate / betterTau;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (detect);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.js??ruleSet[1].rules[2].use!./src/core/worklets/TemporalAnalyser.worklet.ts ***!
  \****************************************************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/buffer */ "./src/utils/buffer.ts");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _utils_yin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/yin */ "./src/utils/yin.ts");
/* harmony import */ var _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AudioWorkletProxyProcessor */ "./src/core/worklets/AudioWorkletProxyProcessor.ts");




const processorId = "__JSPatcher_TemporalAnalyser";
if (!globalThis.SharedArrayBuffer)
  globalThis.SharedArrayBuffer = ArrayBuffer;
const { registerProcessor, sampleRate } = globalThis;
class TemporalAnalyserAtoms {
  get $read() {
    return this._$read[0];
  }
  set $read(value) {
    this._$read[0] = value;
  }
  get $write() {
    return this._$write[0];
  }
  set $write(value) {
    this._$write[0] = value;
  }
  get $total() {
    return this._$total[0];
  }
  set $total(value) {
    this._$total[0] = value;
  }
  get asObject() {
    return { $write: this._$write, $read: this._$read, $total: this._$total };
  }
  constructor() {
    this._sab = new SharedArrayBuffer(3 * Uint32Array.BYTES_PER_ELEMENT);
    this._$read = new Uint32Array(this._sab, 0, 1);
    this._$write = new Uint32Array(this._sab, 4, 1);
    this._$total = new Uint32Array(this._sab, 8, 1);
  }
}
class TemporalAnalyserProcessor extends _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_3__["default"] {
  constructor() {
    super(...arguments);
    this.destroyed = false;
    this.atoms = new TemporalAnalyserAtoms();
    this.windowSab = [];
    this.window = [];
    this._windowSize = 1024;
  }
  static get parameterDescriptors() {
    return [{
      defaultValue: 1024,
      maxValue: 2 ** 32,
      minValue: 128,
      name: "windowSize"
    }];
  }
  get $read() {
    return this.atoms.$read;
  }
  set $read(value) {
    this.atoms.$read = value;
  }
  get $write() {
    return this.atoms.$write;
  }
  set $write(value) {
    this.atoms.$write = value;
  }
  get $total() {
    return this.atoms.$total;
  }
  set $total(value) {
    this.atoms.$total = value;
  }
  getRms() {
    return this.window.map((a) => (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.rms)(a, this.$read, this.windowSize));
  }
  getAbsMax() {
    return this.window.map((a) => (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.absMax)(a, this.$read, this.windowSize));
  }
  getZcr() {
    return this.window.map((a) => (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.zcr)(a, this.$read, this.windowSize));
  }
  getEstimatedFreq(threshold, probabilityThreshold) {
    return this.window.map((ch) => (0,_utils_yin__WEBPACK_IMPORTED_MODULE_2__["default"])(ch, { sampleRate, threshold, probabilityThreshold }));
  }
  getBuffer() {
    const data = this.window;
    const { $read, $write, $total } = this.atoms.asObject;
    return { data, $read, $write, $total };
  }
  gets(...analysis) {
    const result = {};
    for (const key of analysis) {
      if (typeof key !== "string" || !key.length)
        continue;
      const method = `get${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (this[method])
        result[key] = this[method]();
    }
    return result;
  }
  destroy() {
    this.destroyed = true;
    this._disposed = true;
  }
  get windowSize() {
    return this._windowSize;
  }
  set windowSize(sizeIn) {
    this._windowSize = ~~Math.min(2 ** 32, Math.max(128, sizeIn || 1024));
  }
  process(inputs, outputs, parameters) {
    if (this.destroyed)
      return false;
    const input = inputs[0];
    this.windowSize = ~~parameters.windowSize[0];
    const { windowSize } = this;
    if (this.window.length > input.length) {
      this.windowSab.splice(input.length);
      this.window.splice(input.length);
    }
    if (input.length === 0)
      return true;
    const bufferSize = Math.max(...input.map((c) => c.length)) || 128;
    const dataSize = windowSize + sampleRate;
    this.$write %= dataSize;
    this.$total += bufferSize;
    let { $write } = this;
    for (let i = 0; i < input.length; i++) {
      $write = this.$write;
      if (!this.window[i]) {
        this.windowSab[i] = new SharedArrayBuffer(dataSize * Float32Array.BYTES_PER_ELEMENT);
        this.window[i] = new Float32Array(this.windowSab[i]);
      } else {
        if (this.window[i].length !== dataSize) {
          const oldWindow = this.window[i];
          const windowSab = new SharedArrayBuffer(dataSize * Float32Array.BYTES_PER_ELEMENT);
          const window = new Float32Array(windowSab);
          $write = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.setTypedArray)(window, oldWindow, 0, $write - Math.min(dataSize, oldWindow.length));
          this.windowSab[i] = windowSab;
          this.window[i] = window;
        }
      }
    }
    this.$write = $write;
    for (let i = 0; i < input.length; i++) {
      const window = this.window[i];
      const channel = input[i].length ? input[i] : new Float32Array(bufferSize);
      if (bufferSize > dataSize) {
        $write = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.setTypedArray)(window, channel.subarray(bufferSize - dataSize), this.$write);
      } else {
        $write = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.setTypedArray)(window, channel, this.$write);
      }
    }
    this.$write = $write;
    this.$read = (0,_utils_math__WEBPACK_IMPORTED_MODULE_1__.mod)($write - windowSize, dataSize);
    return true;
  }
}
try {
  registerProcessor(processorId, TemporalAnalyserProcessor);
} catch (error) {
  console.warn(error);
}

})();

/******/ })()
;
//# sourceMappingURL=e669d9f16f8595e2df80.worklet.js.map