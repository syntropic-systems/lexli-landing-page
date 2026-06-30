"use client";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import React from "react";
import { motion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown } from "lucide-react";

type MenuContextValue = {
  setActiveItem: (item: string | null) => void;
  cancelClose: () => void;
  scheduleClose: () => void;
  closeNow: () => void;
};

const MenuContext = React.createContext<MenuContextValue | null>(null);

const useMenuContext = () => React.useContext(MenuContext);

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

type MenuItemProps = {
  setActive?: (item: string | null) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  href?: string;
  isRouteActive?: boolean;
  onNavigate?: () => void;
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  href,
  isRouteActive,
  onNavigate,
}: MenuItemProps) => {
  const menuCtx = useMenuContext();
  const hasDropdown = Boolean(children);

  const activate = React.useCallback(() => {
    if (!hasDropdown) {
      return;
    }
    if (menuCtx) {
      menuCtx.setActiveItem(item);
    } else {
      setActive?.(item);
    }
  }, [hasDropdown, item, menuCtx, setActive]);

  const scheduleClose = React.useCallback(() => {
    if (!hasDropdown) {
      return;
    }
    if (menuCtx) {
      menuCtx.scheduleClose();
    } else {
      setActive?.(null);
    }
  }, [hasDropdown, menuCtx, setActive]);

  const cancelClose = React.useCallback(() => {
    menuCtx?.cancelClose();
  }, [menuCtx]);

  const deactivate = React.useCallback(() => {
    if (menuCtx) {
      menuCtx.setActiveItem(null);
    } else {
      setActive?.(null);
    }
  }, [menuCtx, setActive]);

  const clearMenu = React.useCallback(() => {
    if (menuCtx) {
      menuCtx.closeNow();
    } else {
      setActive?.(null);
    }
  }, [menuCtx, setActive]);

  const handleMouseEnter = hasDropdown ? activate : clearMenu;
  const handleFocus = hasDropdown ? activate : clearMenu;
  const handleMouseLeave = hasDropdown ? scheduleClose : undefined;
  const handleClick = React.useCallback(() => {
    onNavigate?.();
    clearMenu();
  }, [clearMenu, onNavigate]);

  const isHovering = hasDropdown && active === item;

  const label = (
    <motion.span
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground hover:bg-primary/20",
        isRouteActive && "bg-accent text-accent-foreground",
        !isRouteActive && isHovering && "bg-primary/20 text-foreground"
      )}
    >
      {item}
      {hasDropdown && (
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isHovering && "rotate-180"
          )}
        />
      )}
    </motion.span>
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onMouseLeave={handleMouseLeave}
    >
      {hasDropdown ? (
        <button
          type="button"
          className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={isHovering ? clearMenu : activate}
        >
          {label}
        </button>
      ) : href ? (
        <Link
          href={href}
          className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onFocus={handleFocus}
          onClick={handleClick}
        >
          {label}
        </Link>
      ) : (
        label
      )}
      {hasDropdown && active === item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="absolute left-1/2 top-[calc(100%_+_1rem)] -translate-x-1/2 pt-2">
            <motion.div
              transition={transition}
              layoutId="active"
              className="overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-2xl"
            >
              <motion.div layout className="h-full w-max p-3">
                {children}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

type MenuProps = ComponentPropsWithoutRef<"nav"> & {
  setActive: (item: string | null) => void;
  closeDelay?: number;
};

export const Menu = ({
  setActive,
  children,
  className,
  closeDelay = 150,
  ...rest
}: MenuProps) => {
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const suppressedRef = React.useRef(false);

  const cancelClose = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActive(null);
      closeTimerRef.current = null;
    }, closeDelay);
  }, [cancelClose, closeDelay, setActive]);

  const setActiveItem = React.useCallback(
    (item: string | null) => {
      if (item !== null && suppressedRef.current) {
        return;
      }
      cancelClose();
      setActive(item);
    },
    [cancelClose, setActive]
  );

  const closeNow = React.useCallback(() => {
    cancelClose();
    setActive(null);
  }, [cancelClose, setActive]);

  // When tab/window loses focus, close dropdown and suppress until real mousemove
  React.useEffect(() => {
    const suppress = () => {
      closeNow();
      suppressedRef.current = true;
    };

    const handleVisibility = () => {
      if (document.hidden) suppress();
    };

    const handleMouseMove = () => {
      if (suppressedRef.current) {
        suppressedRef.current = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", suppress);
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", suppress);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [closeNow]);

  // Close dropdown on click outside the nav
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeNow();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeNow]);

  const contextValue = React.useMemo(
    () => ({
      setActiveItem,
      cancelClose,
      scheduleClose,
      closeNow,
    }),
    [setActiveItem, cancelClose, scheduleClose, closeNow]
  );

  return (
    <MenuContext.Provider value={contextValue}>
      <nav
        ref={navRef}
        {...rest}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={className}
      >
        {children}
      </nav>
    </MenuContext.Provider>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
  icon,
  onClick,
  showArrow,
}: {
  title: string;
  description?: string;
  href: string;
  src?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  showArrow?: boolean;
}) => {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-muted p-2 transition-all duration-300 hover:bg-accent hover:shadow"
      onClick={onClick}
    >
      {icon ? (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
      ) : src ? (
        <img
          src={src}
          width={140}
          height={70}
          alt={title}
          className="h-[80px] w-[120px] shrink-0 rounded-md object-cover shadow"
        />
      ) : null}
      <div className="flex flex-1 flex-col justify-between space-y-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-base font-semibold text-foreground">{title}</h4>
          {showArrow ? (
            <ArrowRight className="h-4 w-4 text-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          ) : null}
        </div>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </a>
  );
};

type HoveredLinkProps = ComponentPropsWithoutRef<typeof Link>;

export const HoveredLink = ({ children, className, ...rest }: HoveredLinkProps) => {
  return (
    <Link
      {...rest}
      className={className}
    >
      {children}
    </Link>
  );
};
