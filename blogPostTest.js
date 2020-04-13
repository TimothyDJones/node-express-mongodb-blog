const mongoose = require('mongoose')

const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb://localhost/clean_blog_db', {useNewUrlParser: true});

BlogPost.create({
	title: "New blog post title",
	body: "New blog post body..."
}, (error, blogpost) => {
	console.log(error, blogpost)
})
