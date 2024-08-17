import React from 'react'

function MinMaxBtnCanva({maxCanvaWidthFunc,minCanvaWidthFunc}) {
  return (
    <div className='d-flex flex-wrap justify-content-end mt-2'>
      <button type='button' onClick={maxCanvaWidthFunc} className='btn btn-sm btn-secondary mx-1'> Max(+)</button>
      <button type='button' onClick={minCanvaWidthFunc} className='btn btn-sm btn-secondary mx-1'> Min(-)</button>
    </div>
  )
}
export default MinMaxBtnCanva
