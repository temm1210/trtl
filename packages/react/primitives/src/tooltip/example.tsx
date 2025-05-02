import { TooltipPrimitive, TooltipRootProps } from "./";
import "./example.css";

const Example = (props: TooltipRootProps) => {
  return (
    <TooltipPrimitive.Root {...props}>
      <TooltipPrimitive.Trigger>
        <span className="tooltip-trigger">Trigger</span>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content className="tooltip-content">
          {/* <TooltipPrimitive.Arrow>arrow</TooltipPrimitive.Arrow> */}
          <div className="tooltip-text">Tooltip Content</div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

export default Example;

// const ARROW_WIDTH = 30;
// const ARROW_HEIGHT = 15;

// export default function TooltipHover() {
//   const [isOpen, setIsOpen] = useState(false);

//   const arrowRef = useRef(null);

//   const { refs, floatingStyles, context, middlewareData } = useFloating({
//     placement: "top",
//     open: isOpen,
//     onOpenChange: setIsOpen,
//     middleware: [
//       offset(ARROW_HEIGHT),
//       flip({ padding: 5 }),
//       shift({ padding: 5 }),
//       arrow({ element: arrowRef }),
//     ],
//     whileElementsMounted: autoUpdate,
//   });

//   const arrowX = middlewareData.arrow?.x ?? 0;
//   const arrowY = middlewareData.arrow?.y ?? 0;
//   const transformX = arrowX + ARROW_WIDTH / 2;
//   const transformY = arrowY + ARROW_HEIGHT;

//   const { isMounted, styles } = useTransitionStyles(context, {
//     initial: {
//       transform: "scale(0)",
//     },
//     common: ({ side }) => ({
//       transformOrigin: {
//         top: `${transformX}px calc(100% + ${ARROW_HEIGHT}px)`,
//         bottom: `${transformX}px ${-ARROW_HEIGHT}px`,
//         left: `calc(100% + ${ARROW_HEIGHT}px) ${transformY}px`,
//         right: `${-ARROW_HEIGHT}px ${transformY}px`,
//       }[side],
//     }),
//   });

//   return (
//     <div className="App">
//       <button
//         ref={refs.setReference}
//         className="reference"
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           marginTop: "5rem",
//         }}
//       >
//         Click to toggle
//       </button>
//       <FloatingPortal>
//         {isMounted && (
//           <div ref={refs.setFloating} style={floatingStyles}>
//             <div style={styles} className="floating">
//               Floating element with arrow
//               <FloatingArrow
//                 ref={arrowRef}
//                 context={context}
//                 width={ARROW_WIDTH}
//                 height={ARROW_HEIGHT}
//               />
//             </div>
//           </div>
//         )}
//       </FloatingPortal>
//       <p>
//         The scale transform origin is at the arrow tip for all placements, even
//         when shifted.
//       </p>
//       <h3>Placement:</h3>
//     </div>
//   );
// }
