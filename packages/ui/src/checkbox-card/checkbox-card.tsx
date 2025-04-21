import { css } from "@emotion/react";
import {
  CheckboxPrimitive,
  CheckboxRootProps,
  useCheckboxPrimitiveContext,
} from "@rtl/react-primitives";

export interface CheckboxCardProps extends CheckboxRootProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CheckboxCard = ({ icon, title, description, ...restProps }: CheckboxCardProps) => {
  const { checked, disabled } = useCheckboxPrimitiveContext();

  return (
    <label css={[labelCss, checked && activeLabelCss]} style={{ opacity: disabled ? 0.5 : 1 }}>
      <CheckboxPrimitive.Root {...restProps} />
      <span css={iconCss}>{icon}</span>
      <span css={titleCss}>{title}</span>
      <p css={descriptionCss}>{description}</p>
    </label>
  );
};

const labelCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 1.5rem 1rem;

  cursor: pointer;

  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
`;

const activeLabelCss = css`
  border-color: #18181b;
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

export default CheckboxCard;
