import os
import shutil

shutil.rmtree('Output')

directory = "Website/"
try:
    os.mkdir("Output")
except FileExistsError:
    pass

for subdir, dirs, files in os.walk("./"):
    for file in files:
        f = os.path.normpath(os.path.join(subdir, file))
        

        #Check if the file starts with a .
        skip = False
        for folder in f.split(os.sep):
            if folder.startswith("."):
                skip = True
                break
        if skip:
            continue
        if os.path.splitext(f)[1] in ["", ".md", ".py"]:
            continue
        if "Output" in f:
            continue
        if "EmulatorJS" in f and not "data" in f:
            continue
        if "EmulatorJS" in f and "minify" in f:
            continue
        
        with open(f, "rb") as o:
            content = o.read()
            outpath = os.path.join("Output", f)
            os.makedirs(os.path.dirname(outpath), exist_ok=True)
            with open(outpath, "wb") as output:
                output.write(content)