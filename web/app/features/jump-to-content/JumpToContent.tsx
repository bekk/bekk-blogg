export const JumpToContent = () => {
  return (
    <a
      href="#content"
      onClick={(e) => {
        e.preventDefault()
        const content = document.getElementById('content')
        if (content) {
          content.focus()
          content.scrollIntoView({ behavior: 'smooth' })
        }
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:right-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black striped-frame outline-none text-center underline"
    >
      Hopp til hovedinnhold
    </a>
  )
}
