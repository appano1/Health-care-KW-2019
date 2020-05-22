import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";

type FoodInfoType = {
  foodName: string;
  index: number
  onRemove: any;
  foodInsertState: [
    Boolean,
    React.Dispatch<React.SetStateAction<Boolean>>
  ]
};

function ListItem({ foodName, index, onRemove, foodInsertState }: FoodInfoType) {
  const [ isFoodInsert, setFoodInsertSate ] = foodInsertState;
  useEffect(() => {
    if (isFoodInsert) {
      setFoodInsertSate(false);
    }
  }, [isFoodInsert, setFoodInsertSate]);
  return (
    <>
      <li>
        <div id="list-item">
          {foodName}
          <FontAwesomeIcon icon={faTrashAlt} onClick={() => {
            onRemove(index);
          }} />
        </div>
      </li>
    </>
  );
}

export default ListItem;