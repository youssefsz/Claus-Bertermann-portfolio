import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function InteractiveHoverButton({
  children,
  className = "",
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <motion.button
      className={`group bg-white text-black relative w-auto cursor-pointer overflow-hidden rounded-full border border-white/20 p-2 px-6 text-center font-semibold hover:bg-white/90 transition-colors duration-300 ${className}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="bg-black h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="text-white absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </motion.button>
  );
}
