import media_info from './media-info.json'

const GetVideoID = (video_name) => {
	if (!(video_name in media_info)) return null;
	return media_info[video_name]['id'];
};

export default GetVideoID;