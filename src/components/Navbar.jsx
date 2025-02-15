import { useState, useEffect, useRef, useCallback } from 'react';

const menuItems = [
  { href: "/", label: "Inicio", disabled: false },
  { href: "/blog", label: "Blog", disabled: false },
  { href: "#", label: "Proyectos", disabled: true, tooltip: "Próximamente" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const isOpenRef = useRef(isMobileMenuOpen);

  // Actualiza el ref del estado cuando cambia
  useEffect(() => {
    isOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback((e) => {
    e.stopPropagation();
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        isOpenRef.current &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const renderDesktopMenu = () => (
    <div className="hidden md:flex">
      <div className="flex items-center gap-8">
        {menuItems.map((item) => (
          item.disabled ? (
            <div key={item.label} className="relative group">
              <a
                href={item.href}
                className="text-sm font-medium text-neutral-300 cursor-not-allowed flex items-center gap-1"
              >
                {item.label}
                {item.tooltip && (
                  <svg
                    className="h-4 w-4 text-neutral-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </a>
              {item.tooltip && (
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.tooltip}
                </span>
              )}
            </div>
          ) : (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-[#FFB800] hover:text-neutral-200"
            >
              {item.label}
            </a>
          )
        ))}
      </div>
    </div>
  );

  const renderMobileMenu = () => (
    <div
      ref={mobileMenuRef}
      className={`md:hidden text-center fixed top-16 left-0 right-0 bg-black bg-opacity-90 p-4 transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {menuItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`block py-2 ${
            item.disabled 
              ? 'text-neutral-500 cursor-not-allowed'
              : 'text-[#FFB800] hover:text-neutral-200'
          }`}
        >
          {item.label}{item.disabled && ' (Próximamente)'}
        </a>
      ))}
    </div>
  );

  return (
    <nav className="h-16 relative z-[999] top-0 left-0 right-0 flex justify-center items-center backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-center items-center h-full">
          {renderDesktopMenu()}
          
          <div className="md:hidden">
            <button
              ref={menuButtonRef}
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center text-gray-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-90' : ''
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {renderMobileMenu()}
    </nav>
  );
}