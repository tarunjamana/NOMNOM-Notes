const Header = () => {
    return ( 
        <header className="flex justify-between fixed w-screen items-center px-6 py-4 bg-gray-100 text-black shadow-md">
            <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="NOMNOM Notes logo" className="h-12 w-12" />
                <span className="ext-xl font-bold text-gray-800">NOMNOM Notes</span>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-lg shadow-md">
              T
            </div>
        </header>
     );
}
 
export default Header;