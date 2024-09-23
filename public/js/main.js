/* eslint-disable no-unused-vars */
// Need to create the SECONDARY wheel first because on construct the variable which keeps track of the wheel to animate will
// be set to the last created wheel, and we want the outer one the primary with the animation etc.
let innerWheel = new Winwheel({
  'numSegments' : 4,
  'outerRadius' : 110,        // Set the outer radius to make the wheel smaller than the outer wheel.
  'segments': [
    {'fillStyle' : '#eae56f', 'text' : 'Inner 1'},
    {'fillStyle' : '#89f26e', 'text' : 'Inner 2'},
    {'fillStyle' : '#7de6ef', 'text' : 'Inner 3'},
    {'fillStyle' : '#e7706f', 'text' : 'Inner 4'}
  ]
});


// Define the outer wheel, we will treat this as the PRIMARY which means it clears the canvas when drawing and also
// gets the animaton applied to it. We must callback a function during the animation to move and draw the inner wheel
// so the 2 wheels appear as one thing on the canvas.
let outerWheel = new Winwheel({
  'numSegments': 8,
  'textMargin' : 0,
  'outerRadius' : 210,
  'innerRadius' : 110,    // Set inner radius to the size of the inner wheel since the inner part of the wheel
  'segments': [           //   is being drawn by the inner wheel we don't need to draw there.
    {'fillStyle' : '#8C8A42', 'text' : 'Outer 1'},
    {'fillStyle' : '#F2F0A8', 'text' : 'Outer 2'},
    {'fillStyle' : '#519142', 'text' : 'Outer 3'},
    {'fillStyle' : '#B7F7A8', 'text' : 'Outer 4'},
    {'fillStyle' : '#4B898F', 'text' : 'Outer 5'},
    {'fillStyle' : '#B1EFF5', 'text' : 'Outer 6'},
    {'fillStyle' : '#8A4342', 'text' : 'Outer 7'},
    {'fillStyle' : '#F0A9A8', 'text' : 'Outer 8'}
  ],
  'animation':
    {
      'type': 'spinToStop',                     // Define animation more or less as normal, except for the callbackAfter().
      'duration': 5,
      'spins': 5,
      'easing': 'Power3.easeOut',
      'callbackAfter' : drawInnerWheel,     // Call back after each frame of the animation a function we can draw the inner wheel from.
      'callbackFinished': alertPrize
    }
});

// Call draw on the outerWheel then the inner wheel to ensure that both are rendered on the canvas.
outerWheel.draw();
innerWheel.draw(false);   // Pass false to stop it clearing the canvas and wiping the outer wheel.

// This function is called after the outer wheel has drawn during the animation.
function drawInnerWheel()
{
  // Update the rotationAngle of the innnerWheel to match that of the outer wheel - this is a big part of what
  // links them to appear as one 2-part wheel. Call the draw function passing false so the outer wheel is not wiped.
  innerWheel.rotationAngle = outerWheel.rotationAngle;
  innerWheel.draw(false);
}

// Called when the animation has finished.
function alertPrize()
{
  // The the indicated segments from the 2 wheels.
  let winningInnerSegment = innerWheel.getIndicatedSegment();
  let winningOuterSegment = outerWheel.getIndicatedSegment();

  // Alert the combination of prizes won.
  alert('You won ' + winningInnerSegment.text + ', ' + winningOuterSegment.text);

  // Set things so power and spin button can be clicked again.
  wheelSpinning = false;

  // Remove all colours from the power level indicators.
  document.getElementById('pw1').className = "";
  document.getElementById('pw2').className = "";
  document.getElementById('pw3').className = "";
}


// ================================================================================================================
// FUNCTIONS FOR power controls below (All this is not necessary to actually create and spin a wheel)....
// Vars used by the code in this page to do power controls.
let wheelPower    = 0;
let wheelSpinning = false;

// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel)
{
  // Ensure that power can't be changed while wheel is spinning.
  if (wheelSpinning === false) {
    // Reset all to grey incase this is not the first time the user has selected the power.
    document.getElementById('pw1').className = "";
    document.getElementById('pw2').className = "";
    document.getElementById('pw3').className = "";

    // Now light up all cells below-and-including the one selected by changing the class.
    if (powerLevel >= 1) {
      document.getElementById('pw1').className = "pw1";
    }

    if (powerLevel >= 2) {
      document.getElementById('pw2').className = "pw2";
    }

    if (powerLevel >= 3) {
      document.getElementById('pw3').className = "pw3";
    }

    // Set wheelPower var used when spin button is clicked.
    wheelPower = powerLevel;

    // Light up the spin button by changing it's source image and adding a clickable class to it.
    document.getElementById('spin_button').src = location.origin + "/spin_on.png";
    document.getElementById('spin_button').className = "clickable";
  }
}

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin()
{
  // Ensure that spinning can't be clicked again while already running.
  if (wheelSpinning === false) {
    // Reset things with inner and outer wheel so spinning will work as expected. Without the reset the
    // wheel will probably just move a small amount since the rotationAngle would be close to the targetAngle
    // figured out by the animation.
    outerWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    outerWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    outerWheel.draw();                // Call draw to render changes to the wheel.
    innerWheel.rotationAngle = 0;
    innerWheel.draw(false);

    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
    // to rotate with the duration of the animation the quicker the wheel spins.
    if (wheelPower === 1) {
      outerWheel.animation.spins = 3;     // Number of spins and/or duration can be altered to make the wheel
      outerWheel.animation.duration = 7;  // appear to spin faster or slower.
    } else if (wheelPower === 2) {
      outerWheel.animation.spins = 8;
      outerWheel.animation.duration = 7;
    } else if (wheelPower === 3) {
      outerWheel.animation.spins = 15;
    }

    // Disable the spin button so can't click again while wheel is spinning.
    document.getElementById('spin_button').src       = location.origin + "/spin_off.png";
    document.getElementById('spin_button').className = "";

    // Begin the spin animation by calling startAnimation on the wheel object.
    outerWheel.startAnimation();

    // Set to true so that power can't be changed and spin button re-enabled during
    // the current animation. The user will have to reset before spinning again.
    wheelSpinning = true;
  }
}
