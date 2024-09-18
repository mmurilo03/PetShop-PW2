interface InputProps {
    text: string;
    onClick?: () => void;
}

const Button = (props: InputProps) => {
  return (
    <>
        <button onClick={props.onClick} className='p-6 px-44 font-bold text-lg text-primaria rounded-lg bg-white hover:bg-slate-200 transition color duration-300'>{props.text}</button>
    </>
  )
}

export default Button