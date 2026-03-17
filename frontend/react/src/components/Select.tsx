interface SelectProps {
  label?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  required?: boolean
  className?: string
}

const Select = ({ label, name, value, onChange, options, required = false, className = '' }: SelectProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="font-body text-sm font-medium text-text-primary mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="px-4 py-2 border border-border rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
