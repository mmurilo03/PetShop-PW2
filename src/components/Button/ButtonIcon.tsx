import { ReactNode } from "react";

interface InputProps {
    icon: ReactNode;
    onClick?: () => void;
}

const ButtonIcon = (props: InputProps) => {
  return (
    <>
        <button onClick={props.onClick} className='text-[200%]'>{props.icon}</button>
    </>
  )
}

export default ButtonIcon