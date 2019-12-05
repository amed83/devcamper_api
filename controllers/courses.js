const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");


//@desc Get all courses
//@route GET /api/v1/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    //check what kind of request and build the query accordingly
    if (req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId})
    } else {
        query = Course.find().populate(
            {
                path: 'bootcamp', select: 'name description'
            }
        )
    }

    const courses = await query

    res.status(200).json({
        count: courses.length,
        success: true,
        data: courses
    })
})


//@desc Get single course
//@route GET /api/v1/course/:id
//@access Public

exports.getSingleCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 400)
    }

    res.status(200).json({
        success: true,
        data: course
    })
})


exports.addCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId
    req.body.user=req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamop with the id of ${req.params.bootcampId}`), 400)
    }

    // Make sure user is bootcamp owner
    if(bootcamp.user.toString()!== req.user.id || req.user.role !=='admin'){
        return next(new ErrorResponse(`User ${req.body.user} is not authorized to add a course to  this bootcamp`,401))
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        data: course
    })

})

//@desc  Update course
//@route PUT /api/v1/courses/:id
//@access Private


exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.id}`), 400)
    }

    // Make sure user is course owner
    if(course.user.toString()!== req.user.id || req.user.role !=='admin'){
        return next(new ErrorResponse(`User ${req.body.user} is not authorized to update a course to this bootcamp`,401))
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success: true,
        data: course
    })

})


//@desc  Delete course
//@route DELETE /api/v1/courses/:id
//@access Private


exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.id}`), 400)
    }
    // Make sure user is course owner
    if(course.user.toString()!== req.user.id || req.user.role !=='admin'){
        return next(new ErrorResponse(`User ${req.body.user} is not authorized to update a course to this bootcamp`,401))
    }

    await course.remove()

    res.status(200).json({
        success: true,
        message:"Course deleted"
    })

})




