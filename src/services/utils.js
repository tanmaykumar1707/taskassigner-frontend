

export const utils = {
    resolvePriority(p) {
      if(p===1)
        return <span className="text-white bg-red-500 px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> HIGH</span>
    else if(p===2)
        return <span className="text-white bg-yellow-500 px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> MEDIUM</span>
    else if(p===3)
        return <span className="text-white bg-cyan-500 px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> LOW</span>
    else return p;
        
    },
    resolveStatus(status) {
          if(status==='ASSIGNED_TO_NOC' || status==='IN_PROGRESS')
            return <span className="text-white bg-yellow-600 px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> IN_PROGRESS</span>
        else if(status==='FAILED')
            return <span className="text-white bg-red-500  px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> FAILED</span>
        else if(status==="PASSED" || status==="DONE" )
            return <span className="text-white bg-[#24A148] px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> PASSED</span>
        else return status;
        }
,
    resolveTaskStatus(status) {
            if(status==='PENDING')
              return <span className="text-white bg-yellow-600 px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> PENDING</span>
          else if(status==='IN_PROGRESS')
              return <span className="text-white bg-blue-500  px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> IN_PROGRESS</span>
          else if(status==="DONE" )
              return <span className="text-white bg-[#24A148] px-4 md:pl-20 lg:pl-20 md:pr-20 lg:pr-20 md:ml-3"> DONE</span>
          else return status;
          }
  };