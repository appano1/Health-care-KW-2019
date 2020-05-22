import React from "react";
import DiscreteSlider from "./Slider";


function Picture({number,setScore,score}) {
    

    const src = `http://localhost:4002/images/${number}.png`
    return( 
        <div className = "bbox">
            <img id="picture" src={src}/>
            <DiscreteSlider setScore={setScore}/>
        </div>
    )
}


export default Picture;