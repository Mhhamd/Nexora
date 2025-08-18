import Link from 'next/link';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

function Navbar() {
  return (
    <header className="sticky top-0 border-b w-full py-5 bg-background/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60 z-50">
      <div className=" mx-auto max-w-7xl flex items-center justify-between px-4">
        {/* LEFT SECTION */}
        <div className="flex items-center w-full">
          <Link
            href={'/'}
            className=" text-lg sm:text-xl font-bold text-primary font-mono tracking-wider cursor-pointer hover:opacity-70 duration-300">
            <h1>Nexora</h1>
          </Link>
        </div>

        {/* RIGHT SECTION */}
        <DesktopNavbar />
        <MobileNavbar />
      </div>
    </header>
  );
}

export default Navbar;
