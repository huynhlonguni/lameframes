import { Switch } from "@/components/ui/switch"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

  
const ArgumentField = ({arg, value, setValue}) => {
	const type = arg.type;
	const label = arg.name;

	if (type == 'checkbox')
		return(
			<div className="flex gap-2 place-items-center">
				<div className="font-bold text-sm">{label}</div>
				<div className="flex h-full place-items-center">
					<Switch className="data-[state=checked]:bg-slate-500 data-[state=unchecked]:bg-slate-300" checked={value} onCheckedChange={(checked) => setValue(checked)} />
				</div>
			</div>
		)

	if (type == 'select')
		return(
			<div className="flex gap-2 place-items-center">
				<div className="font-bold text-sm">{label}</div>
				<Select value={value}
						onValueChange={(value) => {
							setValue(value);
						}} required={arg.required}>
					<SelectTrigger className="outline-none min-w-0">
						<SelectValue/>
					</SelectTrigger>
					<SelectContent className="max-w-max min-w-0">
						{
							arg.value.map((v, i) => 
								<SelectItem key={i} value={v.value}>
									{v.name}
								</SelectItem>
							)
						}
					</SelectContent>
				</Select>
			</div>

		)

	return(
		<div className="flex gap-2 place-items-center"> 
			<div className="font-bold text-sm">{label}</div>
			<Input type={type} className={cn("min-w-0 p-2 rounded-lg outline-none", type == 'number' && 'max-w-[70px]', type == 'text' && 'max-w-20')} value={value} onChange={(e) => setValue(e.target.value)} />
		</div>
	)
};

export default ArgumentField;