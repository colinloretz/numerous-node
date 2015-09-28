var request = require('request');
var async = require('async');

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
                return callback(null, JSON.parse(body));
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
        } else if (res.statusCode !== 200 && res.statusCode !== 201 && res.statusCode !== 409) {
			console.log('Request error is ', res.statusCode);
            return callback(new Error(res.statusCode));
        } else {
            if (body) {
                return callback(null, JSON.parse(body));
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
                return callback(null, JSON.parse(body));
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

Numerous.prototype.updateMetricV2 = function(metric, callback) {
	var self = this;
	var metricData = JSON.parse(metric);
	var metricId = metricData.id
	self.makeRequest("PUT", "https://api.numerousapp.com/v2/metrics/" + metricId, metric, callback);
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

Numerous.prototype.getEventsForMetric = function(metricId, callback) {
    var self = this;
	self.makeRequest("GET", self.url + '/metrics/' + metricId + '/events', '', callback);
}

Numerous.prototype.getValueAt = function(metricId, timestamp, callback) {
	var self = this;
	self.makeRequest("GET", self.url + '/metrics/' + metricId + '/events/at?t=' + timestamp, '', callback);
}

Numerous.prototype.createEvent = function(metricId, valueJSON, callback) {
	var self = this;
	self.makeRequest("POST", self.url + '/metrics/' + metricId + '/events', valueJSON, callback)
}

Numerous.prototype.deleteEvent = function(metricId, eventId, callback) {
	var self = this;
	self.makeRequest("DELETE", self.url + '/metrics/' + metricId + '/events/' + eventId , undefined, callback)
}

Numerous.prototype.createComment = function(metricId, commentBody, callback) {
	var self = this;
	var event = { kind: "comment", commentBody: commentBody };
	var jsonBody = JSON.stringify(event);
	self.makeRequest("POST", self.url + '/metrics/' + metricId + '/interactions', jsonBody, callback)
}

Numerous.prototype.createCommentWithDate = function(metricId, commentDate, commentBody, callback) {
	var self = this;
	var event = { kind: "comment", commentBody: commentBody, updated: commentDate.toISOString() };
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
	self.makeRequest("GET", 'https://api.numerousapp.com/v2/channels?status=dev', undefined, callback);
}

Numerous.prototype.getMyChannels = function(callback) {
    var self = this;
	self.makeRequest("GET", 'https://api.numerousapp.com/v1/users/me/channels?status=all', undefined, callback);
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

Numerous.prototype.getChannelMetricsWithSourceClass = function(sourceClass, callback) {
	var self = this;
	self.makeRequest("GET", self.url + '/channels/' + self.channelId + '/metrics?sourceClass=' + sourceClass, undefined, callback);
}

Numerous.prototype.getChannelMetricsWithSourceClassV2 = function(sourceClass, callback) {
	var self = this;
	self.makeRequest("GET", 'https://api.numerousapp.com/v2/channels/' + self.channelId + '/metrics/' + sourceClass, undefined, callback);
}

Numerous.prototype.getChannelMetricsWithSourceClassV2Paged = function(sourceClass, _cb) {
	var self = this;
	var metrics = [];
	var allMetrics = [];
	var sourceClassMetricURL = 'https://api.numerousapp.com/v2/channels/' + self.channelId + '/metrics/' + sourceClass;
	
    async.doWhilst(function(callback) {
		self.makeRequest("GET", sourceClassMetricURL, undefined, function(err, res) {
			if(err) {
				callback(err, res);
			} else {
				metrics = res.metrics;
				if(metrics.length > 0) {
					metrics.forEach(function(item) {
						allMetrics.push(item);	
					});
				}
				sourceClassMetricURL = res.nextURL;
				callback();
			}	
		});
    }, function() {
		return sourceClassMetricURL;
    }, function(err) {
		_cb(err, allMetrics);
    });
}

Numerous.prototype.getChannelMetrics = function(callback) {
	var self = this;
	self.makeRequest("GET", self.url + '/channels/' + self.channelId + '/metrics', undefined, callback);
}

Numerous.prototype.getChannelMetricsV2 = function(nextURL, callback) {
	var self = this;
	if(nextURL == null) {
		self.makeRequest("GET", 'https://api.numerousapp.com/v2/channels/' + self.channelId + '/metrics', undefined, callback);
	} else {
		self.makeRequest("GET", nextURL, undefined, callback);
		
	}
}

Numerous.prototype.getChannelMetricsPaged = function(_cb) {
    var self = this;	
	var metrics = [];
	var allMetrics = [];
	var channelMetricURL = 'https://api.numerousapp.com/v2/channels/' + self.channelId + '/metrics';
	
    async.doWhilst(function(callback) {
		self.makeRequest("GET", channelMetricURL, undefined, function(err, res) {
			if(err) {
				callback(err, res);
			} else {
				metrics = res.metrics;
				if(metrics) {
					metrics.forEach(function(item) {
						allMetrics.push(item);	
					});
				}
				channelMetricURL = res.nextURL;
				callback();
			}	
		});
    }, function() {
		return channelMetricURL;
    }, function(err) {
		_cb(err, allMetrics);
    });
	
}

Numerous.prototype.createChannelMetric = function(metric, token, callback) {
	var self = this;
	self.makeChannelRequest("POST", self.url + '/metrics', metric, token, callback);
}

Numerous.prototype.createChannelMetricV2 = function(metric, sourceClass, sourceKey, token, callback) {
	var self = this;
	self.makeChannelRequest("POST", "https://api.numerousapp.com/v2/channels/" + self.channelId + "/metrics/" + sourceClass + "/" + sourceKey, metric, token, callback);
}

Numerous.prototype.findOrCreateMetric = function(metric, sourceClass, sourceKey, token, callback) {
	var self = this;
	self.makeChannelRequest("POST", "https://api.numerousapp.com/v2/channels/" + self.channelId + "/metrics/" + sourceClass + "/" + sourceKey, metric, token, callback);
}

/* Credentials */

Numerous.prototype.storeCreds = function(userId, serviceId, payload, callback){
	var self = this;
	self.makeRequest("PUT", "https://api.numerousapp.com/v2/users/" + userId + "/creds/" + serviceId, payload, callback); 
}

Numerous.prototype.getCreds = function(userId, serviceId, callback){
	var self = this;
	self.makeRequest("GET", "https://api.numerousapp.com/v2/users/" + userId + "/creds/" + serviceId, undefined, callback); 
}

Numerous.prototype.deleteCreds = function(userId, serviceId, callback){
	var self = this;
	self.makeRequest("DELETE", "https://api.numerousapp.com/v2/users/" + userId + "/creds/" + serviceId, undefined, callback); 
}


module.exports = Numerous;