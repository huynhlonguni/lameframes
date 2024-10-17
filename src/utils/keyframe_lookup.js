import map_keyframes from './map-keyframes.json'

const skip_details = true;

const GetKeyframeInfo = (video_name, index) => {
	const error = [null, null, null];
	if (!index)
		return error;

	if (!(video_name in map_keyframes))
		return error;

	const fps = parseFloat(map_keyframes[video_name]['fps']);

	const zeroBasedIndex = index - 1;

	if (zeroBasedIndex < 0 || zeroBasedIndex >= parseInt(map_keyframes[video_name]['frames'].length))
		return error;

	if (skip_details) {
		return [zeroBasedIndex * 1, zeroBasedIndex * fps, fps];
	}

	return [parseFloat(mapping[0]), parseInt(mapping[1]), fps]; //[pts_time, frame_idx, fps]
};

const getTime = (mapping, index) => {
	if (index < 0 || index >= parseInt(mapping.length)) return -1;

	if (skip_details)
		return index * 1;

	return parseFloat(mapping[index][0]);
}

const getFrame = (mapping, index, fps) => {
	if (index < 0 || index >= parseInt(mapping.length)) return -1;

	if (skip_details)
		return index * fps;

	return parseInt(mapping[index][1]);
}

const GetNearestKeyframes = (video_name, currentFrame, count = 5) => {
	const error = [null, null, null, null, null, null];

	if (!(video_name in map_keyframes))
		return error;

	const mapping = map_keyframes[video_name]['frames'];
	if (!mapping)
		return error;

	const mappingLength = parseInt(mapping.length);
	const fps = parseFloat(map_keyframes[video_name]['fps']);

	let low = 0;
	let high = mappingLength;

	while (low < high) {
		let mid = Math.floor(low + (high - low) / 2);
		
		if (currentFrame <= getFrame(mapping, mid, fps))
			high = mid;
		else
			low = mid + 1;
	}

	if (0 < low < mappingLength - 1 && getFrame(mapping, low, fps) != currentFrame) {
		let l = getFrame(mapping, low - 1, fps);
		let r = getFrame(mapping, low + 1, fps);

		if (r - currentFrame > currentFrame - l)
			low = low - 1;
		else
			low = low + 1;
	}

	if (low < 0) low = 0;
	if (low >= mappingLength) low = mappingLength - 1;

	let surroundingKeyframes = [];
	let left = low - Math.floor(count / 2);
	let right = low + Math.ceil(count / 2);

	if (left < 0) {
		right += Math.abs(left);
		left = 0;
	}
	if (right > mappingLength) {
		left -= right - mappingLength
		right = mappingLength;
	}
	if (left < 0) left = 0;

	for (let i = left; i < right; i++) {
		surroundingKeyframes.push([i + 1, getFrame(mapping, i, fps), getTime(mapping, i)]);
	}

	return surroundingKeyframes;
};

export {
	GetKeyframeInfo,
	GetNearestKeyframes
};