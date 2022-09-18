import css_html_js_minify as minify
import os

directory = "Website/"
try:
    os.mkdir("Output")
except FileExistsError:
    pass

for subdir, dirs, files in os.walk(directory):
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
        if "EmulatorJS" in f and not "data" in f:
            continue
        if "EmulatorJS" in f and "minify" in f:
            continue
        """if os.path.splitext(f)[1] == ".html":
            with open(f, "rt") as o:
                content = o.read()
                minified = minify.js_minify(content, comments=False)
                outpath = os.path.join("Output", f)
                os.makedirs(os.path.dirname(outpath), exist_ok=True)
                with open(outpath, "wt") as output:
                    output.write(minified)"""
        
        with open(f, "rb") as o:
            content = o.read()
            outpath = os.path.join("Output", f)
            os.makedirs(os.path.dirname(outpath), exist_ok=True)
            with open(outpath, "wb") as output:
                output.write(content)