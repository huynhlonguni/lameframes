import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";


const Tab = ({activeClassname, defaultClassname, className, children, id, active, onClick}) => {
	const tabRef = useRef(null);

	activeClassname = activeClassname ?? "bg-white text-black";
	defaultClassname = defaultClassname ?? "text-black hover:bg-slate-100 hover:cursor-pointer";
	id = id ?? -1;
	active = active ?? null;
	
	useEffect(() => {
		if (active == id)
			tabRef.current.scrollIntoView();
	}, [active, id]);

	return(
		<div ref={tabRef} className={cn("p-4 min-w-max border-l border-r border-slate-300 select-none rounded-t-xl max-w-max", className, active == id ? activeClassname : defaultClassname)} onClick={onClick}>
			<div className="flex justify-center place-items-center h-full">
				{children}
			</div>
		</div>
	)
}

export default Tab;