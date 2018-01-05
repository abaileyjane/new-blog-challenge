const express = require('express');
const morgan = require('morgan');

const bodyParser= require('body-parser');
const jsonParser=bodyParser.json();
const app = express();
app.use(morgan('common'));

const {BlogPosts} = require('./models');

app.get('/blog-posts', (req, res)=>{
	console.log('running get request');
	res.json(BlogPosts.get());
	res.status(201).end();
})

app.delete('/blog-posts/:id', (req, res)=>{
	BlogPosts.delete(req.params.id);
	console.log(`deleting ${req.params.id}`);
	res.status(204).end()
})

app.post('/blog-posts', jsonParser, (req,res)=>{
	const requiredFields=['title', 'content', 'author', 'publishDate'];
	for(let i=0; i<requiredFields.length; i++){
		if(!(requiredFields[i] in req.body)){
			const message = `there is an error because the body is missing ${requiredFields[i]}`;
			return res.status(500).send(message);
		}
	}
	const item=BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
})

app.put('/blog-posts/:id', jsonParser, (req, res)=>{
	const requiredFields =['title', 'id', 'content', 'author', 'publishDate'];
	for(let i=0; i<requiredFields.length; i++){
		if(!(requiredFields[i] in req.body)){
			const message = `${requiredFields[i]} must be included in body request`;
			return res.status(500).send(message);
		}
	}
	if(req.params.id !== req.body.id){
		const errmessage="id does not match id in databse";
		return res.status(400).send(errmessage);
	}
	const newItem = BlogPosts.update({
		title: req.body.title,
		id: req.params.id,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
		})
	res.status(204).end();
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer() {
  const port = process.env.PORT || 9090;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
