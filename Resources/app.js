// All source code Copyright 2013 Cope Consultancy Services. All rights reserved


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create base root window
//
var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#fff'
});

var viewAngle = 15; // the viewable area of the display in degrees
var pixelsPerDegree = Ti.Platform.displayCaps.platformWidth / viewAngle;
var theBearing;
var lastHeading = 0;

var vertVw = Ti.UI.createView({layout: 'vertical'});
var ARView = Ti.UI.createView({layout: 'vertical'
	                          ,background: 'transparent'});
var ARBearingLbl = Ti.UI.createLabel({color: 'red',
	                             font: {fontSize: '80dp'}
	                            });
	                            
var compassHeading = Ti.UI.createLabel({});
var direction = Ti.UI.createLabel({});

function newPosition(_args) {

  var newHeading = _args.heading;
  var newBearing = theBearing;
  
  // if heading near to N but slightly NE (such as 5 degrees), then bearings at 350+ need to be considered
  if ((newHeading <= viewAngle /2) && (360 - theBearing <= viewAngle / 2)) newBearing -= 360;
  // similarly if heading near to N but slightly NW (such as 355 degrees), then bearings at 5 or less need to be considered
  if ((newHeading >= (360 - viewAngle /2)) && (theBearing <= viewAngle / 2)) newBearing += 360;
  
  // if the heading with within the confines of the screen i.e. less than half a screen from the centre line (viewAngle is the middle)
  var isItOnScreen = (Math.abs(newHeading - newBearing) <= viewAngle / 2);
  var newPosition = Ti.Platform.displayCaps.platformWidth / 2 + ((newBearing - newHeading) * pixelsPerDegree);

  return {X: newPosition, onScreen: isItOnScreen};
}

function updateARView(_args) {
	// update the position of Heading
	var newX = newPosition({heading: _args.newBearing})
	// if the new heading is within -7.5 to +7.5 of the bearing then its on the display
	if (newX.onScreen) {
		// its a candidate for display
		ARBearingLbl.show();
		moveLbl = Ti.UI.createAnimation({center:{x:newX.X, y:'50%'},duration:0});
		ARBearingLbl.animate(moveLbl);
	} else
	{
		//Not in the display, hide it
		ARBearingLbl.hide();
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
	displayBearingOnAR();
};


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
	updateARView({newBearing: _args.heading.magneticHeading});
}

Ti.Geolocation.purpose = 'To get the compass bearing';

ARButton = Ti.UI.createButton({title: 'Follow bearing in AR'});
ARButton.addEventListener('click', showARView);

function displayBearingOnAR(_args) {
    
	ARView.add(ARBearingLbl);
};

function showARView() {
	if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1 ){
		ARBearingLbl.text = theBearing = 120; // set a value for the simulator
		simulatorAR();
	} else {
	    theBearing = lastHeading;
		Ti.Media.showCamera({animated:     false,
	                 autoHide:     false,
	                 showControls: false,
	                 autofocus:    false,
	                 overlay:      ARView
	              });
        ARBearingLbl.text = theBearing;
		displayBearingOnAR();
	}

}

vertVw.add(compassHeading);
vertVw.add(direction);
vertVw.add(ARButton);
win1.add(vertVw);
win1.open();


win1.addEventListener('close', function() {Ti.Geolocation.removeEventListener("heading", updateLabels);});
win1.addEventListener('focus', function() {Ti.Geolocation.addEventListener("heading", updateLabels);});