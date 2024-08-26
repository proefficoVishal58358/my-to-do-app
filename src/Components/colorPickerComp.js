import React from "react";
import { ChromePicker } from "react-color";
const ColorPickerComp = ({showPicker,handleClick,handleChangeComplete,color}) => {
  return (
    <>
      {showPicker && (
        <div style={{ position: 'absolute', zIndex: '999', padding:"10px" }}>
          <ChromePicker
            color={color}
            onChangeComplete={handleChangeComplete}
          />
        </div>
      )}  
      </>
  )
}

export default ColorPickerComp
