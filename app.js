//npm modules
const express= require("express")
const app = express()
const mongoose = require("mongoose")


// modules created
const Campground = require('./models/Campground')
const Comment = require('./models/Comment')
const seedDB = require('./seed')

// mdn inline-style

mongoose.connect("mongodb://localhost/yelp-camp", {useNewUrlParser: true})
.then(() => console.log("connected to database"))
.catch((err) => console.log("Error connecting ${err}"))

seedDB()

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))


app.get('/',  (req, res) => {
    res.render("landing")
})

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) throw err
        res.render("index", {campgrounds: campgrounds})
    })
})
app.get("/campgrounds/new", (req, res) => {
    res.render("new")
})

app.post("/campgrounds", (req, res) => {
    var newCampground = {name: req.body.name, image: req.body.image, description: req.body.description}
    console.log(newCampground)
    Campground.create(newCampground, (err, newCampground) => {
        if(err) throw err
        res.redirect("/campgrounds")
    })
})

app.get("/campgrounds/:id/", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err){
            console.log(err)
        }else{
            console.log(campground)
            res.render("show", {campground: campground })
        }
    })
})


////////////////////////// coments
app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render('newcomment', {campground:campground})
    })
})

app.post('/campgrounds/:id/comments', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err)
            res.redirect('/campgrounds')
        }else{
            var {text, author} = req.body
            Comment.create({
                text, author
            }, (err, comment) => {
                if(err){
                    console.log(err)
                }else{
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

const PORT = 5100
app.listen(PORT, () => console.log(`Server running on ${PORT}`))