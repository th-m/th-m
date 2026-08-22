import * as React from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export interface FloatingDockItem {
  /** Accessible name and hover/focus label for the dock button. */
  title: string;
  /** Icon rendered inside the button; sized relative to the button, so an SVG should fill its container. */
  icon: React.ReactNode;
  /** Destination; http(s) links open in a new tab, everything else (e.g. mailto:) stays in the current tab. */
  href: string;
}

export interface FloatingDockProps {
  items: FloatingDockItem[];
  className?: string;
}

/** Spring tune for the cursor magnification, matching the Aceternity source. */
const MAGNIFY_SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

/**
 * Aceternity-style floating dock (https://ui.aceternity.com/components/floating-dock),
 * restyled onto the THOM tokens: a rounded bar whose icon buttons magnify
 * toward the cursor and reveal a mono label above on hover or focus. All items
 * stay visible on every viewport, so each link is always one tap away.
 * Positioning is left to the consumer — the portfolio pins the dock to the
 * bottom of the viewport next to the fixed header. Magnification and label
 * motion respect the user's reduced-motion preference.
 */
export const FloatingDock = ({ items, className }: FloatingDockProps) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <MotionConfig reducedMotion="user">
      <motion.nav
        aria-label="Floating dock"
        className={["thom-floating-dock", className].filter(Boolean).join(" ")}
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {items.map((item) => (
          <DockButton key={item.title} item={item} mouseX={mouseX} />
        ))}
      </motion.nav>
    </MotionConfig>
  );
};
FloatingDock.displayName = "FloatingDock";

function DockButton({
  item,
  mouseX,
}: {
  item: FloatingDockItem;
  mouseX: MotionValue<number>;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);

  // Distance of the cursor from this button's center; used to grow the button
  // (and its icon) the closer the cursor gets.
  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { left: 0, width: 0 };
    return value - bounds.left - bounds.width / 2;
  });

  const width = useSpring(useTransform(distance, [-150, 0, 150], [44, 80, 44]), MAGNIFY_SPRING);
  const height = useSpring(useTransform(distance, [-150, 0, 150], [44, 80, 44]), MAGNIFY_SPRING);
  const iconWidth = useSpring(useTransform(distance, [-150, 0, 150], [20, 36, 20]), MAGNIFY_SPRING);
  const iconHeight = useSpring(useTransform(distance, [-150, 0, 150], [20, 36, 20]), MAGNIFY_SPRING);

  const isExternal = /^https?:/i.test(item.href);

  return (
    <a
      className="thom-floating-dock__link"
      href={item.href}
      aria-label={item.title}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <motion.div ref={ref} className="thom-floating-dock__button" style={{ width, height }}>
        <AnimatePresence>
          {hovered && (
            <motion.span
              aria-hidden="true"
              className="thom-floating-dock__label"
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
        <motion.span className="thom-floating-dock__icon" style={{ width: iconWidth, height: iconHeight }}>
          {item.icon}
        </motion.span>
      </motion.div>
    </a>
  );
}
