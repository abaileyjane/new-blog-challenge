const mocha = require('mocha');
const chai= require('chai');
const chaiHttp=require('chai-http');

const{app, runServer, closeServer} = require('../server');
const {BlogPosts} = require('../models');

const should = chai.should();

chai.use(chaiHttp);

describe('BlogPosts', function(){
	before(function(){
		return runServer()
	})

	after(function(){
		return closeServer();
	})

	it('should list blog posts on GET', function(){
		BlogPosts.create({
			author: 'alanna',
			title: 'new',
			content:'who caresssss',
			publishDate:'todayyy'});
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
		});
	}

	);

	it('should create new post on POST', function(){
		const newItem ={author: 'alanna',title: 'second',content:'brilliance',publishDate:'todayyy'}
		return chai.request(app)
		.post('/blog-posts')
		.send(newItem)
		.then(function(res){
			res.should.be.json;
			res.body.should.include.keys('author','title','content','publishDate');
			res.should.be.a('object');
		})
	})

	it('should update existing post on PUT', function(){

		const updateData = {
			author: 'alanna',
			title: 'updated',
			content:'who caresssss',
			publishDate:'todayyy'
		}
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			updateData.id=res.body[0].id;
			return chai.request(app)
			.put(`/blog-posts/${updateData.id}`)
			.send(updateData)
		})
		
	});

	it('should delete on DELETE', function(){
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			const deleteId = res.body[0].id;
			return chai.request(app)
			.delete(`/blog-posts/${deleteId}`)
			.then(function(res){
				res.should.have.status(204);
			})
		})
	})
})