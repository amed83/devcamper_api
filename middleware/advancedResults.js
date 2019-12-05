
const advancedResults = (model,populate) => async (req,res,next)=> {

    const reqQuery = {...req.query}
    //Fileds to exclude
    const removeFileds = ['select','sort','limit','page']

    //Loop over removeFileds and delete them from reqQuery
    removeFileds.forEach(param=> delete reqQuery[param])


    let query;
    let queryStr = JSON.stringify(reqQuery)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`)


    //Finding resource and populate with virtuals (see lesson 39)
    query = model.find(JSON.parse(queryStr)).populate('courses');
    //Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query.select(fields)
    }
    //Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }else{
        query = query.sort('-createdAt')
    }
    //Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 10;
    const startIndex=(page-1) * limit
    const endIndex = page * limit;

    query = query.skip(startIndex).limit(limit)

    if(populate){
        query = query.populate(populate);
    }



    const total = await model.countDocuments()

    // Executing query
    const results = await query

    //Pagination result
    const pagination = {}

    if(endIndex < total){
        pagination.next = {
            page:page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.prev = {
            page:page -1,
            limit
        }
    }


    res.advanceResults = {
        success:true,
        count:results.length,
        pagination,
        data:results
    }

    next()

}


module.exports = advancedResults()