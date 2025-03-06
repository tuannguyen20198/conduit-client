import clsx from 'clsx'

interface IActionLoadingProps {
  className?: string
}
const ActionLoading = (props: IActionLoadingProps) => {
  return (
    <div
      className={clsx(
        'flex justify-center items-center  h-[calc(100vh-120px)]  bg-transparent flex-col gap-8',
        props.className
      )}
    >
      {/* <img
        src="../images/Logo-Binh-Dien.webp"
        alt="Welcome"
        className="hidden w-[100px] object-cover opacity-95 sm:block"
      /> */}

      <div
        className="animate-spin inline-block size-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>

      {/* <div>Đang tải ...</div> */}
    </div>
  )
}

export default ActionLoading
