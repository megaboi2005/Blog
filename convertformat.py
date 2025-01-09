import os

def UpgradeV1():
    for i in os.listdir("posts"):
        if i == "data":
            continue
        iwne = i.split(".")[0]
        os.mkdir("posts/"+iwne)
        os.mkdir("posts/"+iwne+"/comments")
        open("posts/"+iwne+"/comments/data","w").write("0")
        os.rename("posts/"+i,"posts/"+iwne+"/post.json")


versions = [
    UpgradeV1
]

print("BORED posts upgrade tool")
versions[int(input("What version of bored do you want to upgrade from?\n\tversions go from 1-"+str(len(versions))+" :"))-1]()     