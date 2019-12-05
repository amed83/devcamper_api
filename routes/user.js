const express = require("express");

const {getUsers,getUser,createUser,updateUser,deleteUser} = require("../controllers/user")
const {protect,authorize} = require('../middleware/auth')
// mergeParams to make this work from bootcamp routes
//mergeParams description from docs: Preserve the req.params values from the parent router.
// If the parent and the child have conflicting param names, the child’s value take precedence.

const router = express.Router({mergeParams:true});

router.use(protect)
router.use(authorize('admin'))

router.route("/").get(getUsers)
    .post(createUser)
router.route("/:id").get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports= router;