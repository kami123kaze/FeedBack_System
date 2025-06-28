import Select from "react-select";

export default function TagMultiSelect({ value, onChange, options }) {
  const formatted = options.map(t => ({ value: t.id, label: t.name }));
  return (
    <Select
      isMulti
      options={formatted}
      value={formatted.filter(o => value.includes(o.value))}
      onChange={sel => onChange(sel.map(o => o.value))}
      className="text-black"          
    />
  );
}
