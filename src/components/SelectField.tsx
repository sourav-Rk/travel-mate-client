
// Select Field Component
const SelectField = ({ label, name, options, formik, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      name={name}
      value={formik.values[name] || ''}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
        formik.touched[name] && formik.errors[name] 
          ? 'border-red-500 bg-red-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      {...props}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

export default SelectField