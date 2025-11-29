import React, { useState, useEffect } from "react"; // --- FIX: Added useEffect ---
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiDashboardLine,
  RiHeartPulseLine,
  RiEmotionLine,
  RiMessage2Line,
  RiMapPinLine,
  RiLogoutBoxLine,
  RiBookReadLine,
  RiInformationLine,
  RiMenuFold3Line,
  RiMenuUnfold3Line,
  RiCloseFill,
} from "react-icons/ri";
import { useInfoDialog } from "../../hooks/useInfoDialog";

const MobileBackdrop = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
  />
);

const Header = ({ title, infoContent }) => {
  const { showInfo } = useInfoDialog();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-center justify-between"
    >
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {infoContent && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => showInfo(title, infoContent)}
          className="rounded-lg bg-[var(--color-surface-light)]/60 p-3 text-[var(--color-text-muted)] transition-all hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-light)]"
        >
          <RiInformationLine size={24} />
        </motion.button>
      )}
    </motion.div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }) => (
  <motion.li
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative my-1 flex cursor-pointer items-center rounded-xl p-3 transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-[rgb(var(--color-primary-rgb))] to-[rgb(var(--color-primary-rgb)/0.7)] text-white font-bold shadow-lg shadow-[rgb(var(--color-primary-rgb)/0.2)]"
        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-light)]/50 hover:text-white"
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute -left-3 h-2 w-2 rounded-full bg-[var(--color-primary)]"
      />
    )}
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </motion.li>
);

const Layout = ({ pageTitle, infoContent, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  }, [location.pathname]);

  const isAppPage =
    location.pathname.startsWith("/chatbot") ||
    location.pathname.startsWith("/therapists");

  const navItems = [
    {
      label: "Dashboard",
      icon: <RiDashboardLine size={24} />,
      path: "/dashboard",
    },
    { label: "Stress", icon: <RiHeartPulseLine size={24} />, path: "/stress" },
    { label: "Emotion", icon: <RiEmotionLine size={24} />, path: "/emotion" },
    { label: "Chatbot", icon: <RiMessage2Line size={24} />, path: "/chatbot" },
    {
      label: "Therapists",
      icon: <RiMapPinLine size={24} />,
      path: "/therapists",
    },
    {
      label: "Meditations",
      icon: <RiBookReadLine size={24} />,
      path: "/meditations",
    },
    {
      label: "Resources",
      icon: <RiBookReadLine size={24} />,
      path: "/resources",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    if (isDesktop) {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    } else {
      setMobileSidebarOpen(!mobileSidebarOpen);
    }
  };

  // Sidebar visibility controlled by open flag on both screen types
  const isSidebarVisible =
    isClient && (mobileSidebarOpen || (isDesktop && desktopSidebarOpen));

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <MobileBackdrop onClick={() => setMobileSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarVisible && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`w-64 flex-shrink-0 border-r border-white/10 bg-[var(--color-surface)]/80 backdrop-blur-sm p-6 pr-8 fixed inset-y-0 left-0 z-50`}
          >
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-white md:hidden"
            >
              <RiCloseFill size={24} />
            </button>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <motion.h1
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent"
              >
                EmoCare+
              </motion.h1>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Your wellness companion
              </p>
            </motion.div>
            <nav>
              <ul>
                {navItems.map((item) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isActive={location.pathname.startsWith(item.path)}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </ul>
            </nav>
            <motion.div className="mt-auto pt-4 border-t border-white/10">
              <NavItem
                icon={<RiLogoutBoxLine size={24} />}
                label="Logout"
                onClick={handleLogout}
              />
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main
        className="flex-1 overflow-hidden flex flex-col transition-all duration-300"
        style={{
          paddingLeft: isDesktop && desktopSidebarOpen ? 256 : 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 bg-[var(--color-surface)]/50 backdrop-blur-md p-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-[var(--color-surface-light)] text-[var(--color-primary)]"
          >
            {(isDesktop ? desktopSidebarOpen : mobileSidebarOpen) ? (
              <RiMenuFold3Line size={24} />
            ) : (
              <RiMenuUnfold3Line size={24} />
            )}
          </motion.button>
        </motion.div>

        <div
          className={`flex-1 ${
            isAppPage ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <div
            className={`w-full max-w-7xl mx-auto ${
              isAppPage ? "h-full" : "py-6 md:py-10"
            } px-4 sm:px-6 lg:px-8`}
          >
            {!isAppPage && (
              <Header title={pageTitle} infoContent={infoContent} />
            )}

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={isAppPage ? "h-full" : "min-h-[calc(100vh-200px)]"}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
