# Tooltip

```tsx
return (
  <TooltipPrimitive.Root {...rootProps}>
    <TooltipPrimitive.Trigger asChild>
      <span className="tooltip-trigger">hover me</span>
    </TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        offset={offset}
        placement={placement}
        showSafeArea={showSafeArea}
        className="tooltip-content"
      >
        <span>tooltip</span>
        <TooltipPrimitive.Arrow asChild>
          <ArrowDownFillIcon />
        </TooltipPrimitive.Arrow>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);
```

```css
.tooltip-content {
  transition:
    opacity 150ms ease-in-out,
    transform 150ms ease-in-out;

  opacity: 1;
  transform: scale(1);

  &[data-entering],
  &[data-exiting] {
    opacity: 0;
    transform: scale(0.7);
  }
  /* this for animation
  &[data-open] {
    animation: scaleIn 150ms ease-out;
  }

  &[data-close] {
    animation: scaleOut 150ms ease-in;
  } */
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}
```
