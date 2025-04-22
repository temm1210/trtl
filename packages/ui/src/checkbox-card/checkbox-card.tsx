import { css } from "@emotion/react";
import { CheckIcon } from "@rtl/icons";
import { CheckboxPrimitive, CheckboxRootProps } from "@rtl/react-primitives";

export interface CheckboxCardProps extends CheckboxRootProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CheckboxCard = ({ icon, title, description, ...restProps }: CheckboxCardProps) => {
  return (
    <CheckboxPrimitive.Root css={rootCss} {...restProps}>
      <div css={wrapperCss}>
        <CheckboxPrimitive.Indicator css={indicatorCss}>
          <CheckIcon css={indicatorCssIcon} />
        </CheckboxPrimitive.Indicator>
        <span css={iconCss}>{icon}</span>
        <span css={titleCss}>{title}</span>
        <p css={descriptionCss}>{description}</p>
      </div>
    </CheckboxPrimitive.Root>
  );
};

const rootCss = css`
  display: block;
  padding: 1.5rem 1rem;

  cursor: pointer;

  outline: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  box-sizing: border-box;
  transition: outline 0.1s ease-out;

  &[data-state="checked"] {
    outline-color: #18181b;
    outline-width: 2px;
  }
`;

const wrapperCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const iconCss = css`
  font-size: 2.5rem;
`;

const titleCss = css`
  font-size: 0.875rem;
  font-weight: bold;
  color: #09090b;
  margin-top: 0.5rem;
`;

const descriptionCss = css`
  font-size: 0.875rem;
  color: #626263;
  margin-top: 0.5rem;
`;
const indicatorCss = css`
  position: absolute;
  right: 0;
  top: 0;
  width: 1.25rem;
  height: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid #e4e4e7;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: #ffffff;

  &[data-state="checked"] {
    border-color: #18181b;
  }
`;

const indicatorCssIcon = css`
  color: #000000;
  display: block;
  width: 0.875rem;
  height: 0.875rem;
`;

export default CheckboxCard;
