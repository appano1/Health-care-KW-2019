import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';

function Result({ list, onRemove }) {
  return (
    <div>
      {list.map((item, index) => (
        <Item item={item} key={index} onRemove={onRemove} />
      ))}
    </div>
  );
}
function Item({item,k, onRemove}){
    return(
        <div>
          <label><b>{item}</b>
          <Button id="remove" 
          onClick ={() => onRemove(item)}>
          <DeleteIcon/>
        </Button> 
          </label>
        </div>
    )
}

export default Result;
