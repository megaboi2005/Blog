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


def LoadPostsAtPage(page):
    postcount = int(open("blogposts/data","r").read())
    output = ""
    for i in range(3):
        print(i)
        if page*3 > postcount:
            break
        if postcount < i+postcount-page*3:
            break
        with open("blogposts/"+str(i+postcount-page*3)+".html","r") as blog:
            output = "<div class=\"blog\"><a href=\"/blogview/"+str(i+postcount-page*3)+"\"><button>⛶</button></a>\n"+blog.read()+"\n</div>\n" +output
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

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')



@app.route("/")
def main():
    with open("home.html","r") as home:
        return GenPage("goof",home.read())

@app.route("/blog/<page>")
def blogs(page):
    return GenPage("goof",LoadPostsAtPage(int(page)))

@app.route("/blogview/<post>")
def blogview(post):
    return '<link rel="stylesheet" type="text/css" href="/static/style.css">\n'+LoadPost(post)+"<a href=\"/\"><button>Go Back</button></a>"


@app.route("/images/<path:filename>")
def images(filename):
    try:
        return send_from_directory("images", filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)


if __name__ == '__main__':
    app.config['MAX_CONTENT_LENGTH'] = 50000000
    serve(app,host="0.0.0.0",port=80)
