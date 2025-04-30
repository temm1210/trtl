import Presence, { PresenceProps } from "./";
import "./example.css";

const Example = (props: PresenceProps) => {
  return (
    <Presence {...props}>
      <div className={`${props.present ? "fade-in" : "fade-out"} content`}>
        presence
      </div>
    </Presence>
  );
};

export default Example;
