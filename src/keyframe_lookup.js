import map_keyframes from './map-keyframes.json'

const GetKeyframeInfo = (video_name, index) => {
	const error = [null, null, null];
	if (!index)
		return error;

	if (!(video_name in map_keyframes))
		return error;

	const fps = map_keyframes[video_name]['fps'];

	const mapping = map_keyframes[video_name]['frames'][index - 1];
	if (!mapping)
		return error;

	return [parseFloat(mapping[0]), parseInt(mapping[1]), fps]; //[pts_time, frame_idx, fps]
};

const getTime = (mapping, index) => {
	if (index < 0 || index >= mapping.length) return -1;

	return parseFloat(mapping[index][0]);
}

const getFrame = (mapping, index) => {
	if (index < 0 || index >= mapping.length) return -1;

	return parseInt(mapping[index][1]);
}

const GetNearestKeyframes = (video_name, currentFrame, count = 5) => {
	const error = [null, null, null, null, null, null];

	if (!(video_name in map_keyframes))
		return error;

	const mapping = map_keyframes[video_name]['frames'];
	if (!mapping)
		return error;

	let low = 0;
	let high = mapping.length;

	while (low < high) {
		let mid = Math.floor(low + (high - low) / 2);
		
		if (currentFrame <= getFrame(mapping, mid))
			high = mid;
		else
			low = mid + 1;
	}

	if (0 < low < mapping.length - 1 && getFrame(mapping, low) != currentFrame) {
		let l = getFrame(mapping, low - 1);
		let r = getFrame(mapping, low + 1);

		if (r - currentFrame > currentFrame - l)
			low = low - 1;
		else
			low = low + 1;
	}

	if (low < 0) low = 0;
	if (low >= mapping.length) low = mapping.length - 1;

	let surroundingKeyframes = [];
	let left = low - Math.floor(count / 2);
	let right = low + Math.ceil(count / 2);

	if (left < 0) {
		right += Math.abs(left);
		left = 0;
	}
	if (right > mapping.length) {
		left -= right - mapping.length
		right = mapping.length;
	}
	if (left < 0) left = 0;

	for (let i = left; i < right; i++) {
		surroundingKeyframes.push([i + 1, getFrame(mapping, i), getTime(mapping, i)]);
	}

	return surroundingKeyframes;
};

export {
	GetKeyframeInfo,
	GetNearestKeyframes
};