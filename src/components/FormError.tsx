interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  return (
    <div
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 
                bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-md 
                shadow-md transition-all duration-500 animate-fade-in"
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default FormError;
