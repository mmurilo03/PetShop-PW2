interface InputProps {
    text: string;
    className: string
    onClick?: () => void;
}

const Button = (props: InputProps) => {
  return (
    <>
        <button onClick={props.onClick} className={`font-bold text-lg ${props.className} rounded-lg hover:bg-slate-200 transition color duration-300`}>{props.text}</button>
    </>
  )
}

export default Button