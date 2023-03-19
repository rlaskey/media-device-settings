/* eslint-env browser */
let tracks = [];

const clear = element => {
	element.innerHTML = '';
};

const description = object => Object.keys(object)
	.map(key => `${key}: ${object[key]}`).join('; ');

const change = event => {
	const target = event.target;
	const track = currentTrack();
	track.applyConstraints({
		[target.name]: target.value,
		advanced: [{[target.name]: target.value}]
	})
		.then(loadControls)
		.catch(displayError);
};

const currentTrack = () => {
	const selectedVideo = document.querySelector('#selectedVideo');
	return tracks[Number(selectedVideo.value)];
};

const gotStream = stream => {
	document.querySelector('#video').srcObject = stream;

	const selectedVideo = document.querySelector('#selectedVideo');
	clear(selectedVideo);

	tracks = stream.getVideoTracks();
	for (const [index, track] of tracks.entries()) {
		const option = document.createElement('option');
		option.value = index;
		option.append(document.createTextNode(track.label));
		selectedVideo.append(option);
	}

	loadControls();
};

const loadControls = () => {
	const controls = document.querySelector('#controls');
	clear(controls);

	const track = currentTrack();
	const capabilities = track.getCapabilities();
	const settings = track.getSettings();

	for (const capabilityName in capabilities) {
		const capability = capabilities[capabilityName];

		if (typeof capability === 'string') {
			const element = document.createElement('p');
			element.append(document.createTextNode(capabilityName));
			const descriptionDiv = document.createElement('div');
			descriptionDiv.append(document.createTextNode(capability));
			descriptionDiv.classList.add('hint');
			element.append(descriptionDiv);
			controls.append(element);
			continue;
		}

		const wrapper = document.createElement('p');
		const label = document.createElement('label');
		label.append(document.createTextNode(`${capabilityName}: `));

		if (Array.isArray(capability)) {
			if (capability.length < 1) continue;
			const select = document.createElement('select');
			for (const option of capability) {
				const optionElement = document.createElement('option');
				optionElement.value = option;
				optionElement.append(document.createTextNode(option));
				select.append(optionElement);
			}
			select.name = capabilityName;
			select.value = settings[capabilityName];
			select.addEventListener('change', change);
			label.append(select);
			wrapper.append(label);
		} else {
			const input = document.createElement('input');
			input.type = 'number';
			if (capability.min !== undefined) input.min = capability.min;
			if (capability.max) input.max = capability.max;
			if (capability.step) input.step = capability.step;
			input.name = capabilityName;
			input.value = settings[capabilityName];
			input.addEventListener('change', change);
			label.append(input);
			wrapper.append(label);

			const descriptionDiv = document.createElement('div');
			descriptionDiv.classList.add('hint');
			descriptionDiv.append(document.createTextNode(description(capability)));
			wrapper.append(descriptionDiv);
		}

		controls.append(wrapper);
	}
};

const clearErrors = () => {
	clear(document.querySelector('#errors'));
};

const displayError = error => {
	const errors = document.querySelector('#errors');
	const li = document.createElement('li');
	li.append(document.createTextNode(error));
	errors.append(li);
};

const getDevices = () => {
	navigator.mediaDevices.getUserMedia({video: true})
		.then(stream => gotStream(stream))
		.catch(displayError);
};

getDevices();
document.querySelector('#refreshDeviceList').addEventListener('click', getDevices);
document.querySelector('#clearErrors').addEventListener('click', clearErrors);
