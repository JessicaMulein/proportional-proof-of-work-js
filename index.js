var crypto = require('crypto');

module.exports = {
	VERSION: 0.1,
	HASH_SIZE: 256, // SHA-256
	MAX_BITS: 255, // maximum number of required hash bits allowed HASH_SIZE - 1
	/**
	 * @param Buffer computedHash
	 * @returns {number}
	 */
	testBits: function(computedHash)
	{
		var zeroBits = 0;
		for (var i=0;i<computedHash.length; i++) {
			octet = computedHash[i];
			for (var j=128; j>0; j>>=1) {
				if (octet & j) {
					return zeroBits;
				}
				zeroBits++;
			}
		}
		return zeroBits;
	},
	/**
	 * @param Buffer computedHash
	 * @param int bits
	 * @returns {boolean}
	 */
	verifyBits: function(computedHash, bits)
	{
		if ((bits === null) || (bits === undefined)) {
			return false;
		}
		return (this.testBits(computedHash) >= bits);
	},
	/**
	 * @param float version
	 * @returns {boolean}
	 */
	versionCompatible: function(version)
	{
		return ((version !== null) && (version == this.VERSION));
	},
	parseWork: function(work)
	{
		var workObject = {
			version: null,
			bits: null,
			date: null,
			resource: null,
			rand: null,
			counter: null
		};
		// split string out into object
		var parts = work.trim().split(':', 6);
		workObject.version = parseFloat(parts[0]);
		workObject.bits = parts[1] ? parseInt(parts[1]) : null;
		workObject.date = parts[2] ? parseInt(parts[2]) : null;
		workObject.resource = parts[3] ? parts[3].toString().trim() : null;
		workObject.rand = parts[4] ? parts[4].toString().trim() : null; // base64
		workObject.counter = parts[5] ? parts[5].toString().trim() : null; // base64

		// validate
		// ensure version is compatible
		if (!this.versionCompatible(workObject.version)) {
			return false;
		}
		// check bits
		if ((workObject.bits === null) || (workObject.bits < 1) || (workObject.bits > this.MAX_BITS)) {
			return false;
		}
		// check date
		if ((workObject.date === null) || (workObject.date < 0)) {
			return false;
		}
		// check resource
		if ((workObject.resource === null) || (workObject.resource.length < 1)) {
			return false;
		}
		// check rand
		var base64regex = /^[a-zA-Z0-9\/+]*={0,2}$/;
		if ((workObject.rand === null) || (workObject.rand.length < 1) || (!base64regex.test(workObject.rand))) {
			return false;
		}
		// check counter
		if ((workObject.counter === null) || (workObject.counter.length < 1) || (!base64regex.test(workObject.counter))) {
			return false;
		}
		return workObject;
	},
	validateWork: function(work)
	{
		var workObject = this.parseWork(work);
		var hash = crypto.createHash('sha256').update(work).digest();
		return this.verifyBits(hash, workObject.bits);
	},
	/**
	 * @param int bits
	 * @param string resource
	 * @returns {*}
	 */
	work: function(bits, resource)
	{
		if ((bits < 1) || (bits > this.MAX_BITS)) {
			return false;
		}

		var counter = 0;
		var work = [
			this.VERSION,
			bits,
			Math.round(new Date().getTime()/1000),
			resource,
			crypto.randomBytes(this.HASH_SIZE/8).toString('base64'),
			null
		];
		var workStr = '';
		var matched = false;
		while (!matched) {
			work[5] = Buffer.from(counter.toString(), 'ascii').toString('base64');
			workStr = work.join(':');
			matched = this.validateWork(workStr);
			counter++;
		}

		return workStr;
	}
};

