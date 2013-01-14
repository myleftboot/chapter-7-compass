// All source code Copyright 2013 Cope Consultancy Services. All rights reserved


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create base root window
//
var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#fff'
});

var viewAngle = 15;
var pixelsPerDegree = Ti.Platform.displayCaps.platformWidth / viewAngle;
var theBearing = 2;
var lastHeading = 0;

var vertVw = Ti.UI.createView({layout: 'vertical'});
var ARView = Ti.UI.createView({layout: 'vertical'
	                          ,background: 'transparent'});
var Heading = Ti.UI.createLabel({color: 'red',
	                             font: {fontSize: '80dp'},
	                             text: theBearing,
	                             center: {x:Ti.Platform.displayCaps.platformWidth/2, y:'50%'}
	                            });
	                            
var compassHeading = Ti.UI.createLabel({});
var direction = Ti.UI.createLabel({});

function getHighBearing(_args) {
	if (_args < (viewAngle / 2)) return 360 + _args;
	else return _args;
};

function getLowBearing(_args) {
	if ((360 - _args) < (viewAngle / 2)) return (360 - _args) * -1;
	else return _args;
};
//TODO need to work on the wraparound
//TODO something needs to be done to rotate the display on Android
//TODO I think that it needs to be set to landscape

function updateARView(_args) {
	// update the position of Heading
	Ti.API.info('New Bearing'+_args.newBearing+ 'High'+ getHighBearing(_args.newBearing)+'Low'+getLowBearing(_args.newBearing));
	// if the new heading is within -7.5 to +7.5 of the bearing then its on the display
	if (Math.abs(_args.newBearing - theBearing) <= viewAngle / 2) {
		// its a candidate for display
		Ti.API.info('Its in range, display it');
		Heading.show();
		// now compute its postion or move it
		var existingPosition = JSON.stringify(Heading.center);
		Ti.API.info(existingPosition);
		
		var newX = Ti.Platform.displayCaps.platformWidth / 2 - (_args.newBearing - theBearing) * pixelsPerDegree;
		Ti.API.info('newX '+newX);
		moveIt = Ti.UI.createAnimation({center:{x:newX, y:'50%'},duration:0.5});
		Heading.animate(moveIt);
	} else
	{
		Ti.API.info('Not in the display, hide it');
		Heading.hide();
	}

};

function simulatorAR() {
	ARView.backgroundColor = 'white';
	win1.add(ARView);
	
	// add slider to the window
	var slider = Ti.UI.createSlider({
		backgroundColor:'transparent',
		min: 0,
		max: 10,
		value: theBearing/360*10,
		width: 300,
		top: 10
	});

	slider.addEventListener('change', function(e) {
		updateARView({newBearing: e.value * 36});
	});
	ARView.add(slider);
	displayHeadingOnAR();
};

function isOnDisplay(_args) {
	// Parameters 
	// currentHeading -- the compass reading
	// if the heading is within +- 7.5 degrees of the bearing then it must be on the display
	if (abs(_args.currentHeading - getLowBearing(theBearing)) <= viewAngle / 2) {
		Ti.API.info('its in range');
	}
}



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
    lastHeading = _args.heading.magneticHeading;
	direction.text = 'You are looking '+headingText;
	updateARView({newBearing: _args.heading.magneticHeading});
}

Ti.Geolocation.purpose = 'To get the compass bearing';

ARButton = Ti.UI.createButton({title: 'Follow bearing in AR'});
ARButton.addEventListener('click', showARView);

function displayHeadingOnAR(_args) {
	
//	var horizon = Ti.UI.createView({width: 2
//		                       ,color: 'red'
//		                       ,top:    '50%'
//		                    });

//	ARView.add(horizon);
    
	ARView.add(Heading);
};

function showARView() {
	if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1 ){
		simulatorAR();
	} else {
		Ti.Media.showCamera({animated:     false,
	                 autoHide:     false,
	                 showControls: false,
	                 autofocus:    false,
	                 overlay:      ARView
	              });
	    theBearing = lastHeading;
		displayHeadingOnAR();
	}

}

vertVw.add(compassHeading);
vertVw.add(direction);
vertVw.add(ARButton);
win1.add(vertVw);
win1.open();


win1.addEventListener('close', function() {Ti.Geolocation.removeEventListener("heading", updateLabels);});
win1.addEventListener('focus', function() {Ti.Geolocation.addEventListener("heading", updateLabels);});