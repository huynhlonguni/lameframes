import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const BlacklistStub = ({video, onClick, className, onClose}) => {
	const color = 'bg-slate-200';

	return(
		<div className={cn("p-1 rounded-lg cursor-pointer text-xs lg:text-sm xl:text-base", color, className)} onClick={onClick}>
			<div className="flex justify-between gap-1">
				<div className="empty:hidden">{video}</div>
				<div onClick={(e) => {e.stopPropagation(); onClose();}} className="flex place-items-center cursor-pointer hover:bg-slate-400 rounded-lg">
					<X className="size-4 m-1"/>
				</div>
			</div>
		</div>	
	)
}

export default BlacklistStub;