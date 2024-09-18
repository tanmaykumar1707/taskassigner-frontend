import React from 'react'
import { Oval } from 'react-loader-spinner'

const Loader = ({ color, height = 20, width = 20 }) => {
  return (
    <Oval
      height={height}
      width={width}
      color={color || "white"}
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor={color || "white"}
      strokeWidth={6}
      strokeWidthSecondary={6}

    />
  )
}

export default Loader