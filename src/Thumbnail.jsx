
import { useAppContext } from "./Context";

const Thumbnail = ({video, keyframe, onClick}) => {
	const {imagesServer} = useAppContext();

	const url = `${imagesServer}/${video}/${keyframe}.jpg`

	return(
		<div className="w-full p-2 rounded-lg bg-slate-200 cursor-pointer" onClick={onClick}>
			<img src={url} className="w-full rounded-md"/>
			<div className="flex justify-between">
				<div>{video}</div>
				<div>{keyframe}</div>
			</div>
		</div>	
	)
}

export default Thumbnail;