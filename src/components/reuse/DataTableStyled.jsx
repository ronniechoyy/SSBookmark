import { useEffect, useState } from "react";
import DataTableBase from "../../components/cms/DataTableBase";
import Pagination from "./Pagination";
import Time_ago from "../../lib/time_ago";
import JSONBuilder from "./JSONBuilder";
import Popup from "./Popup";

const ReusableFunctions = {
  borderRadious({ i, data }) {
    if (i === 0) return '10px 0 0 10px'
    if (i === Object.keys(data[0]).length - 1) return '0 10px 10px 0'
    return ''
  }
}

const ReusableComponents = {
  Ellipsis({ text, width='100px', textSizes='8px' }) {
    return (
      <div className="flex gap-[2px] items-center group/ellipis">
        <span className={` text-ellipsis overflow-hidden whitespace-nowrap block`} style={{
          width: width,
          fontSize: textSizes
        }} title={text}>{text}</span>
        <span className="go h-[5px] group-hover/ellipis:grid place-content-center hidden" onClick={() => { TableF.copyToClipboard(text) }}>content_copy</span>
      </div>
    )
  },
  Popup:Popup,
  Array({i, row, _key, data}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="bg-[--cms-bg_hover] text-[--cms-text] text-[12px] max-h-[55px] hover:max-h-[500px] duration-[0.5s] h-full w-full py-[2px] flex items-center ">
        <div className="p-[5px] h-full bg-[--cms-bg] text-[--cms-text] w-full overflow-hidden duration-[0.5s]" style={{
          borderRadius: i === 0 ? '10px 0 0 10px' : i === Object.keys(data[0]).length - 1 ? '0 10px 10px 0' : ''
        }}>
          <div className=" bg-[--cms-bg_hover] rounded-[5px] p-[5px] text-center h-full flex items-center justify-center gap-[5px] cursor-pointer hover:bg-[--cms-text] hover:text-[--cms-bg] duration-[0.1s] " onClick={() => setIsOpen(true)}>
            
            <span>{Array.isArray(row[_key])? row[_key].length:''/*Object.keys(row[_key]).length*/}</span>
            <span>
              {_key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
            </span>
            <span className="text-[10px] bg-[#00000010] rounded-[2px] p-[2px_4px]">
              {Array.isArray(row[_key])? 'Array' : 'Object'}

            </span>
          </div>
          <ReusableComponents.Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <>
              <style jsx>{`.scrollbar::-webkit-scrollbar {width: 5px;height: 5px;border-radius:10px;}.scrollbar::-webkit-scrollbar-track {background: var(--cms-bg);}.scrollbar::-webkit-scrollbar-thumb {background: var(--cms-text);}.scrollbar::-webkit-scrollbar-thumb:hover {background: var(--cms-bg_hover);}.input_text::placeholder {color: var(--cms-text);}`}</style>

              <div className="w-[600px] max-w-[90%] max-h-[90%] bg-[--cms-bg] text-[--cms-text] rounded-[25px] shadow-sm overflow-hidden flex flex-col">

                <div className="scrollbar flex flex-col gap-[15px] p-[20px] text-[12px] overflow-auto ">
                  <h2 className="text-xl mb-4">{_key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}</h2>
                  {/* <JSONRender data={row[_key]} /> */}
                  <JSONBuilder value={row[_key]} readOnly />
                </div>
              </div>
            </>
          </ReusableComponents.Popup>
        </div>
      </div>
    )
  }
}

const SpecialFields = {
  status({row}){
    console.log('row', row)
    return (
      <div className=" p-[10px] bg-[--cms-bg] text-[--cms-text] text-[12px] max-h-[57px] hover:max-h-[500px] duration-[0.5s]  shadow-[inset_0_0_0px_0.2px_#c7c7c7]">
        <div className=" bg-[--cms-bg_hover] rounded-[5px] p-[5px] text-center ">
          <span>{row["status"].length}
          </span> <span>
            {"status".replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
          </span>
        </div>
        <div className="max-h-[150px] overflow-y-scroll overflow-x-hidden">
          {row["status"].map((v, i) => (
            <div key={i} className=" bg-[--cms-bg_hover] rounded-[5px] p-[5px] text-center text-wrap flex flex-col  " style={{ wordWrap: 'break-word' }}>
              <div className="flex gap-2">
                <div>Status</div>
                <div>{v.status}</div>
                
                
              </div>
              <div className="flex gap-2">
                <div>Submitted time</div>

                <div><Time_ago New_time={new Date()} Old_time={new Date(v.submittedTime)} /></div>
              </div>
            </div>
          ))}

        </div>
      </div>
    )
  },
  ID({ i, row, key, data }) {
    return(
      <div className="  bg-[--cms-bg_hover] text-[--cms-text] text-[12px] h-full py-[2px] flex gap-[5px] justify-center items-center duration-[0.5s]" style={{
        paddingLeft: i === 0 ? '5px' : '0',
      }}>
        <div className="p-[5px] h-full bg-[--cms-bg] text-[--cms-text] w-full flex justify-center items-center" style={{
          borderRadius: i === 0 ? '10px 0 0 10px' : i === Object.keys(data[0]).length - 1 ? '0 10px 10px 0' : '',
        }}>
          <span className=" text-ellipsis overflow-hidden whitespace-nowrap max-w-[45px]" title={row[key]}>{row[key]}...</span> <span className="go" onClick={() => {
            TableF.copyToClipboard(row[key])
          }}>content_copy</span>
        </div>


      </div>
    )
  },
  createdAt({ i, row, key, data }) {
    return(
      <div className="bg-[--cms-bg_hover] text-[--cms-text] text-[12px] h-full py-[2px] flex flex-col justify-center items-center duration-[0.5s]" style={{
        borderRadius: ReusableFunctions.borderRadious({ i, data })
      }}>

        <div className="p-[5px] h-full bg-[--cms-bg] text-[--cms-text] w-full flex flex-col justify-center items-center" style={{
          borderRadius: i === 0 ? '10px 0 0 10px' : i === Object.keys(data[0]).length - 1 ? '0 10px 10px 0' : ''
        }}>
          <div>{new Date(row[key]).toLocaleString()}</div>
          <div><Time_ago New_time={new Date()} Old_time={new Date(row[key])} /></div>
        </div>

      </div>
    )
  },
  user({ i, row, key, data }) {
    const {id, name, email, avatar} = row[key];
    const imgNotFound = 'https://via.placeholder.com/150/000000/FFFFFF/?text=No+Image'
    return(
      <div className="bg-[--cms-bg_hover] text-[--cms-text] text-[12px] h-full py-[2px] flex flex-col justify-center items-center duration-[0.5s]" style={{
        borderRadius: ReusableFunctions.borderRadious({ i, data })
      }}>

        <div className="p-[5px] h-full bg-[--cms-bg] text-[--cms-text] w-full flex justify-center items-center gap-[10px]" >
          <img className="aspect-square w-[35px] rounded-full object-cover" src={avatar} onError={(e)=>{
            e.target.src = `https://via.assets.so/img.jpg?w=50&h=50&tc=blue&bg=%23c1c1c1&t=${name[0].toUpperCase()}`
          }} />
          
          <div className="flex-col flex-grow">
            <div className="flex gap-[10px]">
              <ReusableComponents.Ellipsis text={id} width="60px" />
              <ReusableComponents.Ellipsis text={email} width="60px" textSizes="10px" />
            </div>
            <ReusableComponents.Ellipsis text={name} width="120px" textSizes="15px" />
            {/* <div>{name}</div> */}
          </div>
          
          
        </div>

      </div>
    )
  },
  event({ i, row, key, data }) {
    const {id, title, description, image} = row[key];
    return(
      <div className="bg-[--cms-bg_hover] text-[--cms-text] text-[12px] h-full py-[2px] flex flex-col justify-center items-center duration-[0.5s]" style={{
        borderRadius: ReusableFunctions.borderRadious({ i, data })
      }}>

        <div className="p-[5px] h-full bg-[--cms-bg] text-[--cms-text] w-full flex justify-left items-center gap-[10px]" >
          <div className="flex flex-col gap-[5px]">
            <ReusableComponents.Ellipsis text={id} width="150px" />
            <ReusableComponents.Ellipsis text={title} width="150px" textSizes="12.5px" />
          </div>
        </div>

      </div>
    )
  },
  parodies({ i, row, key, data }) {
    console.log('row', row)
    const {id, name} = row[key]||{
      id: '-----',
      name: '-----'
    };
    return(
      <div className="bg-[--cms-bg_hover] text-[--cms-text] text-[12px] h-full py-[2px] flex flex-col justify-center items-center duration-[0.5s]" style={{
        borderRadius: ReusableFunctions.borderRadious({ i, data })
      }}>

        <div className="p-[5px] h-full bg-[--cms-bg] text-[--cms-text] w-full flex justify-center items-center gap-[10px]" >
          <div className="flex flex-col gap-[5px]">
            <ReusableComponents.Ellipsis text={id} width="150px" />
            <ReusableComponents.Ellipsis text={name} width="150px" textSizes="12.5px" />
          </div>
        </div>

      </div>
    )
  }
}

const TableH = {
  useColumns({ data, customColumns, sort, customOrder }) {
    const columns = useState([])// tableF.generateColumnTitles(data[0], data, sort); 

    
    // console.log('RUNNING USE EFFECT', customColumns)
    useEffect(() => {
      if (data[0]) {
        columns[1](TableF.generateColumnTitles(data[0], data, sort))
        console.log('columns[1]', columns[0])
        if (customColumns) {
          columns[1](prev => [...prev, ...customColumns])
        }
        if (true) {
          const tempCustomOrder = ['id', 'name', 'title', 'email', 'intro', 'atName', 'isArtist', 'description', 'characterName', 'characterNickname', 'order', 'characterImage', 'printingMethod', 'printingQuantity', 'collectingMethod', 'parodies', 'submitProgress', 'user', 'event', 'card', 'eventBooth', 'payment', 'status', 'misc']
          columns[1](prevColumns => {
            const tempColumns = [...prevColumns]
            const orderedColumns = []
            tempCustomOrder.forEach((v, i) => {
              const index = tempColumns.findIndex(column => column.prop === v)
              if (index !== -1) {
                const temp = tempColumns.splice(index, 1)
                orderedColumns.push(temp[0])
              }
            })
            return [...orderedColumns, ...tempColumns]
          })
        }
      }
    }, [data[0], customColumns]);

    return columns;
  }
}

const TableF = {
  copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  },
  generateColumnTitles(data, dataArray, sort) {
    if (!data || data.length === 0) return []
    const columnTitles = Object.keys(data[0]).map((key,i) => {

      const width = (key) => {
        if (key.includes('id')||key.includes('Id')) return 80
        if (key === 'title') return 100
        if (key === 'action') return 100
        if (key === 'isArtist') return 80
        // if (key === 'eventJoinStatus') return 150
        // if (key === 'status') return 150
        return 200
      }

      return {
        name: key, prop: key, width: width(key),
        customTitle: (row) => {
          //shadow-[inset_0_0_0px_0.2px_#c7c7c7]
          return (
            <div className=" p-[10px] bg-[--cms-bg_hover] text-[--cms-text] text-[12px] h-full flex gap-[5px] justify-center items-center duration-[0.5s] ">
              <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}</span>
              <span className="go text-[15px]" onClick={() => {
                console.log('sort', sort)
                sort[1]({ column: key, method: sort[0].method === 'asc' ? 'desc' : 'asc' })
              }} style={{
                
              }}>{sort[0].column === key ? sort[0].method === 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' : 'unfold_more'}</span>
            </div>
          )
        },
        customCell: (row) => {
          //contain ''id'' in the key
          if (key.includes('id')||key.includes('Id')) {
            return (
              SpecialFields.ID({ i, row, key, data })
            )
          }
          if (key === 'createdAt' || key === 'updatedAt') {
            return (
              SpecialFields.createdAt({ i, row, key, data })
            )
          }
          if (key === 'user') {
            return (
              SpecialFields.user({i, row, key, data})
            )
          }
          if (key === 'event') {
            return (
              SpecialFields.event({i, row, key, data})
            )
          }
          if (key === 'parodies') {
            return (
              SpecialFields.parodies({i, row, key, data})
            )
          }
          //array
          if (Array.isArray(row[key])) {
            return(
              // ReusableComponents.Array({i, row, key, data})
              <ReusableComponents.Array i={i} row={row} key={key} _key={key} data={data} />
            )
          } else if (typeof row[key] === 'object' && row[key] !== null) {
            return (
              <ReusableComponents.Array i={i} row={row} key={key} _key={key} data={data} />
              // <div className=" bg-[--cms-bg_hover] text-[--cms-text] text-[12px]  h-full py-[2px] flex flex-col justify-center items-center max-h-[55px] hover:max-h-[500px] duration-[0.5s]">
              //   <div className="p-[5px] h-full bg-[--cms-bg] text-[--cms-text] w-full duration-[0.5s]" style={{
              //     borderRadius: ReusableFunctions.borderRadious({ i, data })
              //   }}>
              //     <JSONRender data={row[key]} />
              //   </div>
                
              // </div>

            )

          }

          // if (row[key] && typeof row[key] === 'object' && Object.keys(row[key]).length) {}
         
         
          if(typeof row[key] === 'boolean'){
            return (
              <div className=" bg-[--cms-bg_hover] text-[--cms-text] text-[12px] h-full py-[2px] flex flex-col justify-center items-center duration-[0.5s]">
                <div className="p-[5px] h-full bg-[--cms-bg] text-[--cms-text] w-full flex flex-col justify-center items-center" style={{
                  borderRadius: ReusableFunctions.borderRadious({ i, data })
                }}>
                  {row[key] ? 'true' : 'false'}
                </div>
              </div>
            )
          }

          return (
            <div className=" bg-[--cms-bg_hover] text-[--cms-text] text-[12px] h-full py-[2px] flex flex-col justify-center items-center duration-[0.5s] " >
              <style jsx>{`.scrollbar::-webkit-scrollbar {width: 5px;height: 1px;border-radius:10px;}.scrollbar::-webkit-scrollbar-track {background: var(--cms-bg);}.scrollbar::-webkit-scrollbar-thumb {background: var(--cms-text);}.scrollbar::-webkit-scrollbar-thumb:hover {background: var(--cms-bg_hover);}.input_text::placeholder {color: var(--cms-text);}`}</style>
              <div className="scrollbar p-[5px] h-full bg-[--cms-bg] text-[--cms-text] flex flex-col justify-center items-center  text-ellipsis overflow-hidden whitespace-nowrap w-full  " style={{
                borderRadius: ReusableFunctions.borderRadious({ i, data })
              }}>
              {row[key]}
              </div>
            </div>
          )
        }
      }
    });
    
    //sort
    //move created at and updated at to the last
    columnTitles.sort((a, b) => {
      if (a.prop === 'createdAt') return 1
      if (b.prop === 'createdAt') return -1
      if (a.prop === 'updatedAt') return 1
      if (b.prop === 'updatedAt') return -1
      return 0
    })



    return columnTitles
  }
}

const TableC = {}

function DataTableStyled({ pageMeta, sort, dataTotal, data, customColumns, stickyRowsLeft, stickyRowsRight, className }) {
  const columns = TableH.useColumns({ data, customColumns, sort });

  if (!data[0]) return <div className=" absolute top-0 left-0 w-full h-full flex justify-center items-center go animate-spin">
    <div className="text-[26px] go">progress_activity</div>
  </div>
  return (
    <div className={"flex flex-col flex-grow  " + className}>
      {/* <div>Tabke test</div> */}
      <DataTableBase
        className={'flex-grow rounded-[25px] overflow-hidden mr-[10px]'}
        data={data[0]}
        defaultBackgroundColor={"var(--cms-bg_hover)"}
        disableTitle={true}
        stickyRowsLeft={stickyRowsLeft??1}
        stickyRowsRight={stickyRowsRight??1}
        rowHeight={55}
        titleHeight={50}
        columnTitles={columns[0]}
        scrollBarColor="var(--cms-bg)"
        scrollBarThumbColor="var(--cms-text)"
        scrollBarThumbHoverColor="var(--cms-text)"
        scrollBarHeight={8}
        scrollBarWidth={8}
      />
      <div className="scrollbar overflow-x-scroll overflow-y-hidden grid place-items-center min-h-[78px]">
        <style jsx>{`.scrollbar::-webkit-scrollbar {width: 5px;height: 1px;border-radius:10px;}.scrollbar::-webkit-scrollbar-track {background: var(--cms-bg);}.scrollbar::-webkit-scrollbar-thumb {background: var(--cms-text);}.scrollbar::-webkit-scrollbar-thumb:hover {background: var(--cms-bg_hover);}.input_text::placeholder {color: var(--cms-text);}`}</style>
        <div className="pagination_container p-[12px_25px] text-[--cms-text] flex gap-[20px] min-w-max">
          <Pagination
            take={pageMeta[0].take} page={pageMeta[0].page} total={dataTotal[0]}
            onTakeChange={(v) => { pageMeta[1](prev => ({ ...prev, take: v })) }}
            onPageChange={(v) => { pageMeta[1](prev => ({ ...prev, page: v })) }}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTableStyled;