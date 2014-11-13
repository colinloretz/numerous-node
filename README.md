## Getting Started
numerous-node is in the NPM repository. You can install it by running the command below:
```
npm install numerous
```
To get started, first require the client and initialize with your Numerous API key

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