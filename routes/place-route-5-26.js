const express = require('express');

const router= express.Router();
router.get('/:pid', (req,res,next)=>{
    console.log(req.params);
    const placeId = req.params.pid //express provide params will generate {pid:p1} by "/:pid"webaddressbar no need this ':'
    //api/places/place1234
    const place= Dummy_Places.find((p)=>{
        return p.id===placeId
    }

    )
    res.json({place});
});

module.exports= router;

const Dummy_Places= [{
    id:'p1',
    name:'empire building',
    location:{
        lat:223.555,
        lng:58.3697
    }},
    { 
    id:'p2',
    name:'world tower',
    location:{
        lat:22.555,
        lng:581.3697
    }},
]
