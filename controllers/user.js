const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require('../models/User')

// @desc   Get all users
// @route  GET/api/v1/auth/user
// @access Private/Admin

exports.getUsers = asyncHandler(async(req,res,next)=>{
    // TODO: advanced results middleware still not implementd
    // res.status(200).json(res.advanceResults)

    const users = await User.find()
    if(!users){
        next(new ErrorResponse('It was not possible to get users ', 400))
    }
    res.status(200).json({
        success:true,
        data:users
    })

})



// @desc   Get Single user
// @route  GET/api/v1/auth/user:/id
// @access Private/Admin

exports.getUser = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    res.status(200).json({
        success:true,
        data:user
    })

})


exports.createUser = asyncHandler(async(req,res,next)=>{
    const user = await User.create(req.body)
    res.status(201).json({
        success:true,
        data:user
    })
})

exports.updateUser = asyncHandler(async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        data:user
    })
})

exports.deleteUser = asyncHandler(async(req,res,next)=>{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success:true,
    })
})
