import { useState } from 'react';

/**
 * A handmade base table component that can be used to create a table with sticky rows and columns. Created by RONI
 * 
 * Here is an example of how to use this component:
 *  @example
 * <DataTableBase
        className={'flex-grow'}
        data={data[0]}
        defaultBackgroundColor={"#222"}
        disableTitle={true}
        stickyRowsLeft={2}
        stickyRowsRight={1}
        rowHeight={25}
        titleHeight={50}
        columnTitles={[
          { name: 'ID', prop: 'id', width: 100 },
          { name: 'Name', prop: 'name', width: 200 },
          { name: 'Email', prop: 'email', width: 200 },
          { name: 'Phone', prop: 'phone', width: 200 },
          { name: 'Address', prop: 'address', width: 200 },
          { name: 'City', prop: 'city', width: 200 },
          { name: 'State', prop: 'state', width: 200 },
          { name: 'Zip', prop: 'zip', width: 200 },
          { name: 'Country', prop: 'country', width: 200 },
          { name: 'Date', prop: 'date', width: 200 },
          { name: 'Time', prop: 'time', width: 200 },
          { name: 'Status', prop: 'status', width: 200 },
        ]}
      />
    </div>
  *
 * @returns * 
 */
function DataTableBase({ 
  stickyRowsLeft, 
  stickyRowsRight, 
  rowHeight, 
  titleHeight, 
  columnTitles, 
  data, 
  className, 
  defaultBackgroundColor, 
  disableTitle,
  scrollBarWidth = 10, 
  scrollBarHeight = 10,
  scrollBarColor = '#333',
  scrollBarThumbColor = '#666',
  scrollBarThumbHoverColor = '#555',
} = {}) {
  
  //if no columnTitles, use data[0] as columnTitles
  const _columnTitles = columnTitles? columnTitles : Object.keys(data[0]).map((key) => ({ name: key, prop: key, width: 200 }));
  // const rowCount = data.length;
  const colCount = _columnTitles.length;

  const getStyles = (i, j) => {
    const styles = {
      // gridColumn: `${j + 1}`,
      // padding: '0',
      // border: '1px solid black',
      // overflow: 'hidden',
      // backgroundColor: 'blue',
      zIndex: 0,
    };

    if (j < stickyRowsLeft) {
      styles.position = 'sticky';
      styles.left = _columnTitles.slice(0, j).reduce((a, b) => a + b.width, 0) + 'px';
      styles.zIndex = 1;
      // styles.backgroundColor = 'red';
    }

    if (j >= colCount - stickyRowsRight) {
      styles.position = 'sticky';
      styles.right = _columnTitles.slice(j + 1).reduce((a, b) => a + b.width, 0) + 'px';
      // styles.backgroundColor = 'yellow';
    }

    if (i === 0) {
      styles.position = 'sticky';
      styles.top = '0';
      styles.zIndex = 2;
      // styles.backgroundColor = 'green';
    }

    if ((j < stickyRowsLeft || j >= colCount - stickyRowsRight) && i === 0) {
      styles.zIndex = 3;
    }

    return styles;
  };

  return (
    <div className={`relative h-[150px]  ${className !== undefined ? className : ''}`}>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto' }} >
        <style jsx>{`
          ::-webkit-scrollbar {
            width: ${scrollBarWidth}px;
            height: ${scrollBarHeight}px;
          }

          ::-webkit-scrollbar-track {
            background: ${scrollBarColor};
          }

          ::-webkit-scrollbar-thumb {
            background: ${scrollBarThumbColor};
          }

          ::-webkit-scrollbar-thumb:hover {
            background: ${scrollBarThumbHoverColor};
          }
          .tableContainer {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            display: grid;
            align-items: start;
            background-color: ${defaultBackgroundColor ? defaultBackgroundColor : 'white'};
            
          }
          .gridContainer {
            display: grid;
            grid-template-columns: ${_columnTitles.map(({ width }) => `minmax(${width}px, 1fr)`).join(' ')};            
            grid-template-rows: ${titleHeight ? titleHeight : (disableTitle?'0px':'40px')}px repeat(${data.length}, minmax(${rowHeight ? typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight : 'auto'}, auto));
          }
          .titleCell {
            background-color: ${defaultBackgroundColor ? defaultBackgroundColor : 'white'};
          }
          .contentCell {
            position: relative;
            overflow: hidden;
            background-color: ${defaultBackgroundColor ? defaultBackgroundColor : 'white'};
            min-height: ${rowHeight ? typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight: 'auto'}; 
          }
        `}</style>
        <div className={`tableContainer`}>

          <div className={` gridContainer`}>

            <div key={`titles`} style={{ display: 'contents' }}>
              {_columnTitles.map(({ name, prop, customTitle }, j) => (
                <div key={`title-${j}`} className='titleCell' style={{ ...getStyles(0, j), height: titleHeight ? titleHeight : (disableTitle ? '0px' : '40px') }}> {
                  customTitle ? customTitle({ name }) : name} </div>
              ))}
            </div>

            {data.map((row, i) => (
              <div key={`row-${i}`} style={{ display: 'contents' }}>
                {_columnTitles.map(({ name, prop, customCell } = {}, j) => (
                  <div key={`cell-${i}-${j}`} className='contentCell' style={{ ...getStyles(i + 1, j) }}> {
                    customCell ? customCell(row) : JSON.stringify(row[prop])
                  } </div>
                ))}
              </div>
            ))}


          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableBase