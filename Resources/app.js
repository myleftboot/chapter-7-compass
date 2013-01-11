// All source code Copyright 2013 Cope Consultancy Services. All rights reserved


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create base root window
//
var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#fff'
});

var vertVw = Ti.UI.createView({layout: 'vertical'});

var compassHeading = Ti.UI.createLabel({});
var direction = Ti.UI.createLabel({});

function updateLabels(_args) {
	compassHeading.text = _args.magneticHeading+ ' degrees';
	
	var heading = null;
	
	
	direction.text = heading;
}

Ti.Geolocation.addEventListener("heading", updateLabels);

vertVw.add(compassHeading);
vertVw.add(direction);
win1.add(vertVw);
win1.open();
