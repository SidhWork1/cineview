const Footer = () => {
    return (
      <footer className="border-t border-white/10 mt-16 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">
              Cine<span className="text-purple-500">View</span>
            </p>
            <p className="text-white/30 text-xs mt-1">
              Data provided by TMDB.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">About</a>
            <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">Contact</a>
          </div>
          <p className="text-white/20 text-xs">© 2024 CineView. All rights reserved.</p>
        </div>
      </footer>
    )
  }
  
  export default Footer