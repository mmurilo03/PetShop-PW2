import { CiSearch } from "react-icons/ci"

interface SearchProps {
  onChange: (text: string) => void,
  width?: string,
}

const Search = (props: SearchProps) => {
  return (
    <div className="border-1 rounded-lg shadow-md flex items-center gap-2 pl-4 text-xl">
        <CiSearch />
        <input type="text" onChange={text => props.onChange(text.target.value)} className={`${props.width ?? "w-[30rem]"} px-4 py-4 focus:outline-none`} placeholder={`Pesquisar...`}/>
    </div>
  )
}

export default Search;