// All source code Copyright 2013 Cope Consultancy Services. All rights reserved


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create base root window
//
var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#fff'
});

var vertVw = Ti.UI.createView({layout: 'vertical'});

var compassHeading = Ti.UI.createLabel({color:'#000'});
var direction = Ti.UI.createLabel({color:'#000'});

function updateLabels(_args) {
	compassHeading.text = _args.heading.magneticHeading+ ' degrees';
	
	var headingText = null;
	var theBearing = _args.heading.magneticHeading;
	
	switch(true) {
		case theBearing>=0 && theBearing<23:
			headingText = 'North';
			break;
		case theBearing>=23 && theBearing<68:
			headingText = 'North East';
			break;
		case theBearing>=68 && theBearing<113:
			headingText = 'East';
			break;
		case theBearing>=113 && theBearing<158:
			headingText = 'South East';
			break;
		case theBearing>=158 && theBearing<203:
			headingText = 'South';
			break;
		case theBearing>=203 && theBearing<248:
			headingText = 'South West';
			break;
		case theBearing>=248 && theBearing<293:
			headingText = 'West';
			break;
		case theBearing>=293 && theBearing<338:
			headingText = 'North West';
			break;
		case theBearing>=338 && theBearing<=360:
			headingText = 'North';
			break;
             }
    lastHeading = _args.heading.magneticHeading;
	direction.text = 'You are looking '+headingText;

}

Ti.Geolocation.purpose = 'To get the compass bearing';

vertVw.add(compassHeading);
vertVw.add(direction);
win1.add(vertVw);
win1.open();

win1.addEventListener('blur', function() {Ti.Geolocation.removeEventListener("heading", updateLabels);});
win1.addEventListener('focus', function() {Ti.Geolocation.addEventListener("heading", updateLabels);});