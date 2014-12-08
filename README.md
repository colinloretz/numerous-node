## Getting Started

numerous-node is in the NPM repository. You can install it by running the command below:

```
npm install numerous-node
```  

To get started, you have two options depending on what you hope to accomplish:

## Option 1: Manage your own metrics
As a Numerous user, you can use your Numerous API key to programmatically create, update and manage your personal metrics.

```
var Numerous = require('numerous-node');
var numerous = new Numerous('YOUR NUMEROUS API KEY');
```

Then you can access the API:

```
numerous.getMyMetrics(function(metrics){  
	console.log(metrics);  
});
```



## Option 2: Channel Developers
As a channel developer, you can create channels that create metrics for other Numerous users. Doing so requires a Numerous Channel API key and ID, which you can sign up for in the developer portal.

```
var Numerous = require('numerous-node');
var numerousChannel = new Numerous('YOUR CHANNEL API KEY', 'YOUR CHANNEL ID');
```

This will not allow you to access all the endpoints from Numerous, but you will be able to use channel endpoints to create metrics and update metrics created by your channel.

```
numerous.getChannelMetrics(function(channelMetrics){  
	console.log('The metrics created by my channel are ', channelMetrics);  
});
```


