JQSpeedTest = function(options)
{
	var defaults = {
		testDlCallback: defaultCallbackFunction,
		testUlCallback: defaultCallbackFunction,
		testReCallback: defaultCallbackFunction,
		testStateCallback: defaultCallbackFunction,
		testFinishCallback: defaultCallbackFunction,
		countDlSamples: 1,
		countUlSamples: 1,
		countReSamples: 1,
		testImageUrl: 'images/logoTortoise.png',
		testImageSize: 5000000,
		testUploadSize: 5000000,
		testSleepTime: 500,
	};
	
    var settings = $.extend( {}, defaults, options );

	var currentState = 'stopped';

	var dlCounts = 0; var dlIntervalId = 0; var dlTestRunning = 'no';
	var ulCounts = 0; var ulIntervalId = 0; var ulTestRunning = 'no';
	var reCounts = 0; var reIntervalId = 0; var reTestRunning = 'no';

	this.state = function(state)
	{
		currentState = state;
		return true;
	};

	function setCurrentState(state)
	{
		currenState = state;
		typeof settings.testStateCallback === 'function' && settings.testStateCallback(state);
	}

	this.getCurrentState = function(state)
	{
		return currentState;
	};

	function init()
	{
		dlCounts = 0; 
		ulCounts = 0;
		reCounts = 0;

		testStart();
	}
	
	init();

	function testStart()
	{
		if(currentState == 'forcestop')
		{
			setCurrentState('stopped');

			typeof settings.testFinishCallback === 'function' && settings.testFinishCallback('finished');

			return;
		}

		setCurrentState('running');

		if(dlCounts < settings.countDlSamples)
		{
			if(dlTestRunning == 'no' && ulTestRunning == 'no' && reTestRunning == 'no')
			{
				dlCounts++;
				dlTestRunning = 'yes';

				setTimeout(function(){TestDownload()}, settings.testSleepTime);
			}

			clearTimeout(dlIntervalId);
			dlIntervalId = setTimeout(function(){ testStart(); }, 1000);

			return;
		}
		else if(ulCounts < settings.countUlSamples)
		{
			if(dlTestRunning == 'no' && ulTestRunning == 'no' && reTestRunning == 'no')
			{
				ulCounts++;
				ulTestRunning = 'yes';

				setTimeout(function(){TestUpload()}, settings.testSleepTime);
			}

			clearTimeout(ulIntervalId);
			ulIntervalId = setTimeout(function(){ testStart(); }, 1000);

			return;
		}
		else if(reCounts < settings.countReSamples || settings.countReSamples == 'loop')
		{
			if(dlTestRunning == 'no' && ulTestRunning == 'no' && reTestRunning == 'no')
			{
				reCounts++;
				reTestRunning = 'yes';

				setTimeout(function(){TestResponse()}, settings.testSleepTime);
			}

			clearTimeout(reIntervalId);
			reIntervalId = setTimeout(function(){ testStart(); }, 1000);

			return;
		}

		currentState = 'stopped';
		setCurrentState('stopped');

		typeof settings.testFinishCallback === 'function' && settings.testFinishCallback('finished');
	}

	function stopMetrics()
	{
		currentState = 'stopped';
		setCurrentState('stopped');

		typeof settings.testFinishCallback === 'function' && settings.testFinishCallback('finished');

		alert("No internet connection");
	}

	function TestDownload()
	{
		var sendDate = (new Date()).getTime();

		$.ajax({
			type: "GET",
			url: settings.testImageUrl,
			timeout: 60000,
			cache: false,
			success: function()
			{
				var receiveDate = (new Date()).getTime();
				var duration = (receiveDate - sendDate) / 1000;
				var bitsLoaded = settings.testImageSize * 8;
				var speedBps = (bitsLoaded / duration).toFixed(2);
				var speedKbps = (speedBps / 1024).toFixed(2);
				var speedMbps = (speedKbps / 1024).toFixed(2);
				
				var response = speedMbps;

				response =  response + ' Mbps';

				dlTestRunning = 'no';
				typeof settings.testDlCallback === 'function' && settings.testDlCallback(response, duration);
			},
			error: function()
			{
				stopMetrics();
			}
		});
	}

	function randomString(sizeInMb)
	{
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]\{}|;':,./<>?", //random data prevents gzip effect
			
		result = '';
			
		for(var i = 0; i < sizeInMb; i++)
			result += chars.charAt(Math.floor( Math.random() * chars.length));
		
		return result;
    }

	function TestUpload()
	{
		var randData = {randomDataString:randomString(settings.testUploadSize)};
		var uploadSize = settings.testUploadSize;
		var sendDate = (new Date()).getTime();

		$.ajax({
			type: "POST",
			url: "",
			data: randData,
			timeout: 60000,
			cache: false,
			success: function()
			{
				var receiveDate = (new Date()).getTime();
				var duration = (receiveDate - sendDate) / 1000;
				var bitsLoaded = uploadSize * 8;
				var speedBps = (bitsLoaded / duration).toFixed(2);
				var speedKbps = (speedBps / 1024).toFixed(2);
				var speedMbps = (speedKbps / 1024).toFixed(2);

				var response = speedMbps;

				response =  response + ' Mbps';
					
				ulTestRunning = 'no';
				typeof settings.testUlCallback === 'function' && settings.testUlCallback(response, duration);
			},
			error: function()
			{
				stopMetrics();
			}
		});
	}

	function TestResponse()
	{
		var sendDate = (new Date()).getTime();

		$.ajax({
			type: "HEAD",
			url: "",
			timeout: 60000,
			cache: false,
			success: function()
			{
				var receiveDate = (new Date()).getTime();

				var response = receiveDate - sendDate;
				var duration = response;
				reTestRunning = 'no';

				response = response + ' ms';

				typeof settings.testReCallback === 'function' && settings.testReCallback(response, duration);
			},
			error: function()
			{
				stopMetrics();
			}
		});
	}

	function defaultCallbackFunction(value)
	{
		window.console && console.log(value);
	}
}