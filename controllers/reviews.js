const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//@desc Get all reviews for bootcamp
//@route GET /api/v1/bootcamps/:bootcampId/reviews
//@access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  //TODO: implement advancedResults middleware
  const reviews = await Review.find({ bootcamp: req.params.bootcampId });

  res.status(200).json({
    count: reviews.length,
    success: true,
    data: reviews
  });
});

//@desc Get single review for bootcamp
//@route GET /api/v1/bootcamps/:bootcampId/reviews/:reviewId
//@access Public

exports.getReview = asyncHandler(async (req, res, next) => {
  //TODO: implement advancedResults middleware

  const review = await Review.findById(req.params.id).populate({
    path: "Bootcamp",
    select: "name description"
  });

  if (!review) {
    next(new ErrorResponse(`No review with the id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});


//@desc Post new review
//@route POST /api/v1/bootcamps/:bootcampId/reviews
//@access Private

exports.addReview = asyncHandler(async (req, res, next) => {
    //Adding info to the body
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
        return next(new ErrorResponse(`no bootcamp with id ${req.params.bootcampId} `,404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        succeess:true,
        data:review
    })

});



//@desc Update review
//@route PUT /api/v1/reviews/:id
//@access Private

exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id)


    if(!review){
        next(new ErrorResponse(`no review found with id ${req.params.id}`))
    }

    // Make user review belong to the user or the user is admin

    if(review.user.toString()!==req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(
                `Not authorized to update review`,404
            )
        )
    }

    review = await Review.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    console.log(' review ', review)

    res.status(201).json({
        succeess:true,
        data:review
    })

});




//@desc Update review
//@route PUT /api/v1/reviews/:id
//@access Private

exports.deleteReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id)


    if(!review){
        next(new ErrorResponse(`no review found with id ${req.params.id}`))
    }

    // Make user review belong to the user or the user is admin

    if(review.user.toString()!==req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(
                `Not authorized to update review`,404
            )
        )
    }

    await review.remove()

    res.status(201).json({
        succeess:true,
        message:"review removed "
    })

});




