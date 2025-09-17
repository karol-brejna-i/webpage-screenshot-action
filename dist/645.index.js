exports.id = 645;
exports.ids = [645];
exports.modules = {

/***/ 73057:
/***/ ((module) => {

function isBuffer (value) {
  return Buffer.isBuffer(value) || value instanceof Uint8Array
}

function isEncoding (encoding) {
  return Buffer.isEncoding(encoding)
}

function alloc (size, fill, encoding) {
  return Buffer.alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  return Buffer.allocUnsafe(size)
}

function allocUnsafeSlow (size) {
  return Buffer.allocUnsafeSlow(size)
}

function byteLength (string, encoding) {
  return Buffer.byteLength(string, encoding)
}

function compare (a, b) {
  return Buffer.compare(a, b)
}

function concat (buffers, totalLength) {
  return Buffer.concat(buffers, totalLength)
}

function copy (source, target, targetStart, start, end) {
  return toBuffer(source).copy(target, targetStart, start, end)
}

function equals (a, b) {
  return toBuffer(a).equals(b)
}

function fill (buffer, value, offset, end, encoding) {
  return toBuffer(buffer).fill(value, offset, end, encoding)
}

function from (value, encodingOrOffset, length) {
  return Buffer.from(value, encodingOrOffset, length)
}

function includes (buffer, value, byteOffset, encoding) {
  return toBuffer(buffer).includes(value, byteOffset, encoding)
}

function indexOf (buffer, value, byfeOffset, encoding) {
  return toBuffer(buffer).indexOf(value, byfeOffset, encoding)
}

function lastIndexOf (buffer, value, byteOffset, encoding) {
  return toBuffer(buffer).lastIndexOf(value, byteOffset, encoding)
}

function swap16 (buffer) {
  return toBuffer(buffer).swap16()
}

function swap32 (buffer) {
  return toBuffer(buffer).swap32()
}

function swap64 (buffer) {
  return toBuffer(buffer).swap64()
}

function toBuffer (buffer) {
  if (Buffer.isBuffer(buffer)) return buffer
  return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}

function toString (buffer, encoding, start, end) {
  return toBuffer(buffer).toString(encoding, start, end)
}

function write (buffer, string, offset, length, encoding) {
  return toBuffer(buffer).write(string, offset, length, encoding)
}

function writeDoubleLE (buffer, value, offset) {
  return toBuffer(buffer).writeDoubleLE(value, offset)
}

function writeFloatLE (buffer, value, offset) {
  return toBuffer(buffer).writeFloatLE(value, offset)
}

function writeUInt32LE (buffer, value, offset) {
  return toBuffer(buffer).writeUInt32LE(value, offset)
}

function writeInt32LE (buffer, value, offset) {
  return toBuffer(buffer).writeInt32LE(value, offset)
}

function readDoubleLE (buffer, offset) {
  return toBuffer(buffer).readDoubleLE(offset)
}

function readFloatLE (buffer, offset) {
  return toBuffer(buffer).readFloatLE(offset)
}

function readUInt32LE (buffer, offset) {
  return toBuffer(buffer).readUInt32LE(offset)
}

function readInt32LE (buffer, offset) {
  return toBuffer(buffer).readInt32LE(offset)
}

function writeDoubleBE (buffer, value, offset) {
  return toBuffer(buffer).writeDoubleBE(value, offset)
}

function writeFloatBE (buffer, value, offset) {
  return toBuffer(buffer).writeFloatBE(value, offset)
}

function writeUInt32BE (buffer, value, offset) {
  return toBuffer(buffer).writeUInt32BE(value, offset)
}

function writeInt32BE (buffer, value, offset) {
  return toBuffer(buffer).writeInt32BE(value, offset)
}

function readDoubleBE (buffer, offset) {
  return toBuffer(buffer).readDoubleBE(offset)
}

function readFloatBE (buffer, offset) {
  return toBuffer(buffer).readFloatBE(offset)
}

function readUInt32BE (buffer, offset) {
  return toBuffer(buffer).readUInt32BE(offset)
}

function readInt32BE (buffer, offset) {
  return toBuffer(buffer).readInt32BE(offset)
}

module.exports = {
  isBuffer,
  isEncoding,
  alloc,
  allocUnsafe,
  allocUnsafeSlow,
  byteLength,
  compare,
  concat,
  copy,
  equals,
  fill,
  from,
  includes,
  indexOf,
  lastIndexOf,
  swap16,
  swap32,
  swap64,
  toBuffer,
  toString,
  write,
  writeDoubleLE,
  writeFloatLE,
  writeUInt32LE,
  writeInt32LE,
  readDoubleLE,
  readFloatLE,
  readUInt32LE,
  readInt32LE,
  writeDoubleBE,
  writeFloatBE,
  writeUInt32BE,
  writeInt32BE,
  readDoubleBE,
  readFloatBE,
  readUInt32BE,
  readInt32BE

}


/***/ }),

/***/ 31424:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var once = __webpack_require__(55560);

var noop = function() {};

var qnt = global.Bare ? queueMicrotask : process.nextTick.bind(process);

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		qnt(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 13587:
/***/ ((module) => {

module.exports = class FixedFIFO {
  constructor (hwm) {
    if (!(hwm > 0) || ((hwm - 1) & hwm) !== 0) throw new Error('Max size for a FixedFIFO should be a power of two')
    this.buffer = new Array(hwm)
    this.mask = hwm - 1
    this.top = 0
    this.btm = 0
    this.next = null
  }

  clear () {
    this.top = this.btm = 0
    this.next = null
    this.buffer.fill(undefined)
  }

  push (data) {
    if (this.buffer[this.top] !== undefined) return false
    this.buffer[this.top] = data
    this.top = (this.top + 1) & this.mask
    return true
  }

  shift () {
    const last = this.buffer[this.btm]
    if (last === undefined) return undefined
    this.buffer[this.btm] = undefined
    this.btm = (this.btm + 1) & this.mask
    return last
  }

  peek () {
    return this.buffer[this.btm]
  }

  isEmpty () {
    return this.buffer[this.btm] === undefined
  }
}


/***/ }),

/***/ 83867:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const FixedFIFO = __webpack_require__(13587)

module.exports = class FastFIFO {
  constructor (hwm) {
    this.hwm = hwm || 16
    this.head = new FixedFIFO(this.hwm)
    this.tail = this.head
    this.length = 0
  }

  clear () {
    this.head = this.tail
    this.head.clear()
    this.length = 0
  }

  push (val) {
    this.length++
    if (!this.head.push(val)) {
      const prev = this.head
      this.head = prev.next = new FixedFIFO(2 * this.head.buffer.length)
      this.head.push(val)
    }
  }

  shift () {
    if (this.length !== 0) this.length--
    const val = this.tail.shift()
    if (val === undefined && this.tail.next) {
      const next = this.tail.next
      this.tail.next = null
      this.tail = next
      return this.tail.shift()
    }

    return val
  }

  peek () {
    const val = this.tail.peek()
    if (val === undefined && this.tail.next) return this.tail.next.peek()
    return val
  }

  isEmpty () {
    return this.length === 0
  }
}


/***/ }),

/***/ 55560:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(58264)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 87898:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var once = __webpack_require__(55560)
var eos = __webpack_require__(31424)
var fs

try {
  fs = __webpack_require__(79896) // we only need fs to get the ReadStream and WriteStream prototypes
} catch (e) {}

var noop = function () {}
var ancient = typeof process === 'undefined' ? false : /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 36204:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { EventEmitter } = __webpack_require__(24434)
const STREAM_DESTROYED = new Error('Stream was destroyed')
const PREMATURE_CLOSE = new Error('Premature close')

const FIFO = __webpack_require__(83867)
const TextDecoder = __webpack_require__(97934)

// if we do a future major, expect queue microtask to be there always, for now a bit defensive
const qmt = typeof queueMicrotask === 'undefined' ? fn => global.process.nextTick(fn) : queueMicrotask

/* eslint-disable no-multi-spaces */

// 29 bits used total (4 from shared, 14 from read, and 11 from write)
const MAX = ((1 << 29) - 1)

// Shared state
const OPENING       = 0b0001
const PREDESTROYING = 0b0010
const DESTROYING    = 0b0100
const DESTROYED     = 0b1000

const NOT_OPENING = MAX ^ OPENING
const NOT_PREDESTROYING = MAX ^ PREDESTROYING

// Read state (4 bit offset from shared state)
const READ_ACTIVE           = 0b00000000000001 << 4
const READ_UPDATING         = 0b00000000000010 << 4
const READ_PRIMARY          = 0b00000000000100 << 4
const READ_QUEUED           = 0b00000000001000 << 4
const READ_RESUMED          = 0b00000000010000 << 4
const READ_PIPE_DRAINED     = 0b00000000100000 << 4
const READ_ENDING           = 0b00000001000000 << 4
const READ_EMIT_DATA        = 0b00000010000000 << 4
const READ_EMIT_READABLE    = 0b00000100000000 << 4
const READ_EMITTED_READABLE = 0b00001000000000 << 4
const READ_DONE             = 0b00010000000000 << 4
const READ_NEXT_TICK        = 0b00100000000000 << 4
const READ_NEEDS_PUSH       = 0b01000000000000 << 4
const READ_READ_AHEAD       = 0b10000000000000 << 4

// Combined read state
const READ_FLOWING = READ_RESUMED | READ_PIPE_DRAINED
const READ_ACTIVE_AND_NEEDS_PUSH = READ_ACTIVE | READ_NEEDS_PUSH
const READ_PRIMARY_AND_ACTIVE = READ_PRIMARY | READ_ACTIVE
const READ_EMIT_READABLE_AND_QUEUED = READ_EMIT_READABLE | READ_QUEUED
const READ_RESUMED_READ_AHEAD = READ_RESUMED | READ_READ_AHEAD

const READ_NOT_ACTIVE             = MAX ^ READ_ACTIVE
const READ_NON_PRIMARY            = MAX ^ READ_PRIMARY
const READ_NON_PRIMARY_AND_PUSHED = MAX ^ (READ_PRIMARY | READ_NEEDS_PUSH)
const READ_PUSHED                 = MAX ^ READ_NEEDS_PUSH
const READ_PAUSED                 = MAX ^ READ_RESUMED
const READ_NOT_QUEUED             = MAX ^ (READ_QUEUED | READ_EMITTED_READABLE)
const READ_NOT_ENDING             = MAX ^ READ_ENDING
const READ_PIPE_NOT_DRAINED       = MAX ^ READ_FLOWING
const READ_NOT_NEXT_TICK          = MAX ^ READ_NEXT_TICK
const READ_NOT_UPDATING           = MAX ^ READ_UPDATING
const READ_NO_READ_AHEAD          = MAX ^ READ_READ_AHEAD
const READ_PAUSED_NO_READ_AHEAD   = MAX ^ READ_RESUMED_READ_AHEAD

// Write state (18 bit offset, 4 bit offset from shared state and 14 from read state)
const WRITE_ACTIVE     = 0b00000000001 << 18
const WRITE_UPDATING   = 0b00000000010 << 18
const WRITE_PRIMARY    = 0b00000000100 << 18
const WRITE_QUEUED     = 0b00000001000 << 18
const WRITE_UNDRAINED  = 0b00000010000 << 18
const WRITE_DONE       = 0b00000100000 << 18
const WRITE_EMIT_DRAIN = 0b00001000000 << 18
const WRITE_NEXT_TICK  = 0b00010000000 << 18
const WRITE_WRITING    = 0b00100000000 << 18
const WRITE_FINISHING  = 0b01000000000 << 18
const WRITE_CORKED     = 0b10000000000 << 18

const WRITE_NOT_ACTIVE    = MAX ^ (WRITE_ACTIVE | WRITE_WRITING)
const WRITE_NON_PRIMARY   = MAX ^ WRITE_PRIMARY
const WRITE_NOT_FINISHING = MAX ^ (WRITE_ACTIVE | WRITE_FINISHING)
const WRITE_DRAINED       = MAX ^ WRITE_UNDRAINED
const WRITE_NOT_QUEUED    = MAX ^ WRITE_QUEUED
const WRITE_NOT_NEXT_TICK = MAX ^ WRITE_NEXT_TICK
const WRITE_NOT_UPDATING  = MAX ^ WRITE_UPDATING
const WRITE_NOT_CORKED    = MAX ^ WRITE_CORKED

// Combined shared state
const ACTIVE = READ_ACTIVE | WRITE_ACTIVE
const NOT_ACTIVE = MAX ^ ACTIVE
const DONE = READ_DONE | WRITE_DONE
const DESTROY_STATUS = DESTROYING | DESTROYED | PREDESTROYING
const OPEN_STATUS = DESTROY_STATUS | OPENING
const AUTO_DESTROY = DESTROY_STATUS | DONE
const NON_PRIMARY = WRITE_NON_PRIMARY & READ_NON_PRIMARY
const ACTIVE_OR_TICKING = WRITE_NEXT_TICK | READ_NEXT_TICK
const TICKING = ACTIVE_OR_TICKING & NOT_ACTIVE
const IS_OPENING = OPEN_STATUS | TICKING

// Combined shared state and read state
const READ_PRIMARY_STATUS = OPEN_STATUS | READ_ENDING | READ_DONE
const READ_STATUS = OPEN_STATUS | READ_DONE | READ_QUEUED
const READ_ENDING_STATUS = OPEN_STATUS | READ_ENDING | READ_QUEUED
const READ_READABLE_STATUS = OPEN_STATUS | READ_EMIT_READABLE | READ_QUEUED | READ_EMITTED_READABLE
const SHOULD_NOT_READ = OPEN_STATUS | READ_ACTIVE | READ_ENDING | READ_DONE | READ_NEEDS_PUSH | READ_READ_AHEAD
const READ_BACKPRESSURE_STATUS = DESTROY_STATUS | READ_ENDING | READ_DONE
const READ_UPDATE_SYNC_STATUS = READ_UPDATING | OPEN_STATUS | READ_NEXT_TICK | READ_PRIMARY
const READ_NEXT_TICK_OR_OPENING = READ_NEXT_TICK | OPENING

// Combined write state
const WRITE_PRIMARY_STATUS = OPEN_STATUS | WRITE_FINISHING | WRITE_DONE
const WRITE_QUEUED_AND_UNDRAINED = WRITE_QUEUED | WRITE_UNDRAINED
const WRITE_QUEUED_AND_ACTIVE = WRITE_QUEUED | WRITE_ACTIVE
const WRITE_DRAIN_STATUS = WRITE_QUEUED | WRITE_UNDRAINED | OPEN_STATUS | WRITE_ACTIVE
const WRITE_STATUS = OPEN_STATUS | WRITE_ACTIVE | WRITE_QUEUED | WRITE_CORKED
const WRITE_PRIMARY_AND_ACTIVE = WRITE_PRIMARY | WRITE_ACTIVE
const WRITE_ACTIVE_AND_WRITING = WRITE_ACTIVE | WRITE_WRITING
const WRITE_FINISHING_STATUS = OPEN_STATUS | WRITE_FINISHING | WRITE_QUEUED_AND_ACTIVE | WRITE_DONE
const WRITE_BACKPRESSURE_STATUS = WRITE_UNDRAINED | DESTROY_STATUS | WRITE_FINISHING | WRITE_DONE
const WRITE_UPDATE_SYNC_STATUS = WRITE_UPDATING | OPEN_STATUS | WRITE_NEXT_TICK | WRITE_PRIMARY
const WRITE_DROP_DATA = WRITE_FINISHING | WRITE_DONE | DESTROY_STATUS

const asyncIterator = Symbol.asyncIterator || Symbol('asyncIterator')

class WritableState {
  constructor (stream, { highWaterMark = 16384, map = null, mapWritable, byteLength, byteLengthWritable } = {}) {
    this.stream = stream
    this.queue = new FIFO()
    this.highWaterMark = highWaterMark
    this.buffered = 0
    this.error = null
    this.pipeline = null
    this.drains = null // if we add more seldomly used helpers we might them into a subobject so its a single ptr
    this.byteLength = byteLengthWritable || byteLength || defaultByteLength
    this.map = mapWritable || map
    this.afterWrite = afterWrite.bind(this)
    this.afterUpdateNextTick = updateWriteNT.bind(this)
  }

  get ended () {
    return (this.stream._duplexState & WRITE_DONE) !== 0
  }

  push (data) {
    if ((this.stream._duplexState & WRITE_DROP_DATA) !== 0) return false
    if (this.map !== null) data = this.map(data)

    this.buffered += this.byteLength(data)
    this.queue.push(data)

    if (this.buffered < this.highWaterMark) {
      this.stream._duplexState |= WRITE_QUEUED
      return true
    }

    this.stream._duplexState |= WRITE_QUEUED_AND_UNDRAINED
    return false
  }

  shift () {
    const data = this.queue.shift()

    this.buffered -= this.byteLength(data)
    if (this.buffered === 0) this.stream._duplexState &= WRITE_NOT_QUEUED

    return data
  }

  end (data) {
    if (typeof data === 'function') this.stream.once('finish', data)
    else if (data !== undefined && data !== null) this.push(data)
    this.stream._duplexState = (this.stream._duplexState | WRITE_FINISHING) & WRITE_NON_PRIMARY
  }

  autoBatch (data, cb) {
    const buffer = []
    const stream = this.stream

    buffer.push(data)
    while ((stream._duplexState & WRITE_STATUS) === WRITE_QUEUED_AND_ACTIVE) {
      buffer.push(stream._writableState.shift())
    }

    if ((stream._duplexState & OPEN_STATUS) !== 0) return cb(null)
    stream._writev(buffer, cb)
  }

  update () {
    const stream = this.stream

    stream._duplexState |= WRITE_UPDATING

    do {
      while ((stream._duplexState & WRITE_STATUS) === WRITE_QUEUED) {
        const data = this.shift()
        stream._duplexState |= WRITE_ACTIVE_AND_WRITING
        stream._write(data, this.afterWrite)
      }

      if ((stream._duplexState & WRITE_PRIMARY_AND_ACTIVE) === 0) this.updateNonPrimary()
    } while (this.continueUpdate() === true)

    stream._duplexState &= WRITE_NOT_UPDATING
  }

  updateNonPrimary () {
    const stream = this.stream

    if ((stream._duplexState & WRITE_FINISHING_STATUS) === WRITE_FINISHING) {
      stream._duplexState = stream._duplexState | WRITE_ACTIVE
      stream._final(afterFinal.bind(this))
      return
    }

    if ((stream._duplexState & DESTROY_STATUS) === DESTROYING) {
      if ((stream._duplexState & ACTIVE_OR_TICKING) === 0) {
        stream._duplexState |= ACTIVE
        stream._destroy(afterDestroy.bind(this))
      }
      return
    }

    if ((stream._duplexState & IS_OPENING) === OPENING) {
      stream._duplexState = (stream._duplexState | ACTIVE) & NOT_OPENING
      stream._open(afterOpen.bind(this))
    }
  }

  continueUpdate () {
    if ((this.stream._duplexState & WRITE_NEXT_TICK) === 0) return false
    this.stream._duplexState &= WRITE_NOT_NEXT_TICK
    return true
  }

  updateCallback () {
    if ((this.stream._duplexState & WRITE_UPDATE_SYNC_STATUS) === WRITE_PRIMARY) this.update()
    else this.updateNextTick()
  }

  updateNextTick () {
    if ((this.stream._duplexState & WRITE_NEXT_TICK) !== 0) return
    this.stream._duplexState |= WRITE_NEXT_TICK
    if ((this.stream._duplexState & WRITE_UPDATING) === 0) qmt(this.afterUpdateNextTick)
  }
}

class ReadableState {
  constructor (stream, { highWaterMark = 16384, map = null, mapReadable, byteLength, byteLengthReadable } = {}) {
    this.stream = stream
    this.queue = new FIFO()
    this.highWaterMark = highWaterMark === 0 ? 1 : highWaterMark
    this.buffered = 0
    this.readAhead = highWaterMark > 0
    this.error = null
    this.pipeline = null
    this.byteLength = byteLengthReadable || byteLength || defaultByteLength
    this.map = mapReadable || map
    this.pipeTo = null
    this.afterRead = afterRead.bind(this)
    this.afterUpdateNextTick = updateReadNT.bind(this)
  }

  get ended () {
    return (this.stream._duplexState & READ_DONE) !== 0
  }

  pipe (pipeTo, cb) {
    if (this.pipeTo !== null) throw new Error('Can only pipe to one destination')
    if (typeof cb !== 'function') cb = null

    this.stream._duplexState |= READ_PIPE_DRAINED
    this.pipeTo = pipeTo
    this.pipeline = new Pipeline(this.stream, pipeTo, cb)

    if (cb) this.stream.on('error', noop) // We already error handle this so supress crashes

    if (isStreamx(pipeTo)) {
      pipeTo._writableState.pipeline = this.pipeline
      if (cb) pipeTo.on('error', noop) // We already error handle this so supress crashes
      pipeTo.on('finish', this.pipeline.finished.bind(this.pipeline)) // TODO: just call finished from pipeTo itself
    } else {
      const onerror = this.pipeline.done.bind(this.pipeline, pipeTo)
      const onclose = this.pipeline.done.bind(this.pipeline, pipeTo, null) // onclose has a weird bool arg
      pipeTo.on('error', onerror)
      pipeTo.on('close', onclose)
      pipeTo.on('finish', this.pipeline.finished.bind(this.pipeline))
    }

    pipeTo.on('drain', afterDrain.bind(this))
    this.stream.emit('piping', pipeTo)
    pipeTo.emit('pipe', this.stream)
  }

  push (data) {
    const stream = this.stream

    if (data === null) {
      this.highWaterMark = 0
      stream._duplexState = (stream._duplexState | READ_ENDING) & READ_NON_PRIMARY_AND_PUSHED
      return false
    }

    if (this.map !== null) {
      data = this.map(data)
      if (data === null) {
        stream._duplexState &= READ_PUSHED
        return this.buffered < this.highWaterMark
      }
    }

    this.buffered += this.byteLength(data)
    this.queue.push(data)

    stream._duplexState = (stream._duplexState | READ_QUEUED) & READ_PUSHED

    return this.buffered < this.highWaterMark
  }

  shift () {
    const data = this.queue.shift()

    this.buffered -= this.byteLength(data)
    if (this.buffered === 0) this.stream._duplexState &= READ_NOT_QUEUED
    return data
  }

  unshift (data) {
    const pending = [this.map !== null ? this.map(data) : data]
    while (this.buffered > 0) pending.push(this.shift())

    for (let i = 0; i < pending.length - 1; i++) {
      const data = pending[i]
      this.buffered += this.byteLength(data)
      this.queue.push(data)
    }

    this.push(pending[pending.length - 1])
  }

  read () {
    const stream = this.stream

    if ((stream._duplexState & READ_STATUS) === READ_QUEUED) {
      const data = this.shift()
      if (this.pipeTo !== null && this.pipeTo.write(data) === false) stream._duplexState &= READ_PIPE_NOT_DRAINED
      if ((stream._duplexState & READ_EMIT_DATA) !== 0) stream.emit('data', data)
      return data
    }

    if (this.readAhead === false) {
      stream._duplexState |= READ_READ_AHEAD
      this.updateNextTick()
    }

    return null
  }

  drain () {
    const stream = this.stream

    while ((stream._duplexState & READ_STATUS) === READ_QUEUED && (stream._duplexState & READ_FLOWING) !== 0) {
      const data = this.shift()
      if (this.pipeTo !== null && this.pipeTo.write(data) === false) stream._duplexState &= READ_PIPE_NOT_DRAINED
      if ((stream._duplexState & READ_EMIT_DATA) !== 0) stream.emit('data', data)
    }
  }

  update () {
    const stream = this.stream

    stream._duplexState |= READ_UPDATING

    do {
      this.drain()

      while (this.buffered < this.highWaterMark && (stream._duplexState & SHOULD_NOT_READ) === READ_READ_AHEAD) {
        stream._duplexState |= READ_ACTIVE_AND_NEEDS_PUSH
        stream._read(this.afterRead)
        this.drain()
      }

      if ((stream._duplexState & READ_READABLE_STATUS) === READ_EMIT_READABLE_AND_QUEUED) {
        stream._duplexState |= READ_EMITTED_READABLE
        stream.emit('readable')
      }

      if ((stream._duplexState & READ_PRIMARY_AND_ACTIVE) === 0) this.updateNonPrimary()
    } while (this.continueUpdate() === true)

    stream._duplexState &= READ_NOT_UPDATING
  }

  updateNonPrimary () {
    const stream = this.stream

    if ((stream._duplexState & READ_ENDING_STATUS) === READ_ENDING) {
      stream._duplexState = (stream._duplexState | READ_DONE) & READ_NOT_ENDING
      stream.emit('end')
      if ((stream._duplexState & AUTO_DESTROY) === DONE) stream._duplexState |= DESTROYING
      if (this.pipeTo !== null) this.pipeTo.end()
    }

    if ((stream._duplexState & DESTROY_STATUS) === DESTROYING) {
      if ((stream._duplexState & ACTIVE_OR_TICKING) === 0) {
        stream._duplexState |= ACTIVE
        stream._destroy(afterDestroy.bind(this))
      }
      return
    }

    if ((stream._duplexState & IS_OPENING) === OPENING) {
      stream._duplexState = (stream._duplexState | ACTIVE) & NOT_OPENING
      stream._open(afterOpen.bind(this))
    }
  }

  continueUpdate () {
    if ((this.stream._duplexState & READ_NEXT_TICK) === 0) return false
    this.stream._duplexState &= READ_NOT_NEXT_TICK
    return true
  }

  updateCallback () {
    if ((this.stream._duplexState & READ_UPDATE_SYNC_STATUS) === READ_PRIMARY) this.update()
    else this.updateNextTick()
  }

  updateNextTickIfOpen () {
    if ((this.stream._duplexState & READ_NEXT_TICK_OR_OPENING) !== 0) return
    this.stream._duplexState |= READ_NEXT_TICK
    if ((this.stream._duplexState & READ_UPDATING) === 0) qmt(this.afterUpdateNextTick)
  }

  updateNextTick () {
    if ((this.stream._duplexState & READ_NEXT_TICK) !== 0) return
    this.stream._duplexState |= READ_NEXT_TICK
    if ((this.stream._duplexState & READ_UPDATING) === 0) qmt(this.afterUpdateNextTick)
  }
}

class TransformState {
  constructor (stream) {
    this.data = null
    this.afterTransform = afterTransform.bind(stream)
    this.afterFinal = null
  }
}

class Pipeline {
  constructor (src, dst, cb) {
    this.from = src
    this.to = dst
    this.afterPipe = cb
    this.error = null
    this.pipeToFinished = false
  }

  finished () {
    this.pipeToFinished = true
  }

  done (stream, err) {
    if (err) this.error = err

    if (stream === this.to) {
      this.to = null

      if (this.from !== null) {
        if ((this.from._duplexState & READ_DONE) === 0 || !this.pipeToFinished) {
          this.from.destroy(this.error || new Error('Writable stream closed prematurely'))
        }
        return
      }
    }

    if (stream === this.from) {
      this.from = null

      if (this.to !== null) {
        if ((stream._duplexState & READ_DONE) === 0) {
          this.to.destroy(this.error || new Error('Readable stream closed before ending'))
        }
        return
      }
    }

    if (this.afterPipe !== null) this.afterPipe(this.error)
    this.to = this.from = this.afterPipe = null
  }
}

function afterDrain () {
  this.stream._duplexState |= READ_PIPE_DRAINED
  this.updateCallback()
}

function afterFinal (err) {
  const stream = this.stream
  if (err) stream.destroy(err)
  if ((stream._duplexState & DESTROY_STATUS) === 0) {
    stream._duplexState |= WRITE_DONE
    stream.emit('finish')
  }
  if ((stream._duplexState & AUTO_DESTROY) === DONE) {
    stream._duplexState |= DESTROYING
  }

  stream._duplexState &= WRITE_NOT_FINISHING

  // no need to wait the extra tick here, so we short circuit that
  if ((stream._duplexState & WRITE_UPDATING) === 0) this.update()
  else this.updateNextTick()
}

function afterDestroy (err) {
  const stream = this.stream

  if (!err && this.error !== STREAM_DESTROYED) err = this.error
  if (err) stream.emit('error', err)
  stream._duplexState |= DESTROYED
  stream.emit('close')

  const rs = stream._readableState
  const ws = stream._writableState

  if (rs !== null && rs.pipeline !== null) rs.pipeline.done(stream, err)

  if (ws !== null) {
    while (ws.drains !== null && ws.drains.length > 0) ws.drains.shift().resolve(false)
    if (ws.pipeline !== null) ws.pipeline.done(stream, err)
  }
}

function afterWrite (err) {
  const stream = this.stream

  if (err) stream.destroy(err)
  stream._duplexState &= WRITE_NOT_ACTIVE

  if (this.drains !== null) tickDrains(this.drains)

  if ((stream._duplexState & WRITE_DRAIN_STATUS) === WRITE_UNDRAINED) {
    stream._duplexState &= WRITE_DRAINED
    if ((stream._duplexState & WRITE_EMIT_DRAIN) === WRITE_EMIT_DRAIN) {
      stream.emit('drain')
    }
  }

  this.updateCallback()
}

function afterRead (err) {
  if (err) this.stream.destroy(err)
  this.stream._duplexState &= READ_NOT_ACTIVE
  if (this.readAhead === false && (this.stream._duplexState & READ_RESUMED) === 0) this.stream._duplexState &= READ_NO_READ_AHEAD
  this.updateCallback()
}

function updateReadNT () {
  if ((this.stream._duplexState & READ_UPDATING) === 0) {
    this.stream._duplexState &= READ_NOT_NEXT_TICK
    this.update()
  }
}

function updateWriteNT () {
  if ((this.stream._duplexState & WRITE_UPDATING) === 0) {
    this.stream._duplexState &= WRITE_NOT_NEXT_TICK
    this.update()
  }
}

function tickDrains (drains) {
  for (let i = 0; i < drains.length; i++) {
    // drains.writes are monotonic, so if one is 0 its always the first one
    if (--drains[i].writes === 0) {
      drains.shift().resolve(true)
      i--
    }
  }
}

function afterOpen (err) {
  const stream = this.stream

  if (err) stream.destroy(err)

  if ((stream._duplexState & DESTROYING) === 0) {
    if ((stream._duplexState & READ_PRIMARY_STATUS) === 0) stream._duplexState |= READ_PRIMARY
    if ((stream._duplexState & WRITE_PRIMARY_STATUS) === 0) stream._duplexState |= WRITE_PRIMARY
    stream.emit('open')
  }

  stream._duplexState &= NOT_ACTIVE

  if (stream._writableState !== null) {
    stream._writableState.updateCallback()
  }

  if (stream._readableState !== null) {
    stream._readableState.updateCallback()
  }
}

function afterTransform (err, data) {
  if (data !== undefined && data !== null) this.push(data)
  this._writableState.afterWrite(err)
}

function newListener (name) {
  if (this._readableState !== null) {
    if (name === 'data') {
      this._duplexState |= (READ_EMIT_DATA | READ_RESUMED_READ_AHEAD)
      this._readableState.updateNextTick()
    }
    if (name === 'readable') {
      this._duplexState |= READ_EMIT_READABLE
      this._readableState.updateNextTick()
    }
  }

  if (this._writableState !== null) {
    if (name === 'drain') {
      this._duplexState |= WRITE_EMIT_DRAIN
      this._writableState.updateNextTick()
    }
  }
}

class Stream extends EventEmitter {
  constructor (opts) {
    super()

    this._duplexState = 0
    this._readableState = null
    this._writableState = null

    if (opts) {
      if (opts.open) this._open = opts.open
      if (opts.destroy) this._destroy = opts.destroy
      if (opts.predestroy) this._predestroy = opts.predestroy
      if (opts.signal) {
        opts.signal.addEventListener('abort', abort.bind(this))
      }
    }

    this.on('newListener', newListener)
  }

  _open (cb) {
    cb(null)
  }

  _destroy (cb) {
    cb(null)
  }

  _predestroy () {
    // does nothing
  }

  get readable () {
    return this._readableState !== null ? true : undefined
  }

  get writable () {
    return this._writableState !== null ? true : undefined
  }

  get destroyed () {
    return (this._duplexState & DESTROYED) !== 0
  }

  get destroying () {
    return (this._duplexState & DESTROY_STATUS) !== 0
  }

  destroy (err) {
    if ((this._duplexState & DESTROY_STATUS) === 0) {
      if (!err) err = STREAM_DESTROYED
      this._duplexState = (this._duplexState | DESTROYING) & NON_PRIMARY

      if (this._readableState !== null) {
        this._readableState.highWaterMark = 0
        this._readableState.error = err
      }
      if (this._writableState !== null) {
        this._writableState.highWaterMark = 0
        this._writableState.error = err
      }

      this._duplexState |= PREDESTROYING
      this._predestroy()
      this._duplexState &= NOT_PREDESTROYING

      if (this._readableState !== null) this._readableState.updateNextTick()
      if (this._writableState !== null) this._writableState.updateNextTick()
    }
  }
}

class Readable extends Stream {
  constructor (opts) {
    super(opts)

    this._duplexState |= OPENING | WRITE_DONE | READ_READ_AHEAD
    this._readableState = new ReadableState(this, opts)

    if (opts) {
      if (this._readableState.readAhead === false) this._duplexState &= READ_NO_READ_AHEAD
      if (opts.read) this._read = opts.read
      if (opts.eagerOpen) this._readableState.updateNextTick()
      if (opts.encoding) this.setEncoding(opts.encoding)
    }
  }

  setEncoding (encoding) {
    const dec = new TextDecoder(encoding)
    const map = this._readableState.map || echo
    this._readableState.map = mapOrSkip
    return this

    function mapOrSkip (data) {
      const next = dec.push(data)
      return next === '' && (data.byteLength !== 0 || dec.remaining > 0) ? null : map(next)
    }
  }

  _read (cb) {
    cb(null)
  }

  pipe (dest, cb) {
    this._readableState.updateNextTick()
    this._readableState.pipe(dest, cb)
    return dest
  }

  read () {
    this._readableState.updateNextTick()
    return this._readableState.read()
  }

  push (data) {
    this._readableState.updateNextTickIfOpen()
    return this._readableState.push(data)
  }

  unshift (data) {
    this._readableState.updateNextTickIfOpen()
    return this._readableState.unshift(data)
  }

  resume () {
    this._duplexState |= READ_RESUMED_READ_AHEAD
    this._readableState.updateNextTick()
    return this
  }

  pause () {
    this._duplexState &= (this._readableState.readAhead === false ? READ_PAUSED_NO_READ_AHEAD : READ_PAUSED)
    return this
  }

  static _fromAsyncIterator (ite, opts) {
    let destroy

    const rs = new Readable({
      ...opts,
      read (cb) {
        ite.next().then(push).then(cb.bind(null, null)).catch(cb)
      },
      predestroy () {
        destroy = ite.return()
      },
      destroy (cb) {
        if (!destroy) return cb(null)
        destroy.then(cb.bind(null, null)).catch(cb)
      }
    })

    return rs

    function push (data) {
      if (data.done) rs.push(null)
      else rs.push(data.value)
    }
  }

  static from (data, opts) {
    if (isReadStreamx(data)) return data
    if (data[asyncIterator]) return this._fromAsyncIterator(data[asyncIterator](), opts)
    if (!Array.isArray(data)) data = data === undefined ? [] : [data]

    let i = 0
    return new Readable({
      ...opts,
      read (cb) {
        this.push(i === data.length ? null : data[i++])
        cb(null)
      }
    })
  }

  static isBackpressured (rs) {
    return (rs._duplexState & READ_BACKPRESSURE_STATUS) !== 0 || rs._readableState.buffered >= rs._readableState.highWaterMark
  }

  static isPaused (rs) {
    return (rs._duplexState & READ_RESUMED) === 0
  }

  [asyncIterator] () {
    const stream = this

    let error = null
    let promiseResolve = null
    let promiseReject = null

    this.on('error', (err) => { error = err })
    this.on('readable', onreadable)
    this.on('close', onclose)

    return {
      [asyncIterator] () {
        return this
      },
      next () {
        return new Promise(function (resolve, reject) {
          promiseResolve = resolve
          promiseReject = reject
          const data = stream.read()
          if (data !== null) ondata(data)
          else if ((stream._duplexState & DESTROYED) !== 0) ondata(null)
        })
      },
      return () {
        return destroy(null)
      },
      throw (err) {
        return destroy(err)
      }
    }

    function onreadable () {
      if (promiseResolve !== null) ondata(stream.read())
    }

    function onclose () {
      if (promiseResolve !== null) ondata(null)
    }

    function ondata (data) {
      if (promiseReject === null) return
      if (error) promiseReject(error)
      else if (data === null && (stream._duplexState & READ_DONE) === 0) promiseReject(STREAM_DESTROYED)
      else promiseResolve({ value: data, done: data === null })
      promiseReject = promiseResolve = null
    }

    function destroy (err) {
      stream.destroy(err)
      return new Promise((resolve, reject) => {
        if (stream._duplexState & DESTROYED) return resolve({ value: undefined, done: true })
        stream.once('close', function () {
          if (err) reject(err)
          else resolve({ value: undefined, done: true })
        })
      })
    }
  }
}

class Writable extends Stream {
  constructor (opts) {
    super(opts)

    this._duplexState |= OPENING | READ_DONE
    this._writableState = new WritableState(this, opts)

    if (opts) {
      if (opts.writev) this._writev = opts.writev
      if (opts.write) this._write = opts.write
      if (opts.final) this._final = opts.final
      if (opts.eagerOpen) this._writableState.updateNextTick()
    }
  }

  cork () {
    this._duplexState |= WRITE_CORKED
  }

  uncork () {
    this._duplexState &= WRITE_NOT_CORKED
    this._writableState.updateNextTick()
  }

  _writev (batch, cb) {
    cb(null)
  }

  _write (data, cb) {
    this._writableState.autoBatch(data, cb)
  }

  _final (cb) {
    cb(null)
  }

  static isBackpressured (ws) {
    return (ws._duplexState & WRITE_BACKPRESSURE_STATUS) !== 0
  }

  static drained (ws) {
    if (ws.destroyed) return Promise.resolve(false)
    const state = ws._writableState
    const pending = (isWritev(ws) ? Math.min(1, state.queue.length) : state.queue.length)
    const writes = pending + ((ws._duplexState & WRITE_WRITING) ? 1 : 0)
    if (writes === 0) return Promise.resolve(true)
    if (state.drains === null) state.drains = []
    return new Promise((resolve) => {
      state.drains.push({ writes, resolve })
    })
  }

  write (data) {
    this._writableState.updateNextTick()
    return this._writableState.push(data)
  }

  end (data) {
    this._writableState.updateNextTick()
    this._writableState.end(data)
    return this
  }
}

class Duplex extends Readable { // and Writable
  constructor (opts) {
    super(opts)

    this._duplexState = OPENING | (this._duplexState & READ_READ_AHEAD)
    this._writableState = new WritableState(this, opts)

    if (opts) {
      if (opts.writev) this._writev = opts.writev
      if (opts.write) this._write = opts.write
      if (opts.final) this._final = opts.final
    }
  }

  cork () {
    this._duplexState |= WRITE_CORKED
  }

  uncork () {
    this._duplexState &= WRITE_NOT_CORKED
    this._writableState.updateNextTick()
  }

  _writev (batch, cb) {
    cb(null)
  }

  _write (data, cb) {
    this._writableState.autoBatch(data, cb)
  }

  _final (cb) {
    cb(null)
  }

  write (data) {
    this._writableState.updateNextTick()
    return this._writableState.push(data)
  }

  end (data) {
    this._writableState.updateNextTick()
    this._writableState.end(data)
    return this
  }
}

class Transform extends Duplex {
  constructor (opts) {
    super(opts)
    this._transformState = new TransformState(this)

    if (opts) {
      if (opts.transform) this._transform = opts.transform
      if (opts.flush) this._flush = opts.flush
    }
  }

  _write (data, cb) {
    if (this._readableState.buffered >= this._readableState.highWaterMark) {
      this._transformState.data = data
    } else {
      this._transform(data, this._transformState.afterTransform)
    }
  }

  _read (cb) {
    if (this._transformState.data !== null) {
      const data = this._transformState.data
      this._transformState.data = null
      cb(null)
      this._transform(data, this._transformState.afterTransform)
    } else {
      cb(null)
    }
  }

  destroy (err) {
    super.destroy(err)
    if (this._transformState.data !== null) {
      this._transformState.data = null
      this._transformState.afterTransform()
    }
  }

  _transform (data, cb) {
    cb(null, data)
  }

  _flush (cb) {
    cb(null)
  }

  _final (cb) {
    this._transformState.afterFinal = cb
    this._flush(transformAfterFlush.bind(this))
  }
}

class PassThrough extends Transform {}

function transformAfterFlush (err, data) {
  const cb = this._transformState.afterFinal
  if (err) return cb(err)
  if (data !== null && data !== undefined) this.push(data)
  this.push(null)
  cb(null)
}

function pipelinePromise (...streams) {
  return new Promise((resolve, reject) => {
    return pipeline(...streams, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function pipeline (stream, ...streams) {
  const all = Array.isArray(stream) ? [...stream, ...streams] : [stream, ...streams]
  const done = (all.length && typeof all[all.length - 1] === 'function') ? all.pop() : null

  if (all.length < 2) throw new Error('Pipeline requires at least 2 streams')

  let src = all[0]
  let dest = null
  let error = null

  for (let i = 1; i < all.length; i++) {
    dest = all[i]

    if (isStreamx(src)) {
      src.pipe(dest, onerror)
    } else {
      errorHandle(src, true, i > 1, onerror)
      src.pipe(dest)
    }

    src = dest
  }

  if (done) {
    let fin = false

    const autoDestroy = isStreamx(dest) || !!(dest._writableState && dest._writableState.autoDestroy)

    dest.on('error', (err) => {
      if (error === null) error = err
    })

    dest.on('finish', () => {
      fin = true
      if (!autoDestroy) done(error)
    })

    if (autoDestroy) {
      dest.on('close', () => done(error || (fin ? null : PREMATURE_CLOSE)))
    }
  }

  return dest

  function errorHandle (s, rd, wr, onerror) {
    s.on('error', onerror)
    s.on('close', onclose)

    function onclose () {
      if (rd && s._readableState && !s._readableState.ended) return onerror(PREMATURE_CLOSE)
      if (wr && s._writableState && !s._writableState.ended) return onerror(PREMATURE_CLOSE)
    }
  }

  function onerror (err) {
    if (!err || error) return
    error = err

    for (const s of all) {
      s.destroy(err)
    }
  }
}

function echo (s) {
  return s
}

function isStream (stream) {
  return !!stream._readableState || !!stream._writableState
}

function isStreamx (stream) {
  return typeof stream._duplexState === 'number' && isStream(stream)
}

function isEnded (stream) {
  return !!stream._readableState && stream._readableState.ended
}

function isFinished (stream) {
  return !!stream._writableState && stream._writableState.ended
}

function getStreamError (stream, opts = {}) {
  const err = (stream._readableState && stream._readableState.error) || (stream._writableState && stream._writableState.error)

  // avoid implicit errors by default
  return (!opts.all && err === STREAM_DESTROYED) ? null : err
}

function isReadStreamx (stream) {
  return isStreamx(stream) && stream.readable
}

function isDisturbed (stream) {
  return (stream._duplexState & OPENING) !== OPENING || (stream._duplexState & ACTIVE_OR_TICKING) !== 0
}

function isTypedArray (data) {
  return typeof data === 'object' && data !== null && typeof data.byteLength === 'number'
}

function defaultByteLength (data) {
  return isTypedArray(data) ? data.byteLength : 1024
}

function noop () {}

function abort () {
  this.destroy(new Error('Stream aborted.'))
}

function isWritev (s) {
  return s._writev !== Writable.prototype._writev && s._writev !== Duplex.prototype._writev
}

module.exports = {
  pipeline,
  pipelinePromise,
  isStream,
  isStreamx,
  isEnded,
  isFinished,
  isDisturbed,
  getStreamError,
  Stream,
  Writable,
  Readable,
  Duplex,
  Transform,
  // Export PassThrough for compatibility with Node.js core's stream module
  PassThrough
}


/***/ }),

/***/ 35645:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tar = __webpack_require__(56118)
const pump = __webpack_require__(87898)
const fs = __webpack_require__(79896)
const path = __webpack_require__(16928)

const win32 = (global.Bare ? global.Bare.platform : process.platform) === 'win32'

exports.pack = function pack (cwd, opts) {
  if (!cwd) cwd = '.'
  if (!opts) opts = {}

  const xfs = opts.fs || fs
  const ignore = opts.ignore || opts.filter || noop
  const mapStream = opts.mapStream || echo
  const statNext = statAll(xfs, opts.dereference ? xfs.stat : xfs.lstat, cwd, ignore, opts.entries, opts.sort)
  const strict = opts.strict !== false
  const umask = typeof opts.umask === 'number' ? ~opts.umask : ~processUmask()
  const pack = opts.pack || tar.pack()
  const finish = opts.finish || noop

  let map = opts.map || noop
  let dmode = typeof opts.dmode === 'number' ? opts.dmode : 0
  let fmode = typeof opts.fmode === 'number' ? opts.fmode : 0

  if (opts.strip) map = strip(map, opts.strip)

  if (opts.readable) {
    dmode |= parseInt(555, 8)
    fmode |= parseInt(444, 8)
  }
  if (opts.writable) {
    dmode |= parseInt(333, 8)
    fmode |= parseInt(222, 8)
  }

  onnextentry()

  function onsymlink (filename, header) {
    xfs.readlink(path.join(cwd, filename), function (err, linkname) {
      if (err) return pack.destroy(err)
      header.linkname = normalize(linkname)
      pack.entry(header, onnextentry)
    })
  }

  function onstat (err, filename, stat) {
    if (pack.destroyed) return
    if (err) return pack.destroy(err)
    if (!filename) {
      if (opts.finalize !== false) pack.finalize()
      return finish(pack)
    }

    if (stat.isSocket()) return onnextentry() // tar does not support sockets...

    let header = {
      name: normalize(filename),
      mode: (stat.mode | (stat.isDirectory() ? dmode : fmode)) & umask,
      mtime: stat.mtime,
      size: stat.size,
      type: 'file',
      uid: stat.uid,
      gid: stat.gid
    }

    if (stat.isDirectory()) {
      header.size = 0
      header.type = 'directory'
      header = map(header) || header
      return pack.entry(header, onnextentry)
    }

    if (stat.isSymbolicLink()) {
      header.size = 0
      header.type = 'symlink'
      header = map(header) || header
      return onsymlink(filename, header)
    }

    // TODO: add fifo etc...

    header = map(header) || header

    if (!stat.isFile()) {
      if (strict) return pack.destroy(new Error('unsupported type for ' + filename))
      return onnextentry()
    }

    const entry = pack.entry(header, onnextentry)
    const rs = mapStream(xfs.createReadStream(path.join(cwd, filename), { start: 0, end: header.size > 0 ? header.size - 1 : header.size }), header)

    rs.on('error', function (err) { // always forward errors on destroy
      entry.destroy(err)
    })

    pump(rs, entry)
  }

  function onnextentry (err) {
    if (err) return pack.destroy(err)
    statNext(onstat)
  }

  return pack
}

function head (list) {
  return list.length ? list[list.length - 1] : null
}

function processGetuid () {
  return (!global.Bare && process.getuid) ? process.getuid() : -1
}

function processUmask () {
  return (!global.Bare && process.umask) ? process.umask() : 0
}

exports.extract = function extract (cwd, opts) {
  if (!cwd) cwd = '.'
  if (!opts) opts = {}

  cwd = path.resolve(cwd)

  const xfs = opts.fs || fs
  const ignore = opts.ignore || opts.filter || noop
  const mapStream = opts.mapStream || echo
  const own = opts.chown !== false && !win32 && processGetuid() === 0
  const extract = opts.extract || tar.extract()
  const stack = []
  const now = new Date()
  const umask = typeof opts.umask === 'number' ? ~opts.umask : ~processUmask()
  const strict = opts.strict !== false
  const validateSymLinks = opts.validateSymlinks !== false

  let map = opts.map || noop
  let dmode = typeof opts.dmode === 'number' ? opts.dmode : 0
  let fmode = typeof opts.fmode === 'number' ? opts.fmode : 0

  if (opts.strip) map = strip(map, opts.strip)

  if (opts.readable) {
    dmode |= parseInt(555, 8)
    fmode |= parseInt(444, 8)
  }
  if (opts.writable) {
    dmode |= parseInt(333, 8)
    fmode |= parseInt(222, 8)
  }

  extract.on('entry', onentry)

  if (opts.finish) extract.on('finish', opts.finish)

  return extract

  function onentry (header, stream, next) {
    header = map(header) || header
    header.name = normalize(header.name)

    const name = path.join(cwd, path.join('/', header.name))

    if (ignore(name, header)) {
      stream.resume()
      return next()
    }

    const dir = path.join(name, '.') === path.join(cwd, '.') ? cwd : path.dirname(name)

    validate(xfs, dir, path.join(cwd, '.'), function (err, valid) {
      if (err) return next(err)
      if (!valid) return next(new Error(dir + ' is not a valid path'))

      if (header.type === 'directory') {
        stack.push([name, header.mtime])
        return mkdirfix(name, {
          fs: xfs,
          own,
          uid: header.uid,
          gid: header.gid,
          mode: header.mode
        }, stat)
      }

      mkdirfix(dir, {
        fs: xfs,
        own,
        uid: header.uid,
        gid: header.gid,
        // normally, the folders with rights and owner should be part of the TAR file
        // if this is not the case, create folder for same user as file and with
        // standard permissions of 0o755 (rwxr-xr-x)
        mode: 0o755
      }, function (err) {
        if (err) return next(err)

        switch (header.type) {
          case 'file': return onfile()
          case 'link': return onlink()
          case 'symlink': return onsymlink()
        }

        if (strict) return next(new Error('unsupported type for ' + name + ' (' + header.type + ')'))

        stream.resume()
        next()
      })
    })

    function stat (err) {
      if (err) return next(err)
      utimes(name, header, function (err) {
        if (err) return next(err)
        if (win32) return next()
        chperm(name, header, next)
      })
    }

    function onsymlink () {
      if (win32) return next() // skip symlinks on win for now before it can be tested
      xfs.unlink(name, function () {
        const dst = path.resolve(path.dirname(name), header.linkname)
        if (!inCwd(dst) && validateSymLinks) return next(new Error(name + ' is not a valid symlink'))

        xfs.symlink(header.linkname, name, stat)
      })
    }

    function onlink () {
      if (win32) return next() // skip links on win for now before it can be tested
      xfs.unlink(name, function () {
        const link = path.join(cwd, path.join('/', header.linkname))

        fs.realpath(link, function (err, dst) {
          if (err || !inCwd(dst)) return next(new Error(name + ' is not a valid hardlink'))

          xfs.link(dst, name, function (err) {
            if (err && err.code === 'EPERM' && opts.hardlinkAsFilesFallback) {
              stream = xfs.createReadStream(dst)
              return onfile()
            }

            stat(err)
          })
        })
      })
    }

    function inCwd (dst) {
      return dst.startsWith(cwd)
    }

    function onfile () {
      const ws = xfs.createWriteStream(name)
      const rs = mapStream(stream, header)

      ws.on('error', function (err) { // always forward errors on destroy
        rs.destroy(err)
      })

      pump(rs, ws, function (err) {
        if (err) return next(err)
        ws.on('close', stat)
      })
    }
  }

  function utimesParent (name, cb) { // we just set the mtime on the parent dir again everytime we write an entry
    let top
    while ((top = head(stack)) && name.slice(0, top[0].length) !== top[0]) stack.pop()
    if (!top) return cb()
    xfs.utimes(top[0], now, top[1], cb)
  }

  function utimes (name, header, cb) {
    if (opts.utimes === false) return cb()

    if (header.type === 'directory') return xfs.utimes(name, now, header.mtime, cb)
    if (header.type === 'symlink') return utimesParent(name, cb) // TODO: how to set mtime on link?

    xfs.utimes(name, now, header.mtime, function (err) {
      if (err) return cb(err)
      utimesParent(name, cb)
    })
  }

  function chperm (name, header, cb) {
    const link = header.type === 'symlink'

    /* eslint-disable n/no-deprecated-api */
    const chmod = link ? xfs.lchmod : xfs.chmod
    const chown = link ? xfs.lchown : xfs.chown
    /* eslint-enable n/no-deprecated-api */

    if (!chmod) return cb()

    const mode = (header.mode | (header.type === 'directory' ? dmode : fmode)) & umask

    if (chown && own) chown.call(xfs, name, header.uid, header.gid, onchown)
    else onchown(null)

    function onchown (err) {
      if (err) return cb(err)
      if (!chmod) return cb()
      chmod.call(xfs, name, mode, cb)
    }
  }

  function mkdirfix (name, opts, cb) {
    // when mkdir is called on an existing directory, the permissions
    // will be overwritten (?), to avoid this we check for its existance first
    xfs.stat(name, function (err) {
      if (!err) return cb(null)
      if (err.code !== 'ENOENT') return cb(err)
      xfs.mkdir(name, { mode: opts.mode, recursive: true }, function (err, made) {
        if (err) return cb(err)
        chperm(name, opts, cb)
      })
    })
  }
}

function validate (fs, name, root, cb) {
  if (name === root) return cb(null, true)

  fs.lstat(name, function (err, st) {
    if (err && err.code !== 'ENOENT' && err.code !== 'EPERM') return cb(err)
    if (err || st.isDirectory()) return validate(fs, path.join(name, '..'), root, cb)
    cb(null, false)
  })
}

function noop () {}

function echo (name) {
  return name
}

function normalize (name) {
  return win32 ? name.replace(/\\/g, '/').replace(/[:?<>|]/g, '_') : name
}

function statAll (fs, stat, cwd, ignore, entries, sort) {
  if (!entries) entries = ['.']
  const queue = entries.slice(0)

  return function loop (callback) {
    if (!queue.length) return callback(null)

    const next = queue.shift()
    const nextAbs = path.join(cwd, next)

    stat.call(fs, nextAbs, function (err, stat) {
      // ignore errors if the files were deleted while buffering
      if (err) return callback(entries.indexOf(next) === -1 && err.code === 'ENOENT' ? null : err)

      if (!stat.isDirectory()) return callback(null, next, stat)

      fs.readdir(nextAbs, function (err, files) {
        if (err) return callback(err)

        if (sort) files.sort()

        for (let i = 0; i < files.length; i++) {
          if (!ignore(path.join(cwd, next, files[i]))) queue.push(path.join(next, files[i]))
        }

        callback(null, next, stat)
      })
    })
  }
}

function strip (map, level) {
  return function (header) {
    header.name = header.name.split('/').slice(level).join('/')

    const linkname = header.linkname
    if (linkname && (header.type === 'link' || path.isAbsolute(linkname))) {
      header.linkname = linkname.split('/').slice(level).join('/')
    }

    return map(header)
  }
}


/***/ }),

/***/ 20775:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const constants = { // just for envs without fs
  S_IFMT: 61440,
  S_IFDIR: 16384,
  S_IFCHR: 8192,
  S_IFBLK: 24576,
  S_IFIFO: 4096,
  S_IFLNK: 40960
}

try {
  module.exports = (__webpack_require__(79896).constants) || constants
} catch {
  module.exports = constants
}


/***/ }),

/***/ 35763:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Writable, Readable, getStreamError } = __webpack_require__(36204)
const FIFO = __webpack_require__(83867)
const b4a = __webpack_require__(73057)
const headers = __webpack_require__(88428)

const EMPTY = b4a.alloc(0)

class BufferList {
  constructor () {
    this.buffered = 0
    this.shifted = 0
    this.queue = new FIFO()

    this._offset = 0
  }

  push (buffer) {
    this.buffered += buffer.byteLength
    this.queue.push(buffer)
  }

  shiftFirst (size) {
    return this._buffered === 0 ? null : this._next(size)
  }

  shift (size) {
    if (size > this.buffered) return null
    if (size === 0) return EMPTY

    let chunk = this._next(size)

    if (size === chunk.byteLength) return chunk // likely case

    const chunks = [chunk]

    while ((size -= chunk.byteLength) > 0) {
      chunk = this._next(size)
      chunks.push(chunk)
    }

    return b4a.concat(chunks)
  }

  _next (size) {
    const buf = this.queue.peek()
    const rem = buf.byteLength - this._offset

    if (size >= rem) {
      const sub = this._offset ? buf.subarray(this._offset, buf.byteLength) : buf
      this.queue.shift()
      this._offset = 0
      this.buffered -= rem
      this.shifted += rem
      return sub
    }

    this.buffered -= size
    this.shifted += size

    return buf.subarray(this._offset, (this._offset += size))
  }
}

class Source extends Readable {
  constructor (self, header, offset) {
    super()

    this.header = header
    this.offset = offset

    this._parent = self
  }

  _read (cb) {
    if (this.header.size === 0) {
      this.push(null)
    }
    if (this._parent._stream === this) {
      this._parent._update()
    }
    cb(null)
  }

  _predestroy () {
    this._parent.destroy(getStreamError(this))
  }

  _detach () {
    if (this._parent._stream === this) {
      this._parent._stream = null
      this._parent._missing = overflow(this.header.size)
      this._parent._update()
    }
  }

  _destroy (cb) {
    this._detach()
    cb(null)
  }
}

class Extract extends Writable {
  constructor (opts) {
    super(opts)

    if (!opts) opts = {}

    this._buffer = new BufferList()
    this._offset = 0
    this._header = null
    this._stream = null
    this._missing = 0
    this._longHeader = false
    this._callback = noop
    this._locked = false
    this._finished = false
    this._pax = null
    this._paxGlobal = null
    this._gnuLongPath = null
    this._gnuLongLinkPath = null
    this._filenameEncoding = opts.filenameEncoding || 'utf-8'
    this._allowUnknownFormat = !!opts.allowUnknownFormat
    this._unlockBound = this._unlock.bind(this)
  }

  _unlock (err) {
    this._locked = false

    if (err) {
      this.destroy(err)
      this._continueWrite(err)
      return
    }

    this._update()
  }

  _consumeHeader () {
    if (this._locked) return false

    this._offset = this._buffer.shifted

    try {
      this._header = headers.decode(this._buffer.shift(512), this._filenameEncoding, this._allowUnknownFormat)
    } catch (err) {
      this._continueWrite(err)
      return false
    }

    if (!this._header) return true

    switch (this._header.type) {
      case 'gnu-long-path':
      case 'gnu-long-link-path':
      case 'pax-global-header':
      case 'pax-header':
        this._longHeader = true
        this._missing = this._header.size
        return true
    }

    this._locked = true
    this._applyLongHeaders()

    if (this._header.size === 0 || this._header.type === 'directory') {
      this.emit('entry', this._header, this._createStream(), this._unlockBound)
      return true
    }

    this._stream = this._createStream()
    this._missing = this._header.size

    this.emit('entry', this._header, this._stream, this._unlockBound)
    return true
  }

  _applyLongHeaders () {
    if (this._gnuLongPath) {
      this._header.name = this._gnuLongPath
      this._gnuLongPath = null
    }

    if (this._gnuLongLinkPath) {
      this._header.linkname = this._gnuLongLinkPath
      this._gnuLongLinkPath = null
    }

    if (this._pax) {
      if (this._pax.path) this._header.name = this._pax.path
      if (this._pax.linkpath) this._header.linkname = this._pax.linkpath
      if (this._pax.size) this._header.size = parseInt(this._pax.size, 10)
      this._header.pax = this._pax
      this._pax = null
    }
  }

  _decodeLongHeader (buf) {
    switch (this._header.type) {
      case 'gnu-long-path':
        this._gnuLongPath = headers.decodeLongPath(buf, this._filenameEncoding)
        break
      case 'gnu-long-link-path':
        this._gnuLongLinkPath = headers.decodeLongPath(buf, this._filenameEncoding)
        break
      case 'pax-global-header':
        this._paxGlobal = headers.decodePax(buf)
        break
      case 'pax-header':
        this._pax = this._paxGlobal === null
          ? headers.decodePax(buf)
          : Object.assign({}, this._paxGlobal, headers.decodePax(buf))
        break
    }
  }

  _consumeLongHeader () {
    this._longHeader = false
    this._missing = overflow(this._header.size)

    const buf = this._buffer.shift(this._header.size)

    try {
      this._decodeLongHeader(buf)
    } catch (err) {
      this._continueWrite(err)
      return false
    }

    return true
  }

  _consumeStream () {
    const buf = this._buffer.shiftFirst(this._missing)
    if (buf === null) return false

    this._missing -= buf.byteLength
    const drained = this._stream.push(buf)

    if (this._missing === 0) {
      this._stream.push(null)
      if (drained) this._stream._detach()
      return drained && this._locked === false
    }

    return drained
  }

  _createStream () {
    return new Source(this, this._header, this._offset)
  }

  _update () {
    while (this._buffer.buffered > 0 && !this.destroying) {
      if (this._missing > 0) {
        if (this._stream !== null) {
          if (this._consumeStream() === false) return
          continue
        }

        if (this._longHeader === true) {
          if (this._missing > this._buffer.buffered) break
          if (this._consumeLongHeader() === false) return false
          continue
        }

        const ignore = this._buffer.shiftFirst(this._missing)
        if (ignore !== null) this._missing -= ignore.byteLength
        continue
      }

      if (this._buffer.buffered < 512) break
      if (this._stream !== null || this._consumeHeader() === false) return
    }

    this._continueWrite(null)
  }

  _continueWrite (err) {
    const cb = this._callback
    this._callback = noop
    cb(err)
  }

  _write (data, cb) {
    this._callback = cb
    this._buffer.push(data)
    this._update()
  }

  _final (cb) {
    this._finished = this._missing === 0 && this._buffer.buffered === 0
    cb(this._finished ? null : new Error('Unexpected end of data'))
  }

  _predestroy () {
    this._continueWrite(null)
  }

  _destroy (cb) {
    if (this._stream) this._stream.destroy(getStreamError(this))
    cb(null)
  }

  [Symbol.asyncIterator] () {
    let error = null

    let promiseResolve = null
    let promiseReject = null

    let entryStream = null
    let entryCallback = null

    const extract = this

    this.on('entry', onentry)
    this.on('error', (err) => { error = err })
    this.on('close', onclose)

    return {
      [Symbol.asyncIterator] () {
        return this
      },
      next () {
        return new Promise(onnext)
      },
      return () {
        return destroy(null)
      },
      throw (err) {
        return destroy(err)
      }
    }

    function consumeCallback (err) {
      if (!entryCallback) return
      const cb = entryCallback
      entryCallback = null
      cb(err)
    }

    function onnext (resolve, reject) {
      if (error) {
        return reject(error)
      }

      if (entryStream) {
        resolve({ value: entryStream, done: false })
        entryStream = null
        return
      }

      promiseResolve = resolve
      promiseReject = reject

      consumeCallback(null)

      if (extract._finished && promiseResolve) {
        promiseResolve({ value: undefined, done: true })
        promiseResolve = promiseReject = null
      }
    }

    function onentry (header, stream, callback) {
      entryCallback = callback
      stream.on('error', noop) // no way around this due to tick sillyness

      if (promiseResolve) {
        promiseResolve({ value: stream, done: false })
        promiseResolve = promiseReject = null
      } else {
        entryStream = stream
      }
    }

    function onclose () {
      consumeCallback(error)
      if (!promiseResolve) return
      if (error) promiseReject(error)
      else promiseResolve({ value: undefined, done: true })
      promiseResolve = promiseReject = null
    }

    function destroy (err) {
      extract.destroy(err)
      consumeCallback(err)
      return new Promise((resolve, reject) => {
        if (extract.destroyed) return resolve({ value: undefined, done: true })
        extract.once('close', function () {
          if (err) reject(err)
          else resolve({ value: undefined, done: true })
        })
      })
    }
  }
}

module.exports = function extract (opts) {
  return new Extract(opts)
}

function noop () {}

function overflow (size) {
  size &= 511
  return size && 512 - size
}


/***/ }),

/***/ 88428:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const b4a = __webpack_require__(73057)

const ZEROS = '0000000000000000000'
const SEVENS = '7777777777777777777'
const ZERO_OFFSET = '0'.charCodeAt(0)
const USTAR_MAGIC = b4a.from([0x75, 0x73, 0x74, 0x61, 0x72, 0x00]) // ustar\x00
const USTAR_VER = b4a.from([ZERO_OFFSET, ZERO_OFFSET])
const GNU_MAGIC = b4a.from([0x75, 0x73, 0x74, 0x61, 0x72, 0x20]) // ustar\x20
const GNU_VER = b4a.from([0x20, 0x00])
const MASK = 0o7777
const MAGIC_OFFSET = 257
const VERSION_OFFSET = 263

exports.decodeLongPath = function decodeLongPath (buf, encoding) {
  return decodeStr(buf, 0, buf.length, encoding)
}

exports.encodePax = function encodePax (opts) { // TODO: encode more stuff in pax
  let result = ''
  if (opts.name) result += addLength(' path=' + opts.name + '\n')
  if (opts.linkname) result += addLength(' linkpath=' + opts.linkname + '\n')
  const pax = opts.pax
  if (pax) {
    for (const key in pax) {
      result += addLength(' ' + key + '=' + pax[key] + '\n')
    }
  }
  return b4a.from(result)
}

exports.decodePax = function decodePax (buf) {
  const result = {}

  while (buf.length) {
    let i = 0
    while (i < buf.length && buf[i] !== 32) i++
    const len = parseInt(b4a.toString(buf.subarray(0, i)), 10)
    if (!len) return result

    const b = b4a.toString(buf.subarray(i + 1, len - 1))
    const keyIndex = b.indexOf('=')
    if (keyIndex === -1) return result
    result[b.slice(0, keyIndex)] = b.slice(keyIndex + 1)

    buf = buf.subarray(len)
  }

  return result
}

exports.encode = function encode (opts) {
  const buf = b4a.alloc(512)
  let name = opts.name
  let prefix = ''

  if (opts.typeflag === 5 && name[name.length - 1] !== '/') name += '/'
  if (b4a.byteLength(name) !== name.length) return null // utf-8

  while (b4a.byteLength(name) > 100) {
    const i = name.indexOf('/')
    if (i === -1) return null
    prefix += prefix ? '/' + name.slice(0, i) : name.slice(0, i)
    name = name.slice(i + 1)
  }

  if (b4a.byteLength(name) > 100 || b4a.byteLength(prefix) > 155) return null
  if (opts.linkname && b4a.byteLength(opts.linkname) > 100) return null

  b4a.write(buf, name)
  b4a.write(buf, encodeOct(opts.mode & MASK, 6), 100)
  b4a.write(buf, encodeOct(opts.uid, 6), 108)
  b4a.write(buf, encodeOct(opts.gid, 6), 116)
  encodeSize(opts.size, buf, 124)
  b4a.write(buf, encodeOct((opts.mtime.getTime() / 1000) | 0, 11), 136)

  buf[156] = ZERO_OFFSET + toTypeflag(opts.type)

  if (opts.linkname) b4a.write(buf, opts.linkname, 157)

  b4a.copy(USTAR_MAGIC, buf, MAGIC_OFFSET)
  b4a.copy(USTAR_VER, buf, VERSION_OFFSET)
  if (opts.uname) b4a.write(buf, opts.uname, 265)
  if (opts.gname) b4a.write(buf, opts.gname, 297)
  b4a.write(buf, encodeOct(opts.devmajor || 0, 6), 329)
  b4a.write(buf, encodeOct(opts.devminor || 0, 6), 337)

  if (prefix) b4a.write(buf, prefix, 345)

  b4a.write(buf, encodeOct(cksum(buf), 6), 148)

  return buf
}

exports.decode = function decode (buf, filenameEncoding, allowUnknownFormat) {
  let typeflag = buf[156] === 0 ? 0 : buf[156] - ZERO_OFFSET

  let name = decodeStr(buf, 0, 100, filenameEncoding)
  const mode = decodeOct(buf, 100, 8)
  const uid = decodeOct(buf, 108, 8)
  const gid = decodeOct(buf, 116, 8)
  const size = decodeOct(buf, 124, 12)
  const mtime = decodeOct(buf, 136, 12)
  const type = toType(typeflag)
  const linkname = buf[157] === 0 ? null : decodeStr(buf, 157, 100, filenameEncoding)
  const uname = decodeStr(buf, 265, 32)
  const gname = decodeStr(buf, 297, 32)
  const devmajor = decodeOct(buf, 329, 8)
  const devminor = decodeOct(buf, 337, 8)

  const c = cksum(buf)

  // checksum is still initial value if header was null.
  if (c === 8 * 32) return null

  // valid checksum
  if (c !== decodeOct(buf, 148, 8)) throw new Error('Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?')

  if (isUSTAR(buf)) {
    // ustar (posix) format.
    // prepend prefix, if present.
    if (buf[345]) name = decodeStr(buf, 345, 155, filenameEncoding) + '/' + name
  } else if (isGNU(buf)) {
    // 'gnu'/'oldgnu' format. Similar to ustar, but has support for incremental and
    // multi-volume tarballs.
  } else {
    if (!allowUnknownFormat) {
      throw new Error('Invalid tar header: unknown format.')
    }
  }

  // to support old tar versions that use trailing / to indicate dirs
  if (typeflag === 0 && name && name[name.length - 1] === '/') typeflag = 5

  return {
    name,
    mode,
    uid,
    gid,
    size,
    mtime: new Date(1000 * mtime),
    type,
    linkname,
    uname,
    gname,
    devmajor,
    devminor,
    pax: null
  }
}

function isUSTAR (buf) {
  return b4a.equals(USTAR_MAGIC, buf.subarray(MAGIC_OFFSET, MAGIC_OFFSET + 6))
}

function isGNU (buf) {
  return b4a.equals(GNU_MAGIC, buf.subarray(MAGIC_OFFSET, MAGIC_OFFSET + 6)) &&
    b4a.equals(GNU_VER, buf.subarray(VERSION_OFFSET, VERSION_OFFSET + 2))
}

function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function toType (flag) {
  switch (flag) {
    case 0:
      return 'file'
    case 1:
      return 'link'
    case 2:
      return 'symlink'
    case 3:
      return 'character-device'
    case 4:
      return 'block-device'
    case 5:
      return 'directory'
    case 6:
      return 'fifo'
    case 7:
      return 'contiguous-file'
    case 72:
      return 'pax-header'
    case 55:
      return 'pax-global-header'
    case 27:
      return 'gnu-long-link-path'
    case 28:
    case 30:
      return 'gnu-long-path'
  }

  return null
}

function toTypeflag (flag) {
  switch (flag) {
    case 'file':
      return 0
    case 'link':
      return 1
    case 'symlink':
      return 2
    case 'character-device':
      return 3
    case 'block-device':
      return 4
    case 'directory':
      return 5
    case 'fifo':
      return 6
    case 'contiguous-file':
      return 7
    case 'pax-header':
      return 72
  }

  return 0
}

function indexOf (block, num, offset, end) {
  for (; offset < end; offset++) {
    if (block[offset] === num) return offset
  }
  return end
}

function cksum (block) {
  let sum = 8 * 32
  for (let i = 0; i < 148; i++) sum += block[i]
  for (let j = 156; j < 512; j++) sum += block[j]
  return sum
}

function encodeOct (val, n) {
  val = val.toString(8)
  if (val.length > n) return SEVENS.slice(0, n) + ' '
  return ZEROS.slice(0, n - val.length) + val + ' '
}

function encodeSizeBin (num, buf, off) {
  buf[off] = 0x80
  for (let i = 11; i > 0; i--) {
    buf[off + i] = num & 0xff
    num = Math.floor(num / 0x100)
  }
}

function encodeSize (num, buf, off) {
  if (num.toString(8).length > 11) {
    encodeSizeBin(num, buf, off)
  } else {
    b4a.write(buf, encodeOct(num, 11), off)
  }
}

/* Copied from the node-tar repo and modified to meet
 * tar-stream coding standard.
 *
 * Source: https://github.com/npm/node-tar/blob/51b6627a1f357d2eb433e7378e5f05e83b7aa6cd/lib/header.js#L349
 */
function parse256 (buf) {
  // first byte MUST be either 80 or FF
  // 80 for positive, FF for 2's comp
  let positive
  if (buf[0] === 0x80) positive = true
  else if (buf[0] === 0xFF) positive = false
  else return null

  // build up a base-256 tuple from the least sig to the highest
  const tuple = []
  let i
  for (i = buf.length - 1; i > 0; i--) {
    const byte = buf[i]
    if (positive) tuple.push(byte)
    else tuple.push(0xFF - byte)
  }

  let sum = 0
  const l = tuple.length
  for (i = 0; i < l; i++) {
    sum += tuple[i] * Math.pow(256, i)
  }

  return positive ? sum : -1 * sum
}

function decodeOct (val, offset, length) {
  val = val.subarray(offset, offset + length)
  offset = 0

  // If prefixed with 0x80 then parse as a base-256 integer
  if (val[offset] & 0x80) {
    return parse256(val)
  } else {
    // Older versions of tar can prefix with spaces
    while (offset < val.length && val[offset] === 32) offset++
    const end = clamp(indexOf(val, 32, offset, val.length), val.length, val.length)
    while (offset < end && val[offset] === 0) offset++
    if (end === offset) return 0
    return parseInt(b4a.toString(val.subarray(offset, end)), 8)
  }
}

function decodeStr (val, offset, length, encoding) {
  return b4a.toString(val.subarray(offset, indexOf(val, 0, offset, offset + length)), encoding)
}

function addLength (str) {
  const len = b4a.byteLength(str)
  let digits = Math.floor(Math.log(len) / Math.log(10)) + 1
  if (len + digits >= Math.pow(10, digits)) digits++

  return (len + digits) + str
}


/***/ }),

/***/ 56118:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.extract = __webpack_require__(35763)
exports.pack = __webpack_require__(80861)


/***/ }),

/***/ 80861:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Readable, Writable, getStreamError } = __webpack_require__(36204)
const b4a = __webpack_require__(73057)

const constants = __webpack_require__(20775)
const headers = __webpack_require__(88428)

const DMODE = 0o755
const FMODE = 0o644

const END_OF_TAR = b4a.alloc(1024)

class Sink extends Writable {
  constructor (pack, header, callback) {
    super({ mapWritable, eagerOpen: true })

    this.written = 0
    this.header = header

    this._callback = callback
    this._linkname = null
    this._isLinkname = header.type === 'symlink' && !header.linkname
    this._isVoid = header.type !== 'file' && header.type !== 'contiguous-file'
    this._finished = false
    this._pack = pack
    this._openCallback = null

    if (this._pack._stream === null) this._pack._stream = this
    else this._pack._pending.push(this)
  }

  _open (cb) {
    this._openCallback = cb
    if (this._pack._stream === this) this._continueOpen()
  }

  _continuePack (err) {
    if (this._callback === null) return

    const callback = this._callback
    this._callback = null

    callback(err)
  }

  _continueOpen () {
    if (this._pack._stream === null) this._pack._stream = this

    const cb = this._openCallback
    this._openCallback = null
    if (cb === null) return

    if (this._pack.destroying) return cb(new Error('pack stream destroyed'))
    if (this._pack._finalized) return cb(new Error('pack stream is already finalized'))

    this._pack._stream = this

    if (!this._isLinkname) {
      this._pack._encode(this.header)
    }

    if (this._isVoid) {
      this._finish()
      this._continuePack(null)
    }

    cb(null)
  }

  _write (data, cb) {
    if (this._isLinkname) {
      this._linkname = this._linkname ? b4a.concat([this._linkname, data]) : data
      return cb(null)
    }

    if (this._isVoid) {
      if (data.byteLength > 0) {
        return cb(new Error('No body allowed for this entry'))
      }
      return cb()
    }

    this.written += data.byteLength
    if (this._pack.push(data)) return cb()
    this._pack._drain = cb
  }

  _finish () {
    if (this._finished) return
    this._finished = true

    if (this._isLinkname) {
      this.header.linkname = this._linkname ? b4a.toString(this._linkname, 'utf-8') : ''
      this._pack._encode(this.header)
    }

    overflow(this._pack, this.header.size)

    this._pack._done(this)
  }

  _final (cb) {
    if (this.written !== this.header.size) { // corrupting tar
      return cb(new Error('Size mismatch'))
    }

    this._finish()
    cb(null)
  }

  _getError () {
    return getStreamError(this) || new Error('tar entry destroyed')
  }

  _predestroy () {
    this._pack.destroy(this._getError())
  }

  _destroy (cb) {
    this._pack._done(this)

    this._continuePack(this._finished ? null : this._getError())

    cb()
  }
}

class Pack extends Readable {
  constructor (opts) {
    super(opts)
    this._drain = noop
    this._finalized = false
    this._finalizing = false
    this._pending = []
    this._stream = null
  }

  entry (header, buffer, callback) {
    if (this._finalized || this.destroying) throw new Error('already finalized or destroyed')

    if (typeof buffer === 'function') {
      callback = buffer
      buffer = null
    }

    if (!callback) callback = noop

    if (!header.size || header.type === 'symlink') header.size = 0
    if (!header.type) header.type = modeToType(header.mode)
    if (!header.mode) header.mode = header.type === 'directory' ? DMODE : FMODE
    if (!header.uid) header.uid = 0
    if (!header.gid) header.gid = 0
    if (!header.mtime) header.mtime = new Date()

    if (typeof buffer === 'string') buffer = b4a.from(buffer)

    const sink = new Sink(this, header, callback)

    if (b4a.isBuffer(buffer)) {
      header.size = buffer.byteLength
      sink.write(buffer)
      sink.end()
      return sink
    }

    if (sink._isVoid) {
      return sink
    }

    return sink
  }

  finalize () {
    if (this._stream || this._pending.length > 0) {
      this._finalizing = true
      return
    }

    if (this._finalized) return
    this._finalized = true

    this.push(END_OF_TAR)
    this.push(null)
  }

  _done (stream) {
    if (stream !== this._stream) return

    this._stream = null

    if (this._finalizing) this.finalize()
    if (this._pending.length) this._pending.shift()._continueOpen()
  }

  _encode (header) {
    if (!header.pax) {
      const buf = headers.encode(header)
      if (buf) {
        this.push(buf)
        return
      }
    }
    this._encodePax(header)
  }

  _encodePax (header) {
    const paxHeader = headers.encodePax({
      name: header.name,
      linkname: header.linkname,
      pax: header.pax
    })

    const newHeader = {
      name: 'PaxHeader',
      mode: header.mode,
      uid: header.uid,
      gid: header.gid,
      size: paxHeader.byteLength,
      mtime: header.mtime,
      type: 'pax-header',
      linkname: header.linkname && 'PaxHeader',
      uname: header.uname,
      gname: header.gname,
      devmajor: header.devmajor,
      devminor: header.devminor
    }

    this.push(headers.encode(newHeader))
    this.push(paxHeader)
    overflow(this, paxHeader.byteLength)

    newHeader.size = header.size
    newHeader.type = header.type
    this.push(headers.encode(newHeader))
  }

  _doDrain () {
    const drain = this._drain
    this._drain = noop
    drain()
  }

  _predestroy () {
    const err = getStreamError(this)

    if (this._stream) this._stream.destroy(err)

    while (this._pending.length) {
      const stream = this._pending.shift()
      stream.destroy(err)
      stream._continueOpen()
    }

    this._doDrain()
  }

  _read (cb) {
    this._doDrain()
    cb()
  }
}

module.exports = function pack (opts) {
  return new Pack(opts)
}

function modeToType (mode) {
  switch (mode & constants.S_IFMT) {
    case constants.S_IFBLK: return 'block-device'
    case constants.S_IFCHR: return 'character-device'
    case constants.S_IFDIR: return 'directory'
    case constants.S_IFIFO: return 'fifo'
    case constants.S_IFLNK: return 'symlink'
  }

  return 'file'
}

function noop () {}

function overflow (self, size) {
  size &= 511
  if (size) self.push(END_OF_TAR.subarray(0, 512 - size))
}

function mapWritable (buf) {
  return b4a.isBuffer(buf) ? buf : b4a.from(buf)
}


/***/ }),

/***/ 97934:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const PassThroughDecoder = __webpack_require__(47256)
const UTF8Decoder = __webpack_require__(86414)

module.exports = class TextDecoder {
  constructor (encoding = 'utf8') {
    this.encoding = normalizeEncoding(encoding)

    switch (this.encoding) {
      case 'utf8':
        this.decoder = new UTF8Decoder()
        break
      case 'utf16le':
      case 'base64':
        throw new Error('Unsupported encoding: ' + this.encoding)
      default:
        this.decoder = new PassThroughDecoder(this.encoding)
    }
  }

  get remaining () {
    return this.decoder.remaining
  }

  push (data) {
    if (typeof data === 'string') return data
    return this.decoder.decode(data)
  }

  // For Node.js compatibility
  write (data) {
    return this.push(data)
  }

  end (data) {
    let result = ''
    if (data) result = this.push(data)
    result += this.decoder.flush()
    return result
  }
}

function normalizeEncoding (encoding) {
  encoding = encoding.toLowerCase()

  switch (encoding) {
    case 'utf8':
    case 'utf-8':
      return 'utf8'
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return 'utf16le'
    case 'latin1':
    case 'binary':
      return 'latin1'
    case 'base64':
    case 'ascii':
    case 'hex':
      return encoding
    default:
      throw new Error('Unknown encoding: ' + encoding)
  }
};


/***/ }),

/***/ 47256:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const b4a = __webpack_require__(73057)

module.exports = class PassThroughDecoder {
  constructor (encoding) {
    this.encoding = encoding
  }

  get remaining () {
    return 0
  }

  decode (tail) {
    return b4a.toString(tail, this.encoding)
  }

  flush () {
    return ''
  }
}


/***/ }),

/***/ 86414:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const b4a = __webpack_require__(73057)

/**
 * https://encoding.spec.whatwg.org/#utf-8-decoder
 */
module.exports = class UTF8Decoder {
  constructor () {
    this.codePoint = 0
    this.bytesSeen = 0
    this.bytesNeeded = 0
    this.lowerBoundary = 0x80
    this.upperBoundary = 0xbf
  }

  get remaining () {
    return this.bytesSeen
  }

  decode (data) {
    // If we have a fast path, just sniff if the last part is a boundary
    if (this.bytesNeeded === 0) {
      let isBoundary = true

      for (let i = Math.max(0, data.byteLength - 4), n = data.byteLength; i < n && isBoundary; i++) {
        isBoundary = data[i] <= 0x7f
      }

      if (isBoundary) return b4a.toString(data, 'utf8')
    }

    let result = ''

    for (let i = 0, n = data.byteLength; i < n; i++) {
      const byte = data[i]

      if (this.bytesNeeded === 0) {
        if (byte <= 0x7f) {
          result += String.fromCharCode(byte)
        } else {
          this.bytesSeen = 1

          if (byte >= 0xc2 && byte <= 0xdf) {
            this.bytesNeeded = 2
            this.codePoint = byte & 0x1f
          } else if (byte >= 0xe0 && byte <= 0xef) {
            if (byte === 0xe0) this.lowerBoundary = 0xa0
            else if (byte === 0xed) this.upperBoundary = 0x9f
            this.bytesNeeded = 3
            this.codePoint = byte & 0xf
          } else if (byte >= 0xf0 && byte <= 0xf4) {
            if (byte === 0xf0) this.lowerBoundary = 0x90
            if (byte === 0xf4) this.upperBoundary = 0x8f
            this.bytesNeeded = 4
            this.codePoint = byte & 0x7
          } else {
            result += '\ufffd'
          }
        }

        continue
      }

      if (byte < this.lowerBoundary || byte > this.upperBoundary) {
        this.codePoint = 0
        this.bytesNeeded = 0
        this.bytesSeen = 0
        this.lowerBoundary = 0x80
        this.upperBoundary = 0xbf

        result += '\ufffd'

        continue
      }

      this.lowerBoundary = 0x80
      this.upperBoundary = 0xbf

      this.codePoint = (this.codePoint << 6) | (byte & 0x3f)
      this.bytesSeen++

      if (this.bytesSeen !== this.bytesNeeded) continue

      result += String.fromCodePoint(this.codePoint)

      this.codePoint = 0
      this.bytesNeeded = 0
      this.bytesSeen = 0
    }

    return result
  }

  flush () {
    const result = this.bytesNeeded > 0 ? '\ufffd' : ''

    this.codePoint = 0
    this.bytesNeeded = 0
    this.bytesSeen = 0
    this.lowerBoundary = 0x80
    this.upperBoundary = 0xbf

    return result
  }
}


/***/ }),

/***/ 58264:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ })

};
;
//# sourceMappingURL=645.index.js.map