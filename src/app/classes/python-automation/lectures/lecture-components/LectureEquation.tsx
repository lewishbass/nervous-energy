import React from 'react';

interface LectureEquationProps {
  /** Mix of MathJax elements and plain text spans as children */
  children: React.ReactNode;
  className?: string;
}

/**
 * A styled equation block that accepts a mix of inline MathJax equations
 * and plain-text spans as children. Content wraps naturally instead of
 * scrolling, and plain text renders in the lecture's body font.
 *
 * Usage:
 * ```tsx
 * <LectureEquation>
 *   <MathJax inline>{'\\( f(n) = O(g(n)) \\)'}</MathJax>
 *   <span> if there exists a constant </span>
 *   <MathJax inline>{'\\( c \\)'}</MathJax>
 * </LectureEquation>
 * ```
 */
function LectureEquation({ children, className = '' }: LectureEquationProps) {
  return (
    <div className={`lecture-equation ${className}`.trim()}>
      {children}
    </div>
  );
}

export { LectureEquation };
