var request = require('request');

function Numerous(api_key) {
    this.url = 'https://api.numerousapp.com/v1';
    this.api_key = api_key;
}

function Numerous(api_key, channelId) {
    this.url = 'https://api.numerousapp.com/v1';
    this.api_key = api_key;
	this.channelId = channelId;
}

Numerous.prototype.makeRequest = function(verb, url, body, callback) {
	var self = this;
	
	if(body == undefined) {
		body = "";
	}
	
    var options = {
        uri: url,
        method: verb,
        headers: {
            'Authorization': 'Basic ' + new Buffer(self.api_key + ':').toString('base64'),
			'Content-Type': 'application/json'
        },
		body: body
    }
	
   request(options, function(err, res, body) {
        if (err) {
            return callback(err);
        } else if (res.statusCode !== 200 && res.statusCode !== 201) {
            return callback(new Error(res.statusCode));
        } else {
            if (body) {
                return callback(body);
            } else {
                return callback(null, body);
            }
        }
    });
}

Numerous.prototype.makeChannelRequest = function(verb, url, body, token, callback) {
	var self = this;
	
	if(body == undefined) {
		body = "";
	}
	
    var options = {
        uri: url,
        method: verb,
        headers: {
            'Authorization': 'Basic ' + new Buffer(self.api_key + ':').toString('base64'),
			'Content-Type': 'application/json',
			'X-Numerous-Token' : token
        },
		body: body
    }
	
   request(options, function(err, res, body) {
        if (err) {
			console.log('Request error is ', err);
            return callback(err);
        } else if (res.statusCode !== 200 && res.statusCode !== 201) {
			console.log('Request error is ', res.statusCode);
            return callback(new Error(res.statusCode));
        } else {
            if (body) {
                return callback(body);
            } else {
                return callback(null, body);
            }
        }
    });
}

Numerous.prototype.makeFormRequest = function(verb, url, formData, callback) {
	var self = this;
	
    var options = {
        uri: url,
        method: verb,
        headers: {
            'Authorization': 'Basic ' + new Buffer(self.api_key + ':').toString('base64'),
        },
		formData: formData
    }
	
	request(options, function (err, res, body) {
        if (err) {
			console.log('Request error is ', err);
            return callback(err);
        } else if (res.statusCode !== 200 && res.statusCode !== 201) {
			console.log('Request error is ', res.statusCode);
            return callback(new Error(res.statusCode));
        } else {
            if (body) {
                return callback(body);
            } else {
                return callback(null, body);
            }
        }
	});
}

Numerous.prototype.getMyMetrics = function(callback) {
    var self = this;
	self.makeRequest("GET", self.url + '/users/me/metrics', undefined, callback);
}

Numerous.prototype.createMetric = function(metric, callback) {
	var self = this;
	self.makeRequest("POST", self.url + '/metrics', metric, callback);
}

Numerous.prototype.getMetric = function(metricId, callback) {
	var self = this;
	self.makeRequest("GET", self.url + '/metrics/' + metricId + "?expand=owner", undefined, callback);
}

Numerous.prototype.updateMetric = function(metric, callback) {
	var self = this;
	var metricData = JSON.parse(metric);
	var metricId = metricData.id
	self.makeRequest("PUT", self.url + '/metrics/' + metricId, metric, callback);
}

Numerous.prototype.addMetricPhotoByUrl = function(metricId, photoURL, callback) {
	var self = this;
	var formData = { image : request(photoURL) };
	self.makeFormRequest("POST", self.url + '/metrics/' + metricId + '/photo', formData, callback); 
}

Numerous.prototype.deleteMetric = function(metricId, callback) {
	var self = this;
	self.makeRequest("DELETE", self.url + '/metrics/' + metricId, undefined, callback);
}

Numerous.prototype.getMySubscriptions = function(callback) {
    var self = this;
	self.makeRequest("GET", self.url + '/users/me/subscriptions', '', callback);
}

Numerous.prototype.createEvent = function(metricId, valueJSON, callback) {
	var self = this;
	self.makeRequest("POST", self.url + '/metrics/' + metricId + '/events', valueJSON, callback)
}

Numerous.prototype.createComment = function(metricId, commentBody, callback) {
	var self = this;
	var event = { kind: "comment", commentBody: commentBody };
	var jsonBody = JSON.stringify(event);
	self.makeRequest("POST", self.url + '/metrics/' + metricId + '/interactions', jsonBody, callback)
}

Numerous.prototype.createError = function(metricId, commentBody, callback) {
	var self = this;
	var event = { kind: "error", commentBody: commentBody };
	var jsonBody = JSON.stringify(event);
	self.makeRequest("POST", self.url + '/metrics/' + metricId + '/interactions', jsonBody, callback)
}

/* ************************************** */
/* Developer Channel Management Endpoints */
/* ************************************** */

Numerous.prototype.getChannels = function(callback) {
    var self = this;
	self.makeRequest("GET", self.url + '/channels', undefined, callback);
}

Numerous.prototype.createChannel = function(channel, callback) {
	var self = this;
	self.makeRequest("POST", self.url + '/channels', channel, callback);
}

Numerous.prototype.getChannel = function(channelId, callback) {
	var self = this;
	self.makeRequest("GET", self.url + '/channels/' + channelId, undefined, callback);
}

Numerous.prototype.updateChannel = function(channel, callback) {
	var self = this;
	var channelData = JSON.parse(channel);
	var channelId = channel.id
	self.makeRequest("PUT", self.url + '/channels/' + channelId, channel, callback);
}

Numerous.prototype.getChannelMetrics = function(callback) {
	var self = this;
	self.makeRequest("GET", self.url + '/channels/' + self.channelId + '/metrics', undefined, callback);
}

Numerous.prototype.createChannelMetric = function(metric, token, callback) {
	var self = this;
	self.makeChannelRequest("POST", self.url + '/metrics', metric, token, callback);
}

module.exports = Numerous;