import { cn } from "@/lib/utils";
import { ScanSearch } from "lucide-react";
import { useAppContext } from "../Context";

const Thumbnail = ({video, keyframe, onClick, className}) => {
	const {imageServerUrl} = useAppContext();

	const video2 = video.replace("_", "/");

	const url = `${imageServerUrl}/${video2}/${keyframe}.jpg`

	return(
		<div className={cn("w-full p-2 rounded-lg bg-slate-200 cursor-pointer text-xs lg:text-sm xl:text-base", className)} onClick={onClick}>
			<img src={url} className="w-full rounded-md"/>
			<div className="flex justify-between">
				<div>{video}</div>
				<div>{keyframe}</div>
			</div>
		</div>	
	)
}

export default Thumbnail;