import { cn } from "@/lib/utils";
import { FileDigit, FileVideo2, FileQuestion } from "lucide-react";
import { CircleCheck, CircleHelp, CircleDot, CircleX, CircleDashed } from "lucide-react";
import { Check } from "lucide-react";

const QueryNameRenderer = ({query, className, colorText = true, verbose = false}) => {
	const name = query.name;
	const type = query.type;
	const owner = query.owner;
	const state = query.state;
	const checkers = query.checkers;

	let textColor = "text-black";
	switch (state) {
		case 'unsure': textColor = 'text-amber-600'; break;
		case 'done': textColor = 'text-cyan-600'; break;
		case 'checked': textColor = 'text-green-600'; break;
	}

	return(
		<div className={cn("flex place-items-center align-middle justify-center gap-4 bg-opacity-30", colorText && textColor, className)} >
			{/* {type == "kis" && <FileVideo2 />}
			{type == "qa" && <FileDigit />} */}
			{state == "none" && <CircleDashed className=""/>}
			{state == "unsure" && <CircleHelp className=""/>}
			{state == "done" && <CircleDot className=""/>}
			{state == "checked" && <CircleCheck className=""/>}
			<div className="flex flex-col">
				<div className="font-semibold">{name}</div>
				{verbose &&
					<div className="font-semibold text-xs flex gap-1 text-slate-500">
						<div className="mr-2">{owner}</div>
						{checkers?.length &&
							checkers.map((c, i) => 
								<div key={i} className="flex place-items-center">
									<Check className="size-3"/>
									<div>{c}</div>
								</div>
							)
						}
					</div>
				}
					
			</div>
		</div>
	)
}

export default QueryNameRenderer;

