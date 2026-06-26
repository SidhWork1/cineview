const LoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center w-full py-12">
        <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }
  
  export default LoadingSpinner