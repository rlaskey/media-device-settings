interface NumericObject {
	[key: string]: number | undefined;
}

const isNumericObject = (o: unknown): o is NumericObject => {
	if (typeof o !== "object" || o === null) return false;
	return true;
};

type Capability =
	| string
	| string[]
	| boolean
	| boolean[]
	| NumericObject
	| DoubleRange
	| ULongRange;

export interface Capabilities extends MediaTrackCapabilities {
	[key: string]: Capability | undefined;
}

let tracks: MediaStreamTrack[] = [];

const clear = (element: HTMLElement | null): void => {
	if (!element) return;
	element.innerHTML = "";
};

export const description = (o: Capability): string => {
	if (typeof o !== "object" || o == null) return String(o);
	return Object.keys(o)
		.map((key) => `${key}: ${o[key as keyof typeof o]}`)
		.join("; ");
};

const change = (event: Event): void => {
	const target = event.target as HTMLInputElement | HTMLSelectElement;
	const track: MediaStreamTrack | null = currentTrack();
	if (!track) return;

	track.applyConstraints({
		[target.name]: target.value,
		advanced: [{ [target.name]: target.value }],
	})
		.then(loadControls)
		.catch(displayError);
};

const currentTrack = (): MediaStreamTrack | null => {
	const selectedVideo: HTMLSelectElement | null = document.querySelector(
		"#selectedVideo",
	);
	if (!selectedVideo) return null;
	return tracks[Number(selectedVideo.value)];
};

const gotStream = (stream: MediaStream): void => {
	const video: HTMLVideoElement | null = document.querySelector("#video");
	if (video) video.srcObject = stream;

	const selectedVideo: HTMLSelectElement | null = document.querySelector(
		"#selectedVideo",
	);
	if (!selectedVideo) return;
	clear(selectedVideo);

	tracks = stream.getVideoTracks();
	for (const [index, track] of tracks.entries()) {
		const option: HTMLOptionElement = document.createElement("option");
		option.value = String(index);
		option.append(document.createTextNode(track.label));
		selectedVideo.append(option);
	}

	loadControls();
};

const loadControls = (): void => {
	const controls: HTMLElement | null = document.querySelector("#controls");
	if (!controls) return;
	clear(controls);

	const track = currentTrack();
	if (!track) return;

	const capabilities: Capabilities = track.getCapabilities() as Capabilities;
	const settings: NumericObject = track.getSettings() as NumericObject;

	for (const capabilityName in capabilities) {
		const capability: Capability = capabilities[capabilityName] as Capability;

		if (typeof capability === "string") {
			const element = document.createElement("p");
			element.append(document.createTextNode(capabilityName));
			const descriptionDiv = document.createElement("div");
			descriptionDiv.append(document.createTextNode(capability));
			descriptionDiv.classList.add("hint");
			element.append(descriptionDiv);
			controls.append(element);
			continue;
		}

		const wrapper = document.createElement("p");
		const label = document.createElement("label");
		label.append(document.createTextNode(`${capabilityName}: `));

		if (Array.isArray(capability)) {
			if (capability.length < 1) continue;
			const select = document.createElement("select");
			for (const option of capability) {
				const optionElement: HTMLOptionElement = document.createElement(
					"option",
				);
				optionElement.value = String(option);
				optionElement.append(document.createTextNode(String(option)));
				select.append(optionElement);
			}
			select.name = capabilityName;
			select.value = String(settings[capabilityName]);
			select.addEventListener("change", change);
			label.append(select);
			wrapper.append(label);
		} else if (isNumericObject(capability)) {
			const input = document.createElement("input");
			input.type = "number";
			if (capability.min) input.min = String(capability.min);
			if (capability.max) input.max = String(capability.max);
			if (capability.step) input.step = String(capability.step);
			input.name = capabilityName;
			input.value = String(settings[capabilityName]);
			input.addEventListener("change", change);
			label.append(input);
			wrapper.append(label);

			const descriptionDiv: HTMLDivElement = document.createElement("div");
			descriptionDiv.classList.add("hint");
			descriptionDiv.append(
				document.createTextNode(description(capability)),
			);
			wrapper.append(descriptionDiv);
		}

		controls.append(wrapper);
	}
};

const clearErrors = (): void => {
	clear(document.querySelector("#errors"));
};

const displayError = (error: Error): void => {
	const errors = document.querySelector("#errors");
	if (!errors) return;

	const li = document.createElement("li");
	li.append(document.createTextNode(error.message));
	errors.append(li);
};

const getDevices = (): void => {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then((stream) => gotStream(stream))
		.catch(displayError);
};

const setupButton = (selector: string, listener: EventListener) => {
	const button: HTMLButtonElement | null = document.querySelector(selector);
	if (button) button.addEventListener("click", listener);
};

if (typeof window !== "undefined") {
	window.addEventListener("load", getDevices);
	setupButton("#refreshDeviceList", getDevices);
	setupButton("#clearErrors", clearErrors);
}
