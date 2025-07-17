
const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, formik, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />}
      <input
        type={type}
        name={name}
        value={formik.values[name] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          formik.touched[name] && formik.errors[name] 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        placeholder={placeholder}
        {...props}
      />
    </div>
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

export default InputField