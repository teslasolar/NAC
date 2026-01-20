/**
 * TagValue - Tag value with quality and timestamp metadata
 *
 * Implements OPC UA-style tag values with quality codes.
 *
 * @module digitaltwin/tags/helpers/TagValue
 */

/**
 * Tag data types (similar to IEC 61131-3)
 */
export const TagDataType = {
  BOOL: 'BOOL',
  INT: 'INT',
  DINT: 'DINT',
  LINT: 'LINT',
  REAL: 'REAL',
  STRING: 'STRING',
  ARRAY: 'ARRAY',
  UDT: 'UDT'
};

/**
 * Tag quality codes (OPC UA style)
 */
export const TagQuality = {
  GOOD: 192,
  GOOD_LOCAL_OVERRIDE: 216,
  UNCERTAIN: 64,
  BAD: 0,
  BAD_NOT_CONNECTED: 8,
  BAD_DEVICE_FAILURE: 12,
  BAD_SENSOR_FAILURE: 16,
  BAD_LAST_KNOWN_VALUE: 20,
  BAD_COMM_FAILURE: 24,
  BAD_OUT_OF_SERVICE: 28
};

/**
 * Check if quality code indicates good quality
 * @param {number} quality - Quality code
 * @returns {boolean}
 */
export function isGoodQuality(quality) {
  return quality >= 192;
}

/**
 * Get quality description string
 * @param {number} quality - Quality code
 * @returns {string}
 */
export function getQualityString(quality) {
  for (const [name, value] of Object.entries(TagQuality)) {
    if (value === quality) return name;
  }
  return `UNKNOWN_${quality}`;
}

/**
 * Single tag value with metadata
 */
export class TagValue {
  constructor(value, quality = TagQuality.GOOD, timestamp = Date.now()) {
    this.value = value;
    this.quality = quality;
    this.timestamp = timestamp;
    this.sourceTimestamp = timestamp;
    this.serverTimestamp = timestamp;
  }

  isGood() {
    return this.quality >= 192;
  }

  toJSON() {
    return {
      value: this.value,
      quality: this.quality,
      timestamp: this.timestamp
    };
  }
}

export default TagValue;
