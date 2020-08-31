$("#Demo-1-StartButton").click(function(e){
	$('#Demo-1-StartButton').hide();
	$('#Demo-1-StopButton').show();
	$('#Demo-1-dl-result').text('not tested');
	$('#Demo-1-ul-result').text('not tested');
	$('#Demo-1-re-result').text('not tested');
	$('#Demo-1-dl-duration').text('0');
	$('#Demo-1-ul-duration').text('0');
	$('#Demo-1-re-duration').text('0');
	Demo1 = new JQSpeedTest({
		testStateCallback: Demo1callBackFunctionState,
		testFinishCallback: Demo1callbackFunctionFinish,
		testDlCallback: Demo1callbackFunctionDl,
		testUlCallback: Demo1callbackFunctionUl,
		testReCallback: Demo1callbackFunctionRe,
	});
});

$('#Demo-1-StopButton').click(function(e){
	Demo1.state('forcestop');
});

function Demo1callBackFunctionState(value){
	$('#Demo-1-State').text(value);
}

function Demo1callbackFunctionFinish(value){
	$('#Demo-1-StartButton').show();
	$('#Demo-1-StopButton').hide();
}

function Demo1callbackFunctionDl(value, duration){
	$('#Demo-1-dl-result').text(value);
	$('#Demo-1-dl-duration').text(duration);
}

function Demo1callbackFunctionUl(value, duration){
	$('#Demo-1-ul-result').text(value);
	$('#Demo-1-ul-duration').text(duration);
}

function Demo1callbackFunctionRe(value, duration){
	$('#Demo-1-re-result').text(value);
	$('#Demo-1-re-duration').text(duration);
}