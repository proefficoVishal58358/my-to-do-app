import React from 'react'

function ClipBoard({clipBoardFlag,setClipBoardSmalDiv,handleCloseClipBoard,setClipBoardTextItems,clipBoardTextItems,deleteClipBoardCopyText}) {
  return (
    <div>
        {
      clipBoardFlag &&
          <div onClick={(e)=>{ setClipBoardSmalDiv(false)}} className={`clipboard-container ${clipBoardFlag ? 'visible' : ''} card card-body rounded p-0 mt-3 mx-3 overflow-y-scroll position-relative`} style={{height:"500px", width:"400px", }}>
            <button onClick={handleCloseClipBoard} className="btn btn-light border-2 rounded-2 position-fixed" style={{zIndex:"999"}}>
            <em  className="fas fa-x text-danger fa-lg" ></em>
            </button>
              {clipBoardTextItems.length > 0 && <div className="d-flex justify-content-end p-2">
                <button onClick={()=>setClipBoardTextItems([])} className="btn btn-secondary text-sm btn-sm text-white"> Clear All</button> 
              </div>}
              {clipBoardTextItems.length==0 && <div className=" mx-2 mt-5">
                <p className="text-muted text-start text-capitalize text-center text-dark fa-lg">{"No Items"}</p>
                </div>}
              {clipBoardTextItems?.map((ele,index)=>
              <>
              <div key={`clip${index}`} className={`card shadow p-0 border-bottom border-2 mx-2 ${index==0?"mt-1":"mt-1"}`}>
              <div className="d-flex p-2 justify-content-between">
                <p className="text-muted text-start text-capitalize">{ele}</p>
              </div>
              {<div className="d-flex justify-content-end mb-2">
                <button onClick={()=>deleteClipBoardCopyText(index)} className="btn btn-secondary text-sm btn-sm mx-2 text-white"> Delete</button> 
              </div>}
              </div>
              </>
                )}
              
          </div>
        }
    </div>
  )
}

export default ClipBoard
