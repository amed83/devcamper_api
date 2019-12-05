const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title to your review"],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, "Please add a text"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add your rating"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // this to crate a relationship with Bootcamp
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  },
  // this to crate a relationship with User
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});


// A user can add just one review per bootcamp
ReviewSchema.index({bootcamp:1,user:1},{unique:true})

//Static method to get avg rating  and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    //aggregation
    const obj = await this.aggregate([{
        $match: {bootcamp: bootcampId}
    }, {
        $group: {
            _id: '$bootcamp',
            averageRating: {
                $avg: '$rating'
            }
        }
    }
    ])
    try{
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageRating:obj[0].averageRating
        })
    }catch(err){
        console.log('error ', err)
    }
}

// Call getAverageRating after save

ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp)
})

// Call getAverageRating before remove

ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp)
})







module.exports = mongoose.model("Review", ReviewSchema);
