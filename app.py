from flask import (
    Flask,
    abort,
    redirect,
    render_template,
    request,
    send_file,
    send_from_directory,
    url_for,
    session
)
from waitress import serve
import json


global settings
settings = {}
with open("config.cfg","r") as config:
    configsplit = config.read().split("\n")
    for i in configsplit:
        if i[0] == "#":
            continue
        settingsplit = i.split("=")
        settings[settingsplit[0]] = settingsplit[1]

app = Flask(__name__)
app.config['SECRET_KEY'] = settings["key"]


def LoadBlogsAtPage(page):
    postcount = int(open("blogposts/data","r").read())
    output = ""
    for i in range(postcount-(page*3),postcount-(page*3)-3,-1):
        if i <= -1:
            break

        
        blog = open("blogposts/"+str(i)+".html","r")
        output += "<div class=\"blog\"><a href=\"/blogview/"+str(i)+"\"><button>⛶</button></a>\n"+blog.read()+"\n</div>\n"
    if not page == 0: 
        output += "<a href=\"/blog/"+str(page-1)+"\"><button class=\"pageturnbutton\" style=\"left:20%;bottom:0%;\">Last Page</button></a>"

    output += "<a href=\"/blog/"+str(page+1)+"\"><button class=\"pageturnbutton\" style=\"right:0%;bottom:0%;\">Next Page</button></a>"

    return output

def GenPage(title,posts):
    with open("index.html","r") as index:
        pagecount = open("blogposts/data","r").read()
        return index.read().replace("^title^",title).replace("^latest^","/blogview/"+pagecount).replace("^posts^",posts)

def LoadPost(post):
    with open("blogposts/"+post+".html") as file:
        return file.read()

def LoadPostsAtPage(page):
    postcount = int(open("posts/data","r").read())
    output = ""
    for i in range(postcount-(page*10),postcount-(page*10)-10,-1):
        if i <= -1:
            break
        post = open("posts/"+str(i)+".json","r")
        postjson = json.loads(post.read())
        output += "<div class=\"blog\"><h1>Allegedly from: "+postjson["name"]+"</h1><hr><h3>\""+postjson["title"]+"\"</h3><p style=\"text-align:center;\">"+postjson["post"]+"</p>\n</div>\n"
    if not page == 0: 
        output += "<a href=\"/bored/posts/"+str(page-1)+"\"><button class=\"pageturnbutton\" style=\"left:20%;bottom:0%;\">Last Page</button></a>"

    output += "<a href=\"/bored/posts/"+str(page+1)+"\"><button class=\"pageturnbutton\" style=\"right:0%;bottom:0%;\">Next Page</button></a>"

    return output

def GenBored(posts):
    with open("bored.html","r") as index:
        return index.read().replace("^posts^",posts)

def filter(var):
    return (
        var.replace("\\", "&#92;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .strip()
    )

@app.errorhandler(404)
def not_found(e):
    return GenPage("404 goof","<h1 style=\"text-align:center;\">wtf are you doing buddy? This page doesn't exist. Can't cover all urls y'know. Please stick with the program.</h1>")

@app.route("/")
def main():
    with open("home.html","r") as home:
        return GenPage("goof",home.read())

@app.route("/blog/<page>")
def blogs(page):
    return GenPage("goof",LoadBlogsAtPage(int(page)))

@app.route("/blogview/<post>")
def blogview(post):
    return '<link rel="stylesheet" type="text/css" href="/static/style.css">\n'+LoadPost(post)+"<a href=\"/blog/0\"><button>Go Back</button></a>"

@app.route("/about")
def about():
    with open("about.html","r") as about:
        return GenPage("goof",about.read())

@app.route("/images/<path:filename>")
def images(filename):
    try:
        return send_from_directory("images", filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

@app.route("/webos")
def webos():
    return open("webos.html","r").read()

@app.route("/bored")
def bored():
    with open("boredhome.html","r") as file:
        return GenBored(file.read())

@app.route("/bored/posts/<page>")
def boredpost(page):
    return GenBored(LoadPostsAtPage(int(page)))

@app.route("/bored/postmaker")
def boredpostmaker():
    with open("postmaker.html","r") as file:
        return GenBored(file.read())

@app.route("/bored/api/<req>",methods=['POST'])
def boredAPI(req):
    match req:
        case "makepost":
            if request.form.get("name",False) and request.form.get("title",False) and request.form.get("post",False):
                data = int(open("posts/data","r").read())
                file = open("posts/"+str(data+1)+".json","w")
                post = {
                    "name" : filter(request.form["name"]),
                    "title" : filter(request.form["title"]),
                    "post" : filter(request.form["post"])
                }
                file.write(json.dumps(post))
                open("posts/data","w").write(str(data+1))
                return redirect("/bored/posts/0")
            else:
                return redirect("/sex")

@app.route("/bored/rules")
def rules():
    with open("rules.html","r") as file:
        return GenBored(file.read())

if __name__ == '__main__':
    app.config['MAX_CONTENT_LENGTH'] = 50000000
    serve(app,host="0.0.0.0",port=8080)
