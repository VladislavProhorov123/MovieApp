import { ChangeEvent, FocusEvent } from "react"

type Props = {
  searchTerm: string
  setSearchTerm: (value: string) => void
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
}

export default function Search({ searchTerm, setSearchTerm, onFocus, onBlur }: Props) {
  return (
    <div className="search">
      <img
        src="search.svg"
        alt="search"
        className="absolute top-[20px] left-[16px]"
      />

      <input
        type="text"
        placeholder="Search througth thousands of movies"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
