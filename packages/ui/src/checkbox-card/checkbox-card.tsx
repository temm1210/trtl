import { css } from "@emotion/react";
import { CheckboxPrimitive } from "@rtl/react-primitives";

export interface CheckboxCardProps {
  icon: React.ReactNode;
}

const CheckboxCard = ({ icon }: CheckboxCardProps) => {
  return (
    <label css={labelCss}>
      <span>{icon}</span>
      <CheckboxPrimitive.Root>
        <CheckboxPrimitive.Indicator>
          <span>indicator</span>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </label>
  );
};

const labelCss = css`
  display: flex;
  align-items: center;
  position: relative;
  padding: 1rem;

  cursor: pointer;

  border: 1px solid #e4e4e7;
  border-radius: 0.25rem;
`;

export default CheckboxCard;
