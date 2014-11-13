var request = require('request');

function Numerous(api_key) {
    this.url = 'https://api.numerousapp.com/v1';
    this.api_key = api_key;
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

module.exports = Numerous;