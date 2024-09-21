interface InputProps {
    text: string;
    width: number;
    height: number;
    onClick?: () => void;
}

const Button = (props: InputProps) => {
  return (
    <>
        <button onClick={props.onClick} className={`p-${props.height} px-${props.width} font-bold text-lg text-primaria rounded-lg bg-white hover:bg-slate-200 transition color duration-300`}>{props.text}</button>
    </>
  )
}

export default Button