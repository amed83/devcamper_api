const express = require("express");

const {getCourses,getSingleCourse,addCourse,updateCourse,deleteCourse} = require("../controllers/courses")
const {protect,authorize} = require('../middleware/auth')
// mergeParams to make this work from bootcamp routes
//mergeParams description from docs: Preserve the req.params values from the parent router.
// If the parent and the child have conflicting param names, the child’s value take precedence.

const router = express.Router({mergeParams:true});

router.route("/").get(getCourses)
    .post(protect,authorize('publisher', 'admin'),addCourse)
router.route("/:id").get(getSingleCourse)
    .put(protect,authorize('publisher', 'admin'),updateCourse)
    .delete(protect,authorize('publisher', 'admin'),deleteCourse)

module.exports= router;