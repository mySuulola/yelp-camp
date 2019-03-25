const mongoose = require('mongoose')
const Campground = require('./models/Campground')
const Comment = require('./models/Comment')

const campgrounds = [{
        name: "Comfy campground",
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, delectus cum. Voluptatem magnam veniam labore non veritatis alias quam soluta quidem deserunt iste eveniet quaerat nostrum enim maiores, commodi at.' 
    },
    {
        name: "open campground",
        image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, delectus cum. Voluptatem magnam veniam labore non veritatis alias quam soluta quidem deserunt iste eveniet quaerat nostrum enim maiores, commodi at.'
    },
    {
        name: "repeated campground",
        image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, delectus cum. Voluptatem magnam veniam labore non veritatis alias quam soluta quidem deserunt iste eveniet quaerat nostrum enim maiores, commodi at.'
    },

]


function seedDB() {
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('all campground removed')
            Comment.remove({}, (err) => {
                if(err){
                    console.log(err)
                }else{
                    console.log('comments removed')
                    campgrounds.forEach(seed => {
                        Campground.create(seed, (err, campground) => {
                            if(err){
                                console.log(er)
                            }else{
                                console.log('new campground added')
                                Comment.create({
                                    text: 'this is a sample comment',
                                    author: 'dopeUser'
                                }, (err, comment) => {
                                    if(err){
                                        console.log(err)
                                    }else{
                                        campground.comments.push(comment)
                                        campground.save()
                                        console.log('added comment to user')
                                    }
                                })
                            }
                        })
                    });
                }
            })
           
        }

    })
}

module.exports = seedDB