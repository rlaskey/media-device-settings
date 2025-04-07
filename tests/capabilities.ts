export const validCapabilities = {
	"elgatoFacecam": {
		"aspectRatio": {
			"max": 1920,
			"min": 0.000925925925925926,
		},
		"brightness": {
			"max": 255,
			"min": 0,
			"step": 1,
		},
		"colorTemperature": {
			"max": 12500,
			"min": 2800,
			"step": 100,
		},
		"contrast": {
			"max": 10,
			"min": 0,
			"step": 1,
		},
		"deviceId":
			"abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01",
		"exposureMode": [
			"continuous",
			"manual",
		],
		"exposureTime": {
			"max": 2500,
			"min": 1.220703125,
			"step": 1.220703125,
		},
		"facingMode": [],
		"frameRate": {
			"max": 60,
			"min": 0,
		},
		"groupId":
			"abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01",
		"height": {
			"max": 1080,
			"min": 1,
		},
		"resizeMode": [
			"none",
			"crop-and-scale",
		],
		"saturation": {
			"max": 63,
			"min": 0,
			"step": 1,
		},
		"sharpness": {
			"max": 4,
			"min": 0,
			"step": 1,
		},
		"whiteBalanceMode": [
			"continuous",
			"manual",
		],
		"width": {
			"max": 1920,
			"min": 1,
		},
	},
	"elgatoVirtualCamera": {
		"deviceId": "QmFzZTY0LVNvbWV0aGluZw==",
		"frameRate": {
			"max": 60,
			"min": 0,
		},
		"groupId": "QmFzZTY0LVNvbWV0aGluZw==",
		"height": {
			"max": 1080,
			"min": 540,
		},
		"width": {
			"max": 1920,
			"min": 960,
		},
	},
};

export const invalidCapabilities = {
	"objectWithStrings": {
		"height": {
			"max": "1080",
			"min": "1080",
		},
	},
};
