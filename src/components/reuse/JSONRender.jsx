import { useState, useEffect } from 'react';

const H = {
  useOpenKeys({data}) {
    const [openKeys, setOpenKeys] = useState({});

    useEffect(() => {
      if (typeof data === 'object' && data !== null) {
        const initialOpenKeys = Object.keys(data).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setOpenKeys(initialOpenKeys);
      }
    }, [data]);

    return [openKeys, setOpenKeys];
  }
}

const F = {
  toggleKey(key, setOpenKeys) {
    setOpenKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  },
  renderArray(arrData, arrIndex, openKeys, setOpenKeys){
    return(
      <div className='overflow-x-auto h-full p-[1px_5px] rounded-[5px]' style={{
        outline: '1px solid var(--cms-bg_hover)',
        backgroundColor: '#00000004',
      }}>
        <button onClick={() => F.toggleKey(arrIndex, setOpenKeys)} className='w-full hover:bg-[#00000010] text-left flex gap-[5px] items-center overflow-hidden'>
          <strong className='go text-[20px] flex items-center h-[10px]'>
            {openKeys[arrIndex] ? 'arrow_drop_down' : 'arrow_right'}
          </strong>
          <strong>{arrIndex}:</strong>
          <span>({arrData.length}) [{openKeys[arrIndex] ? '…' : '…'}]</span>
        </button>
        {openKeys[arrIndex] && arrData.map((item, i) => (
          <div key={i} className='p-[1px_5px]'>
            {F.renderItem(item, `${arrIndex}.${i}`, i, openKeys, setOpenKeys)}
          </div>
        ))}
      </div>
    )
  },
  renderObject(objData, openKeys, setOpenKeys){
    return(
      <div className='overflow-x-auto h-full p-[1px_5px] rounded-[5px]' style={{
        outline: '1px solid var(--cms-bg_hover)',
        backgroundColor: '#00000004',
      }}>
        {Object.keys(objData).map((key) => {
          const isPrimitive = typeof objData[key] === 'string' || typeof objData[key] === 'number';
          return (
            <div key={key} className='p-[1px_5px]'>
              {isPrimitive ? (
                <div className='w-full text-left'>
                  <strong>{F.formatKey(key)}</strong>{`: ${objData[key]}`}
                </div>
              ) : (
                  <button onClick={() => F.toggleKey(key, setOpenKeys)} className='w-full hover:bg-[#00000010] text-left flex gap-[5px] items-center overflow-hidden'>
                  <strong className='go text-[20px] flex items-center h-[10px]'>
                    {openKeys[key] ? 'arrow_drop_down' : 'arrow_right'}
                  </strong>
                    <strong>{F.formatKey(key)}</strong>
                </button>
              )}
              {!isPrimitive && openKeys[key] && <JSONRender data={objData[key]} />}
            </div>
          );
        })}
      </div>
    )
  },
  renderItem(item, key, i, openKeys, setOpenKeys){
    return(
      <div>
        <button onClick={() => F.toggleKey(key, setOpenKeys)} className='w-full hover:bg-[#00000010] text-left flex gap-[5px] items-center overflow-hidden'>
          <strong className='go text-[20px] flex items-center h-[10px]'>
            {openKeys[key] ? 'arrow_drop_down' : 'arrow_right'}
          </strong>
          <strong>{i}:</strong>
        </button>
        {openKeys[key] && <JSONRender data={item} index={key} />}
      </div>
    )
  },
  formatKey(key){
    return(
      key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    )
  }

}

function JSONRender({ data, index }) {
  const [openKeys, setOpenKeys] = H.useOpenKeys({ data });

  if (Array.isArray(data)) {
    return F.renderArray(data, index, openKeys, setOpenKeys);
  } else if (typeof data === 'object' && data !== null) {
    return F.renderObject(data, openKeys, setOpenKeys);
  } else {
    return <div className='overflow-x-auto p-[1px_5px]'>{String(data)}</div>;
  }
}

export default JSONRender;