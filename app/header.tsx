"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Thay đổi header style khi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect để kiểm tra nếu cần scroll sau khi chuyển hướng
  useEffect(() => {
    // Kiểm tra nếu có storage flag đã được set
    const shouldScrollToAbout = localStorage.getItem('scrollToAboutSection');
    if (shouldScrollToAbout === 'true' && pathname === '/') {
      localStorage.removeItem('scrollToAboutSection');
      
      setTimeout(() => {
        scrollToSection('about-section');
      }, 500);
    }
  }, [pathname]);

  // Thêm hàm scroll đến section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Lấy vị trí của section
      const sectionTop = section.getBoundingClientRect().top;
      // Vị trí hiện tại + vị trí của section - offset (để tránh bị che bởi header)
      const offsetPosition = window.pageYOffset + sectionTop - 80;
      
      // Scroll đến vị trí có tính toán offset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    // Đóng mobile menu nếu đang mở
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Hàm xử lý click vào nút "Về chúng tôi"
  const handleAboutClick = () => {
    const section = document.getElementById('about-section');
    
    if (section) {
      // Nếu section tồn tại trên trang hiện tại, scroll đến đó
      scrollToSection('about-section');
    } else {
      // Nếu không, set flag và chuyển hướng về trang chủ
      localStorage.setItem('scrollToAboutSection', 'true');
      router.push('/');
    }
    
    // Đóng mobile menu nếu đang mở
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-blue-900/95 py-2 shadow-lg" : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/dta.png" 
              alt="Logo" 
              width={40} 
              height={40}
              className="mr-2"
            />
            <span className="text-white font-bold text-lg">DTA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-blue-200 transition-colors">
              Trang chủ
            </Link>
            {/* Thay đổi để sử dụng hàm handleAboutClick */}
            <button
              onClick={handleAboutClick}
              className="text-white hover:text-blue-200 transition-colors bg-transparent"
            >
              Về chúng tôi
            </button>
            <Link href="/san-pham" className="text-white hover:text-blue-200 transition-colors">
              Sản phẩm
            </Link>
            <Link href="/tuyen-dung" className="text-white hover:text-blue-200 transition-colors">
              Tuyển dụng
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              {/* Thay đổi để sử dụng hàm handleAboutClick */}
              <button
                onClick={handleAboutClick}
                className="text-white hover:text-blue-200 transition-colors text-left bg-transparent"
              >
                Về chúng tôi
              </button>
              <Link 
                href="/san-pham" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link 
                href="/tuyen-dung" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tuyển dụng
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}