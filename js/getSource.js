// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);
var currentLocation;
var supported = ["stackoverflow"];

function isLocationSupported() {
    var found = false;
    var platform;
    var i =0;
    var start = new Date().getTime();
    while (!found) {
        if (location.href.indexOf(supported[i])!= -1) {
            found = true;
            platform = supported[i];
        }
        i++;
        if (i > supported.length) {
            break;
        }
    }
    return [found, platform];
}

function parseDocument(document_root) {
    /*var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;*/
    //checking supported url
    var checkLocation = isLocationSupported();
    if (checkLocation[0]) {
        appendFontCSS();
        switch (checkLocation[1]) {
            case "stackoverflow":
                return parseStackoverflow(document_root);
            default:
                return {
                    error : "general",
                    text : "Something bad happened"
                };
        }
    }
    else {
        return {
            error : "general",
            text : "Your location is currently not supported. Please visit http://thera.io/snippr for more informations."
        };
    }
}

function applyBodyCSS( b ) {
    b.style.backgroundColor = "#ecf0f1";
}

function appendFontCSS() {
    var url = chrome.extension.getURL("fonts");
    var font = "@font-face{font-family:'Glyphicons Halflings';src:url("+url+"/glyphicons-halflings-regular.eot);src:url("+url+"/glyphicons-halflings-regular.eot?#iefix) format('embedded-opentype'),url("+url+"/glyphicons-halflings-regular.woff) format('woff'),url("+url+"/glyphicons-halflings-regular.ttf) format('truetype'),url("+url+"/glyphicons-halflings-regular.svg#glyphicons_halflingsregular) format('svg')}";
    $('head').append("<style>"+font+"</style>");
}

function parseStackoverflow(document_root) {
    var snippets_nodes = document_root.querySelectorAll(".prettyprinted");
    var answers = document_root.querySelectorAll(".answer");
    var accepted_index = snippets_nodes.length+1;
    for (var k=0; k<answers.length; k++) {
        if(answers[k].getAttribute("class").indexOf("accepted-answer")!= -1) {
            accepted_index = k;
        }
    }
    applyBodyCSS(document_root.body);
    document.body.innerHTML = "";
    document.body.innerHTML += "<div id='snippets_header'>I'VE FOUND "+snippets_nodes.length+" SNIPPETS.</div>";
    for (var i=0; i<snippets_nodes.length; i++) {
        document.body.innerHTML += "<div class='snippet_container'>"+snippets_nodes[i].outerHTML;
        if (i==accepted_index) {
            document.body.innerHTML += "<div class='btn btn-success btn-xs'><span class='glyphicon glyphicon-ok'></span> Answer accepted</div>";
        }
        document.body.innerHTML += "</div>";
    }
    return {
        error :"none",
        text: "stackoverflow parsed succesfully"
    };
}

chrome.extension.sendMessage({
    action: "getSource",
    source: parseDocument(document)
});