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
	compassHeading.text = _args.heading.magneticHeading+ ' degrees';
	
	var headingText = null;
	var h = _args.heading.magneticHeading;
	switch(true) {
		case h>=0&&h<23:
			headingText = 'N';
			break;
		case h>=23&&h<68:
			headingText = 'NE';
			break;
		case h>=68&&h<113:
			headingText = 'E';
			break;
		case h>=113&&h<158:
			headingText = 'SE';
			break;
		case h>=158&&h<203:
			headingText = 'S';
			break;
		case h>=203&&h<248:
			headingText = 'SW';
			break;
		case h>=248&&h<293:
			headingText = 'W';
			break;
		case h>=293&&h<338:
			headingText = 'NW';
			break;
		case h>=338&&h<=360:
			headingText = 'N';
			break;
             }
	direction.text = 'You are looking '+headingText;
}

Ti.Geolocation.purpose = 'To get the compass bearing';

vertVw.add(compassHeading);
vertVw.add(direction);
win1.add(vertVw);
win1.open();

win1.addEventListener('blur', function() {Ti.Geolocation.removeEventListener("heading", updateLabels);});
win1.addEventListener('focus', function() {Ti.Geolocation.addEventListener("heading", updateLabels);});