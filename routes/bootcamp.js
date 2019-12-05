const express = require("express");
//TODO import create and delete BC from models and make it work here
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const {
    getBootcamps,
    getBootcamp,
    updateBootcamp,
    getBootcampsInRadius,
    deleteBootcamps,
    boocampPhotoUpload
} = require("../controllers/bootcamp");
const {protect,authorize} = require('../middleware/auth')

const advancedResults = require('../middleware/advancedResults')

//Include other resource routers
const courseRouter = require('./courses')
const reviewrouter = require('./reviews')

const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews',reviewrouter)



router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router.route('/:id/photo').put(protect,authorize('publisher', 'admin'),boocampPhotoUpload)

// TODO: integrate the advancedResults middeleware

router
  .route("/")
  .get(getBootcamps)
  .post(
    protect,
    authorize("publisher", "admin"),
    asyncHandler(async (req, res, next) => {
      //Add user to req.body
        console.log(' body ', req.user )
      req.body.user = req.user.id;

      //Check for published bootcamp

      const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
      // If user is not an admin, theuy can only add one bootcamp
      if (publishedBootcamp && req.user.role !== "admin") {
        return next(
          new ErrorResponse(
            `The user with ID ${req.user.id} has already published a bootcamp`
          )
        );
      }

      const bootcamp = await Bootcamp.create(req.body);
      if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not created`, 400));
      }
      res.status(200).json({ success: true, data: bootcamp });
    })
  );
router
    .route("/:id")
    .get(getBootcamp)
    .put(protect,authorize('publisher', 'admin'),  updateBootcamp)
    .delete(protect,authorize('publisher', 'admin'), deleteBootcamps)

module.exports = router;
