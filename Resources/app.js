// All source code Copyright 2013 Cope Consultancy Services. All rights reserved


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create base root window
//
var win1 = Titanium.UI.createWindow({  
    backgroundColor:'#fff'
});

var theHeading = 90;
var vertVw = Ti.UI.createView({layout: 'vertical'});
var ARView = Ti.UI.createView({layout: 'vertical'
	                          ,background: 'transparent'});
var Heading = Ti.UI.createLabel({color: 'red',
	                             font: {fontSize: '80dp'}
	                            });
	                            
var compassHeading = Ti.UI.createLabel({});
var direction = Ti.UI.createLabel({});

function updateLabels(_args) {
	Ti.API.info('Called'); 	
	compassHeading.text = _args.heading.magneticHeading+ ' degrees';
	
	theHeading = _args.heading.magneticHeading;
	Heading.text = theHeading;
	
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
    
Ti.Media.showCamera({animated:     false,
	                 autoHide:     false,
	                 showControls: false,
	                 autofocus:    false,
	                 overlay:      ARView
	              });
	displayHeadingOnAR();
}

vertVw.add(compassHeading);
vertVw.add(direction);
vertVw.add(ARButton);
win1.add(vertVw);
win1.open();


win1.addEventListener('close', function() {Ti.Geolocation.removeEventListener("heading", updateLabels);});
win1.addEventListener('focus', function() {Ti.Geolocation.addEventListener("heading", updateLabels);});