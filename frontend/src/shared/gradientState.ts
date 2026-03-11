/** Shared mutable state for the current gradient hue.
 *  CursorRipple writes to this every frame.
 *  LightGradient reads from it every frame.
 */
export const gradientState = { hue: 150 };
