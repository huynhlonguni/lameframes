import { Switch } from "@/components/ui/switch"

const ArgumentField = ({label, type, value, setValue}) => {
	if (type == 'checkbox')
		return(
			<>
				<div className="font-bold">{label}</div>
				{/* <Switch /> */}
				<input type={type} className="min-w-0 p-2 rounded-lg outline-none" value={value} onChange={(e) => setValue(e.target.checked)} />
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