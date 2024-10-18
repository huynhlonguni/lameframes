import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useAppContext } from "../Context";

const Thumbnail = ({video, keyframe, onClick, className, onClose}) => {
	const {imageServerUrl} = useAppContext();

	const video2 = video.replace("_", "/");

	const url = `${imageServerUrl}/${video2}/${keyframe}.jpg`
 
	const validUrl = imageServerUrl && video2 && keyframe;

	return(
		<div className={cn("w-full p-2 rounded-lg bg-slate-200 cursor-pointer text-xs lg:text-sm xl:text-base", className)} onClick={onClick}>
			{validUrl && <img src={url} className="w-full rounded-md"/>}
			<div className="flex justify-between">
				<div>{video}</div>
				<div>{keyframe}</div>
				{onClose &&
					<div onClick={(e) => {e.stopPropagation(); onClose();}} className="flex place-items-center ml-1 cursor-pointer hover:bg-slate-400 rounded-lg">
						<X className="size-4 m-1"/>
					</div>
				}
			</div>
		</div>	
	)
}

export default Thumbnail;