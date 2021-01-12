import React from "react";
import Iframe from 'react-iframe';

export default () => {
    return(
       <Iframe url="https://notify-timeline.netlify.app/"
        width="100%"
        height="700px"
        id="react-notification-tl-id"
        display="initial"
        position="relative"/>
    )
}

