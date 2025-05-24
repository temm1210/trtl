import "@testing-library/jest-dom/vitest";

document.elementFromPoint = (): null => null;
Element.prototype.getAnimations = () => [];
