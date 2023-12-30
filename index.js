import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import {v4 as uuidv4} from "uuid";
const app = express();
const port = 3000;

let blogdata;
const day = new Date().toDateString();

//reads blog data
function readBlogData() {
    const data = fs.readFileSync('blogs.json', 'utf8');
    return JSON.parse(data);
}
//write blog data
function writeBlogData(data) {
    fs.writeFileSync('blogs.json', JSON.stringify(data, null, 2), 'utf8');
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    console.log(day);
    const data = readBlogData();
    res.render("index.ejs",{blog:data});
})

app.get("/create",(req,res)=>{
    
    res.render("create.ejs");
})

app.post('/submit', (req, res) => {
    blogdata = {
        id:uuidv4(),
        blogTitle:req.body.blogTitle,
        blogTopics : req.body.blogTopics,
        blogHeadline:req.body.blogHeadline,
        blogThumbnail: req.body.blogThumbnail,
        blogText : req.body.blogText,
        submiteddate : day
    }

    const blogs = readBlogData();

    // Add the new blog to the existing data
    blogs.push(blogdata);

    // Write the updated data back to the JSON file
    writeBlogData(blogs);

    
    // blogdata.id=id++;
    // blogdata.blogTitle = req.body.blogTitle;
    // blogdata.blogTopics = req.body.blogTopics;
    // blogdata.blogHeadline = req.body.blogHeadline;
    // blogdata.blogThumbnail = req.body.blogThumbnail;
    // blogdata.blogText = req.body.blogText;
    // blogdata.submiteddate = day;
  
    // Handle the data as needed (e.g., store in a database, etc.)
    console.log(blogdata);
  
    // Redirect or send a response as needed
    res.render("blogview.ejs",{blog:blogdata});
  });

app.get("/view/:id",(req,res)=>{
    const reqblogid = req.params.id;
    const blogs = readBlogData();
    const blog = blogs.find(blog => blog.id === reqblogid);
    if(blog){
        res.render("blogview.ejs",{blog})
    }
});

app.listen(port, ()=>{
    console.log(`listening at port ${port}`)
})