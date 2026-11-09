const express = require("express");
const router = express.Router();
const { cloudinary } = require("../utils/cloudinary");
const userModel = require("../models/userModel");

router
.route("/updateinfo")
.post(updatepfp);

async function updatepfp(req, res) {
    try {
        const {userid, username, pfpUrl} = req.body;

        const upload = await cloudinary.uploader.upload(pfpUrl,{
            folder : `user/${userid}/pfp`
        })

        const response = await userModel.findOneAndUpdate({_id : userid,},
            {
                $set : {
                    username : username,
                    pfp : upload.secure_url
                }
            },
            {
                returnDocument: "after",
            }
        )

        res.json({success : true});
    }
    catch(error) {console.error("updatepfp error:", error);
        res.status(500).json({ success: false });
    }
}

module.exports = router;