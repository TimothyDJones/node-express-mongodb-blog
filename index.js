const express = require('express')
const path = require('path')

const app = new express()
app.use(express.static('public'))

const ejs = require('ejs')
app.set('view engine', 'ejs')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/clean_blog_db', {useNewUrlParser: true})

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true} ))

const fileUpload = require('express-fileupload')
app.use(fileUpload())

const BlogPost = require('./models/BlogPost')

const appPort = 4000

app.listen(appPort, () => {
	console.log("Application listening on port " + appPort + "...")
})

app.get('/', async (req, res) => {
	//res.sendFile(path.resolve(__dirname, 'pages/index.html'))
	const blogposts = await BlogPost.find( {} )	// "Find" all posts!
	console.log(blogposts)
	res.render('index', {
		blogposts //blogposts: blogposts
	})
})

app.get('/about', (req, res) => {
	//res.sendFile(path.resolve(__dirname, 'pages/about.html'))
	res.render('about')
})

app.get('/contact', (req, res) => {
	//res.sendFile(path.resolve(__dirname, 'pages/contact.html'))
	res.render('contact')
})

app.get('/post/:id', async (req, res) => {
	//res.sendFile(path.resolve(__dirname, 'pages/post.html'))
	const blogpost = await BlogPost.findById(req.params.id)
	res.render('post', {
		blogpost
	})
})

app.get('/posts/new', (req, res) => {
	res.render('create')
})

app.post('/posts/store', (req, res) => {
	// console.log(req.body)
	let image = req.files.image;
	image.mv(path.resolve(__dirname, 'public/img', image.name),
		async (error) => {
		// Use the BlogPost model to create a new document (record)
		// in MongoDB from the form data.
		await BlogPost.create({
			...req.body,
			image: '/img/' + image.name
		})
		// 'await' tells the process to wait for 'BlogPost.create'
		// to return before proceeding.  (ES8)
		res.redirect('/')
	})
})
