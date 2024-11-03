function Pagination({ take, page, total, onPageChange, onTakeChange }) {
  return (
    <div className="p-[5px] flex gap-[10px] justify-center items-center">

      <div className="back_to_front">
        <button className="bg-[--cms-bg] hover:bg-[--cms-bg_hover] text-[--cms-text] p-[10px] rounded-[30px] flex gap-[5px] items-center justify-center"
          onClick={() => {
            if (page === 0) return;
            // pageMeta[1]({ ...pageMeta[0], page: 0 })
            onPageChange(0)
          }
          }>
          <span className="go">keyboard_double_arrow_left</span>
        </button>
      </div>

      <div className="back">
        <button className="bg-[--cms-bg] hover:bg-[--cms-bg_hover] text-[--cms-text] p-[10px] rounded-[30px] flex gap-[5px] items-center justify-center"
          onClick={() => {
            if (page === 0) return;
            // pageMeta[1]({ ...pageMeta[0], page: page - 1 })
            onPageChange(page - 1)
          }}>
          <span className="go">chevron_left</span>
        </button>
      </div>

      <div className="pageing flex gap-[10px]">
        {Array.from({ length: Math.ceil(total / take) }).map((_, index) => {
          return (<button key={index} className={`h-[40px] w-[40px] text-[12px] rounded-full ${page !== index ? "bg-[--cms-bg]" : "bg-[--cms-bg_hover]"} text-[--cms-text] hover:bg-[--cms-bg_hover]`}
            onClick={() => {
              if (page === index) return;
              // pageMeta[1]({
              //   ...pageMeta[0],
              //   page: index
              // });
              onPageChange(index)
            }}>{index + 1}</button>)
        })}

      </div>

      <div className="next">
        <button className="bg-[--cms-bg] hover:bg-[--cms-bg_hover] text-[--cms-text] p-[10px] rounded-[30px] flex gap-[5px] items-center justify-center"
          onClick={() => {
            if (Math.ceil(total / take) - 1 === page) return;
            // pageMeta[1]({ ...pageMeta[0], page: page + 1 })
            onPageChange(page + 1)
          }
          }>
          <span className="go">chevron_right</span>
        </button>
      </div>

      <div className="front_to_back">
        <button className="bg-[--cms-bg] hover:bg-[--cms-bg_hover] text-[--cms-text] p-[10px] rounded-[30px] flex gap-[5px] items-center justify-center"
          onClick={() => {
            if (Math.ceil(total / take) - 1 === page) return;
            // pageMeta[1]({ ...pageMeta[0], page: Math.ceil(total / take) - 1 })
            onPageChange(Math.ceil(total / take) - 1)
          }}>
          <span className="go">keyboard_double_arrow_right</span>
        </button>
      </div>

      <div className="dividers">
        <span className="text-[12px] text-[--cms-text]">|</span>
      </div>

      <div className="row_per_page flex gap-[2px] items-center">
        <div className="text-[16px] max-w-[20px] text-[--cms-text] go">table_rows_narrow </div>
        <select className="w-[45px] bg-[--cms-bg] text-[--cms-text] py-[5px] rounded-[5px] text-[12px]" value={take} onChange={(e) => {
          // pageMeta[1]({ ...pageMeta[0], page: 0, take: parseInt(e.target.value) })
          onTakeChange(parseInt(e.target.value))
        }}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <div className="text-[12px] text-[--cms-text]">{
          page * take + 1} - {page * take + take > total ? total : page * take + take} of {total}
        </div>

      </div>

    </div>
  )
}

export default Pagination;