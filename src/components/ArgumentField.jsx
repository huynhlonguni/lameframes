import { Switch } from "@/components/ui/switch"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

  
const ArgumentField = ({arg, value, setValue}) => {
	const type = arg.type;
	const label = arg.name;

	if (type == 'checkbox')
		return(
			<>
				<div className="font-bold">{label}</div>
				<div className="flex h-full place-items-center">
					<Switch className="data-[state=checked]:bg-slate-500 data-[state=unchecked]:bg-slate-300" checked={value} onCheckedChange={(checked) => setValue(checked)} />
				</div>
			</>
		)

	if (type == 'select')
		return(
			<>
				<div className="font-bold">{label}</div>
				<Select value={value}
						onValueChange={(value) => {
							setValue(value);
						}} required={arg.required}>
					<SelectTrigger className="outline-none">
						<SelectValue/>
					</SelectTrigger>
					<SelectContent className="max-w-max">
						{
							arg.value.map((v, i) => 
								<SelectItem key={i} value={v.value}>
									{v.name}
								</SelectItem>
							)
						}
					</SelectContent>
				</Select>
			</>

		)

	return(
		<>
			<div className="font-bold">{label}</div>
			<input type={type} className="min-w-0 p-2 rounded-lg outline-none" value={value} onChange={(e) => setValue(e.target.value)} />
		</>
	)
};

export default ArgumentField;