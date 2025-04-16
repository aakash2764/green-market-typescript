
import { Variants } from "framer-motion";

// Page transition variants
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.15
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 }
  }
};

// Card and product animations
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: { 
    y: -10, 
    scale: 1.03, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  tap: { scale: 0.98 }
};

// Staggered item variants for lists
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Modal and overlay animations
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    backdropFilter: "blur(0px)"
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    backdropFilter: "blur(8px)",
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.3 }
  }
};

// Button animations
export const buttonVariants: Variants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// Input focus animation
export const inputVariants: Variants = {
  focus: { 
    boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.6)",
    borderColor: "rgba(66, 153, 225, 0.8)"
  }
};

// Toast animation
export const toastVariants: Variants = {
  hidden: { opacity: 0, x: 50, y: 0 },
  visible: { 
    opacity: 1, 
    x: 0,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { 
    opacity: 0, 
    x: 50,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// Shimmer loading effect
export const shimmerVariants: Variants = {
  hidden: { backgroundPosition: "-200% 0" },
  visible: { 
    backgroundPosition: "200% 0",
    transition: { 
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};

// Loader animation
export const loaderVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }
  }
};

// Navbar animation
export const navbarVariants: Variants = {
  hidden: { y: "-100%" },
  visible: { 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

// Profile picture hover animation
export const profilePicVariants: Variants = {
  hover: { 
    scale: 1.1,
    rotate: 5,
    boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.3 }
  }
};

// Animation utility for rounding numbers for display
export const roundToNextInteger = (value: number): number => {
  return Math.ceil(value);
};
