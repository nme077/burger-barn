import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes'


export const Item = ({item, index, deleteItem, showEditItem, id, moveItem, handleUpdateItemOrder, sortedMenu}) => {

    const ref = useRef(null);

    const [{ handlerId }, drop] = useDrop(() => ({
      accept: ItemTypes.ITEM,
      collect(monitor) {
          return {
              handlerId: monitor.getHandlerId(),
          };
      },
      hover(item, monitor) {
          if (!ref.current) {
              return;
          }
          const dragIndex = item.index;
          const hoverIndex = index;
          // Don't replace items with themselves
          if (dragIndex === hoverIndex) {
              return;
          }
          // Determine rectangle on screen
          const hoverBoundingRect = ref.current?.getBoundingClientRect();
          // Get vertical middle
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          // Determine mouse position
          const clientOffset = monitor.getClientOffset();
          // Get pixels to the top
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
          // Only perform the move when the mouse has crossed half of the items height
          // When dragging downwards, only move when the cursor is below 50%
          // When dragging upwards, only move when the cursor is above 50%
          // Dragging downwards
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
              return;
          }
          // Dragging upwards
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
              return;
          }
          // Time to actually perform the action
          moveItem(dragIndex, hoverIndex);
          // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.
          item.index = hoverIndex;
      }
  }),[sortedMenu]);

    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.ITEM,
      item: () => {
        return { id, index };
      },
      collect: (monitor) => ({
          isDragging: monitor.isDragging()
        }),
       end: (item, monitor) => {
            handleUpdateItemOrder();
       }
    }),[sortedMenu]); //Need state variables used within isDrag to be listed as dependencies

    drag(drop(ref));

    return (
      /** Draggable **/ 
      <div>
        <div className="menu-item-container-admin" ref={ref} data-handler-id={handlerId} style={{opacity: isDragging ? 0 : 1, cursor: 'move'}}>
          <div className="col-admin col-drag"><i className="fas fa-bars" ></i></div>
          <div className="col-admin col-1-admin menu-item-name-admin">{item.name ? item.name : ''}</div>
          <div className="col-admin col-2-admin menu-item-description-admin">{item.description ? item.description : ''}</div>
          <div className="col-admin col-3-admin price-container">
            {item.prices.map((price, ind) => {
              return <div key={ind}>{price[0] ? `desc(${ind+1}): ` + price[0] + ', ' : ''} {price[1]}</div>;
            })}
          </div>
          <div className="col-admin col-4-admin menu-item-category-admin">{item.category ? item.category : ''}</div>
          <button className="col-admin col-5-admin form-btn" onClick={() => showEditItem(item)}>Edit</button>
          <button className="col-admin col-6-admin form-btn delete-btn" onClick={() => deleteItem(item._id)}>Delete</button>
        </div>
      </div>
    /** End Draggable **/ 
    )
  }