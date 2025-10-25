import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
}

/**
 * PageTransition Component
 * 
 * Simple wrapper for page content without fade animations for better performance.
 * The brush swipe overlay handles the visual transition.
 * 
 * @param children - The page content to be rendered
 * @param pageKey - Unique identifier for the current page (triggers re-render on change)
 */
const PageTransition = ({ children, pageKey }: PageTransitionProps) => {
  return (
    <div key={pageKey} className="relative">
      {children}
    </div>
  );
};

export default PageTransition;

