import { useEffect, useState } from 'react';
import MomSaidTheVirtualListAtHome from './MomSaidTheVirtualListAtHome';

const localISOString = ({ date }) => {
  const _date = new Date(date);
  return new Date(_date.getTime() - (_date.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
}

const JSONBuilder = ({
  value = null,
  setValue = () => { },
  rootEditable = false,
  readOnly = false,
}) => {
  const [_value, _setValue] = useState(value);
  const [openStates, setOpenStates] = useState({});
  const [expandedStates, setExpandedStates] = useState({});


  useEffect(() => {
    if (_value !== value) {
      _setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (_value !== value) {
      setValue(_value);
    }
  }, [_value]);

  const addValue = (path = [], newValue = '') => {
    _setValue((prevValue) => {
      const result = JSON.parse(JSON.stringify(prevValue || {}));
      let current = result;
      for (let i = 0; i < path.length - 1; i++) {
        if (!(path[i] in current)) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      if (path.length > 0) {
        current[path[path.length - 1]] = newValue;
      } else {
        return newValue;
      }
      return result;
    });
  };

  const deleteValue = (path) => {
    _setValue((prevValue) => {
      const result = JSON.parse(JSON.stringify(prevValue));
      let current = result;
      for (let i = 0; i < path.length - 1; i++) {
        if (!(path[i] in current)) return prevValue;
        current = current[path[i]];
      }
      if (Array.isArray(current)) {
        current.splice(path[path.length - 1], 1);
      } else {
        delete current[path[path.length - 1]];
      }
      return result;
    });
  };

  const changeValue = (path, newValue, isKeyChange = false) => {
    _setValue((prevValue) => {
      const result = JSON.parse(JSON.stringify(prevValue));
      if (path.length === 0) {
        return newValue;
      }
      let current = result;
      for (let i = 0; i < path.length - 1; i++) {
        if (!(path[i] in current)) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      if (isKeyChange) {
        const oldKey = path[path.length - 1];
        const newKey = newValue;
        if (oldKey !== newKey) {
          current[newKey] = current[oldKey];
          delete current[oldKey];
        }
      } else {
        current[path[path.length - 1]] = newValue;
      }
      return result;
    });
  };

  const duplicateValue = (path) => {
    _setValue((prevValue) => {
      const result = JSON.parse(JSON.stringify(prevValue));
      let current = result;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      const key = path[path.length - 1];
      const valueToDuplicate = current[key];

      if (Array.isArray(current)) {
        current.splice(parseInt(key) + 1, 0, JSON.parse(JSON.stringify(valueToDuplicate)));
      } else {
        let newKey = `${key}_copy`;
        let counter = 1;
        while (newKey in current) {
          newKey = `${key}_copy_${counter}`;
          counter++;
        }
        current[newKey] = JSON.parse(JSON.stringify(valueToDuplicate));
      }
      return result;
    });
  };

  const toggleOpen = (path) => {
    setOpenStates(prevStates => ({
      ...prevStates,
      [path.join('.')]: !prevStates[path.join('.')]
    }));
  };

  const toggleExpand = (path) => {
    setExpandedStates(prevStates => ({
      ...prevStates,
      [path.join('.')]: !prevStates[path.join('.')]
    }));
  };

  const isOpen = (path) => {
    return openStates[path.join('.')] !== true;
  };

  const isExpanded = (path) => {
    return expandedStates[path.join('.')] === true;
  };

  const renderValue = (val, path = []) => {
    // if (val === null) {
    //   return <div>null</div>;
    // }
    //date and time
    if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {

      return (
        <div className='flex gap-2 [&>*]:border-[1px] [&>*]:border-[#00000010] [&>*]:rounded-[10px] [&>*]:p-[0px_4px] text-[12px]'>
          <input
            className='hover:bg-[#00000005] bg-[--cms-bg_hover]'
            type='datetime-local'
            value={localISOString({ date: val })}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              const utcISOString = newDate.toISOString();
              changeValue(path, utcISOString);
            }}
            style={{ width: '250px' }}
            readOnly={readOnly}
          />
          {!readOnly &&
            <div className='flex gap-2 [&>*]:border-[1px] [&>*]:border-gray-500 [&>*]:rounded-[25px] [&>*]:p-[0px_4px] text-[12px]'>
              <button className='go ' onClick={() => duplicateValue(path)}>content_copy</button>
              <button className='go ' onClick={() => deleteValue(path)}>delete</button>
            </div>}
        </div>
      );

    }
    if (typeof val === 'string' || typeof val === 'number' || val === null) {
      return (
        <div className='flex gap-2 [&>*]:border-[1px] [&>*]:border-[#00000010] [&>*]:rounded-[10px] [&>*]:p-[0px_4px] text-[12px]'>
          <input
            className='hover:bg-[#00000005] bg-[--cms-bg_hover]'
            value={val}
            onChange={(e) => changeValue(path, e.target.value)}
            style={{ width: /*readOnly ?*/ '250px' /*: '100px'*/ }}
            readOnly={readOnly}
          />
          {!readOnly &&
            <div className='flex gap-2 [&>*]:border-[1px] [&>*]:border-gray-500 [&>*]:rounded-[25px] [&>*]:p-[0px_4px] text-[12px]'>
              <button className='go ' onClick={() => duplicateValue(path)}>content_copy</button>
              <button className='go ' onClick={() => deleteValue(path)}>delete</button>
            </div>}
        </div>
      );
    }
    if (typeof val === 'boolean') {
      return (
        <div className='flex gap-2 [&>*]:border-[1px] [&>*]:border-[#00000010] [&>*]:rounded-[10px] [&>*]:p-[0px_4px] text-[12px]'>
          <select
            className='hover:bg-[#00000005] bg-[--cms-bg_hover]'
            value={val.toString()}
            onChange={(e) => changeValue(path, e.target.value === 'true')}
            style={{ width: /*readOnly ?*/ '250px' /*: '100px'*/ }}
            readOnly={readOnly}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          {!readOnly &&
            <div className='flex gap-2 [&>*]:border-[1px] [&>*]:border-gray-500 [&>*]:rounded-[25px] [&>*]:p-[0px_4px] text-[12px]'>
              <button className='go ' onClick={() => duplicateValue(path)}>content_copy</button>
              <button className='go ' onClick={() => deleteValue(path)}>delete</button>
            </div>}
        </div>
      );
    }
    if (Array.isArray(val)) {
      return (
        <div
          className='shadow-[inset_0_0_0px_0.2px_#4b4b4b] bg-[#00000005]'
          style={{
            // outline: '1px solid #00000010',
            padding: '5px',
            borderRadius: '10px',
          }}>
          {!readOnly &&
            <div className='flex gap-[5px] group'>
              <div>{'['}</div>
              {/* <button className='go ' onClick={() => toggleOpen(path)}>
              {isOpen(path) ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
            </button> */}
              <div className='go '>
                arrow_right
              </div>

              <div className={`gap-2 hidden group-hover:flex [&>*]:border-[1px] [&>*]:border-gray-500 [&>*]:rounded-[25px] [&>*]:p-[0px_4px] text-[12px]`}>
                <button className='go ' onClick={() => addValue([...path, val.length], '')}>text_fields</button>
                <button className='go ' onClick={() => addValue([...path, val.length], 0)}>numbers</button>
                <button className='go ' onClick={() => addValue([...path, val.length], true)}>contrast</button>
                <button className='go ' onClick={() => addValue([...path, val.length], [])}>data_array</button>
                <button className='go ' onClick={() => addValue([...path, val.length], {})}>data_object</button>
                <button className='go ' onClick={() => duplicateValue(path)}>content_copy</button>
                <button className='go ' onClick={() => deleteValue(path)}>delete</button>
              </div>
            </div>}

          <div className='flex flex-col gap-[5px] p-[5px_0px]'>
            {isOpen(path) && val.map((item, index) => (
              <MomSaidTheVirtualListAtHome key={index} inVisibleHeight='20px' style={{ marginLeft: '20px' }} className='flex flex-col gap-2'>
                {/* <div key={index} style={{ marginLeft: '20px' }} className='flex flex-col gap-2'> */}
                {(item instanceof Object || Array.isArray(item)) &&
                  <div className='flex gap-[2px] cursor-pointer max-w-[350px] border-[1px] border-[#00000010] rounded-[10px] p-[0px_4px] text-[12px]' onClick={() => toggleExpand([...path, index])}>
                    <div className={`max-w-[350px] overflow-hidden whitespace-nowrap ${isExpanded([...path, index]) ? '' : 'overflow-ellipsis'}`}>
                      {index} : {JSON.stringify(item)}
                    </div>
                    {(item instanceof Object || Array.isArray(item)) && <div>
                      {JSON.stringify(item)[JSON.stringify(item).length - 1]}
                    </div>}
                    <div className='go '>
                      {isExpanded([...path, index]) ? 'expand_less' : 'expand_more'}
                    </div>
                  </div>
                }
                {(item instanceof Object || Array.isArray(item)) && isExpanded([...path, index]) && renderValue(item, [...path, index])}
                {!(item instanceof Object || Array.isArray(item)) && renderValue(item, [...path, index])}
                {/*

              {renderValue(item, [...path, index])}
              */}
                {/* </div> */}
              </MomSaidTheVirtualListAtHome>
            ))}
          </div>
          {!readOnly &&
            <div className=' text-start'>{']'}</div>}
        </div>
      );
    }
    if (typeof val === 'object') {
      return (
        <div className='flex flex-col gap-[2px] shadow-[inset_0_0_0px_0.2px_#4b4b4b] bg-[#00000005]'
          style={{
            // outline: '1px solid #00000010',
            padding: '5px',
            borderRadius: '10px',
          }}>
          {!readOnly &&
            <div className='flex gap-[5px] group'>
              <div>{'{'}</div>
              {/* <button className='go ' onClick={() => toggleOpen(path)}>
              {isOpen(path) ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
            </button> */}
              <div className='go '>
                arrow_right
              </div>

              <div className='gap-2 hidden group-hover:flex [&>*]:border-[1px] [&>*]:border-gray-500 [&>*]:rounded-[25px] [&>*]:p-[0px_4px] text-[12px]'>
                <button className='go ' onClick={() => addValue([...path, `newKey${Object.keys(val).length}`], '')}>
                  text_fields
                </button>
                <button className='go ' onClick={() => addValue([...path, `newKey${Object.keys(val).length}`], 0)}>
                  numbers
                </button>
                <button className='go ' onClick={() => addValue([...path, `newKey${Object.keys(val).length}`], true)}>
                  contrast
                </button>
                <button className='go ' onClick={() => addValue([...path, `newKey${Object.keys(val).length}`], [])}>
                  data_array
                </button>
                <button className='go ' onClick={() => addValue([...path, `newKey${Object.keys(val).length}`], {})}>
                  data_object
                </button>
                <button className='go ' onClick={() => duplicateValue(path)}>content_copy</button>
                <button className='go ' onClick={() => deleteValue(path)}>delete</button>
              </div>
            </div>}
          {isOpen(path) && Object.entries(val).map(([key, value]) => (
            <div key={key} style={{ marginLeft: '20px' }}
              className={`flex gap-2 ${(value instanceof Object || Array.isArray(value)) ? 'flex-col' : ''}`}>
              <div className='flex gap-2 [&>*]:border-[1px] [&>*]:border-[#00000010] [&>*]:rounded-[10px] [&>*]:p-[0px_4px] text-[12px]'>
                <div>
                  <input
                    defaultValue={key}
                    className='hover:bg-[#00000005] bg-[--cms-bg_hover]'
                    onBlur={(e) => {
                      const newKey = e.target.value.trim();
                      if (newKey === '' || (newKey !== key && newKey in val)) {
                        alert('Invalid key. Key cannot be empty or duplicate.');
                        e.target.value = key;
                        return;
                      }

                      changeValue([...path, key], newKey, true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.target.blur();
                      }
                    }}
                    style={{ width: '100px' }}
                    readOnly={readOnly}
                  />
                </div>
                :
                {(value instanceof Object || Array.isArray(value)) &&
                  <div className='flex gap-[2px] cursor-pointer' onClick={() => toggleExpand([...path, key])}>
                    <div className={`max-w-[220px] overflow-hidden whitespace-nowrap ${isExpanded([...path, key]) ? '' : 'overflow-ellipsis'}`}>
                      {Array.isArray(value) ? `[${value.length}]` : ''}{JSON.stringify(value)}
                      {/* {JSON.stringify(value)} */}
                    </div>
                    {(value instanceof Object || Array.isArray(value)) && <div>
                      {JSON.stringify(value)[JSON.stringify(value).length - 1]}
                    </div>}

                    <div className='go '>
                      {isExpanded([...path, key]) ? 'expand_less' : 'expand_more'}
                    </div>
                  </div>}
              </div>
              {(value instanceof Object || Array.isArray(value)) && isExpanded([...path, key]) && renderValue(value, [...path, key])}
              {!(value instanceof Object || Array.isArray(value)) && renderValue(value, [...path, key])}
              {/* {renderValue(value, [...path, key])} */}
            </div>
          ))}
          {!readOnly &&
            <div className=' text-start'>{'}'}</div>}
        </div>
      );
    }
  };

  return (
    <div className='flex flex-col gap-[2px]'>
      {rootEditable &&
        <div className='flex gap-2 [&>*]:border-[1px] [&>*]:border-gray-500 [&>*]:rounded-[25px] [&>*]:p-[0px_4px] text-[12px]'>
          <button className='go ' onClick={() => addValue([], '')}>text_fields</button>
          <button className='go ' onClick={() => addValue([], 0)}>numbers</button>
          <button className='go ' onClick={() => addValue([], true)}>contrast</button>
          <button className='go ' onClick={() => addValue([], [])}>data_array</button>
          <button className='go ' onClick={() => addValue([], {})}>data_object</button>
        </div>}
      {renderValue(_value)}
    </div>
  );
};

export default JSONBuilder;