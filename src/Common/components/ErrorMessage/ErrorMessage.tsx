interface ErrorMessageProps {
    message?: string
  }
  
  const ErrorMessage = ({ message = 'Something went wrong. Please try again.' }: ErrorMessageProps) => {
    return (
      <div className="flex items-center justify-center w-full py-12">
        <p className="text-red-400 text-sm">{message}</p>
      </div>
    )
  }
  
  export default ErrorMessage