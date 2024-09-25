interface InputProps {
    label?: string;
    size?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    style?: string;
    styleLabel?: string;
    onChange: (value: string) => void;
}

const Input = (props: InputProps) => {
    return (
        <>
            <div className={`flex flex-col lg:w-[40%] md:w-[50%] xsm:w-[80%] gap-2`}>
                <label className={"text-white text-lg"}>{props.label}</label>
                <input
                    className={`${props.style ?? "bg-white py-4 rounded-md w-full pl-2"}`}
                    type={props.type}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={(event) => props.onChange(event.target.value)}
                ></input>
            </div>
        </>
    );
};

export default Input;
