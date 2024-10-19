import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useAppContext } from "../Context";

const colors = [
	"bg-green-200",
	"bg-cyan-200",
	"bg-orange-200",
	"bg-yellow-200",
	"bg-violet-200",
	"bg-rose-200",
]

const Thumbnail = ({video, keyframe, onClick, className, colorId = -1, hideText = false, children}) => {
	const {imageServerUrl} = useAppContext();

	const video2 = video.replace("_", "/");

	const url = `${imageServerUrl}/${video2}/${keyframe}.jpg`
 
	const validUrl = imageServerUrl && video2 && keyframe;

	const color = colors[colorId % 6] ?? 'bg-slate-200'

	return(
		<div className={cn("p-2 rounded-lg cursor-pointer text-xs lg:text-sm xl:text-base", color, className)} onClick={onClick}>
			{validUrl && 
				<img src={url} className={cn("w-full rounded-md", false && "h-full max-h-32 max-w-56")}/>
			}
			{
				!hideText &&
				<div className="flex justify-center">
					{
						children ? children : <div>{keyframe}</div>
					}
				</div>
			}
		</div>	
	)
}

export default Thumbnail;