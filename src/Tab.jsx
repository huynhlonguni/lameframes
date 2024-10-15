import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";


const Tab = ({activeClassname, defaultClassname, className, children, id, active, onClick}) => {
	const tabRef = useRef(null);

	activeClassname = activeClassname ?? "bg-slate-200 text-black";
	defaultClassname = defaultClassname ?? "text-black hover:bg-slate-100 cursor-pointer";
	id = id ?? -1;
	active = active ?? null;
	
	useEffect(() => {
		if (active == id)
			tabRef.current.scrollIntoView();
	}, [active, id]);

	return(
		<div ref={tabRef} className={cn("py-2 pl-4 pr-2 min-w-64 border-l border-r border-slate-300 select-none rounded-t-xl max-w-max", className, active == id ? activeClassname : defaultClassname)} onClick={onClick}>
			<div className="flex justify-between place-items-center h-full gap-2">
				{children}
			</div>
		</div>
	)
}

export default Tab;