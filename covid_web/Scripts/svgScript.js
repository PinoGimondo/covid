function pageCommand(cmd, par ) {
    switch (cmd) {
        case 'new_svg':
            document.getElementById("svgContainer").innerHTML = par.replace(/\|/g, "\r\n");
            break;
    }
}