// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');

// for markdown conversion
const md = require('markdown-it')();
// for image conversion
const sharp = require('sharp');

// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created = new Date(), updated = new Date(), type, size = 0 }) {
    // TODO
    if (!ownerId || !type) {
      throw new Error(`ownerId and type are required`);
    }
    if (size < 0 || typeof size != 'number') {
      throw new Error(`size should be a number and cannot be negative`);
    }
    if (
      type != 'text/plain' &&
      type != 'text/plain; charset=utf-8' &&
      type != 'text/markdown' &&
      type != 'text/html' &&
      type != 'application/json' &&
      type != 'image/png' &&
      type != 'image/jpeg' &&
      type != 'image/webp' &&
      type != 'image/gif'
    ) {
      throw new Error(`this type is not supported`);
    }
    this.id = id || nanoid();
    this.created = created || created.toLocaleString();
    this.updated = updated || updated.toISOString();
    this.ownerId = ownerId;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const ret = await readFragment(ownerId, id);
    if (!ret) {
      throw new Error('Is not found');
    }
    return new Fragment(ret);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    // TODO
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    // TODO
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    if (!Buffer.isBuffer(data)) {
      throw new Error('data is not a Buffer');
    }
    this.size = Buffer.byteLength(data);
    await this.save();
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    // TODO
    if (/(text\/)+/.test(this.mimeType)) {
      return true;
    }
    return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    const plainCon = ['text/plain'];
    const mdCon = ['text/plain', 'text/markdown', 'text/html'];
    const htmlCon = ['text/html', 'text/plain'];
    const jsonCon = ['application/json', 'text/plain'];
    const imgCon = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    switch (this.mimeType) {
      case 'text/plain':
        return plainCon;
      case 'text/markdown':
        return mdCon;
      case 'text/html':
        return htmlCon;
      case 'application/json':
        return jsonCon;
      case 'image/png':
        return imgCon;
      case 'image/jpeg':
        return imgCon;
      case 'image/gif':
        return imgCon;
      case 'image/webp':
        return imgCon;
      default:
        return [this.mimeType];
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    if (
      value === 'text/plain' ||
      value === 'text/plain; charset=utf-8' ||
      value === 'text/markdown' ||
      value === 'text/html' ||
      value === 'application/json' ||
      value === 'image/png' ||
      value === 'image/jpeg' ||
      value === 'image/webp' ||
      value === 'image/gif'
    ) {
      return true;
    }
    return false;
  }
  convertData(data, type) {
    switch (type) {
      case 'text/html':
        if (this.type === 'text/markdown') {
          return md.render(data.toString());
        }
        return data;
      case 'image/png':
        return sharp(data).toFormat('png');
      case 'image/jpeg':
        return sharp(data).toFormat('jpeg');
      case 'image/gif':
        return sharp(data).toFormat('gif');
      case 'image/webp':
        return sharp(data).toFormat('webp');
      case 'text/plain':
        return data.toString();
      default:
        return data;
    }
  }
}

module.exports.Fragment = Fragment;
