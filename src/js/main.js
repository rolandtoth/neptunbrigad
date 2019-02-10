var scriptsDir = "/assets/scripts/";

document.addEventListener("DOMContentLoaded", function () {

    var div, n, service, id, thumbUrl,
        v = document.getElementsByClassName("video-player");

    for (n = 0; n < v.length; n++) {

        var $el = v[n];

        id = $el.getAttribute("data-video-id");
        service = $el.getAttribute("data-video-service");
        thumb = $el.getAttribute("data-video-thumb");
        thumbUrl = '/assets/images/video-thumbs/' + service + '-' + (thumb ? thumb : id) + '.jpg';

        div = document.createElement("div");
        div.setAttribute("data-video-id", id);
        div.setAttribute("data-video-service", service);
        div.innerHTML = '<img data-src="' + thumbUrl + '" class="lazyload"/><div class="play"></div>';

        $el.appendChild(div);

        div.onclick = labnolIframe;
    }

    loadAsset(scriptsDir + 'baguetteBox/baguetteBox.min.css?selector=".gallery"&async=true', function () {

        var selector = this.selector;

        loadAsset(scriptsDir + 'baguetteBox/baguetteBox.min.js?async=true', function () {

            baguetteBox.run(selector, {
                'animation': 'slideIn',
                'async': true,
                'fullScreen': false,
                'noScrollbars': false
            });
        });
    });

    // lazysizes
    // window.lazySizesConfig = window.lazySizesConfig || {};
    // lazySizesConfig.loadMode = 3;
    // lazySizesConfig.expand = 1000;

});

function labnolIframe() {

    /**
     * todo 
     * add mute, play-inline attributes to autostart on mobile
     */
    var iframe = document.createElement("iframe"),
        service = this.getAttribute("data-video-service"),
        id = this.getAttribute("data-video-id"),
        embedYoutube = "https://www.youtube.com/embed/ID?rel=0&autoplay=1",
        embedVimeo = "https://player.vimeo.com/video/ID?rel=0&autoplay=1&color=c82417",
        embedFacebook = "https://www.facebook.com/plugins/video.php?href=ID&show_text=0",
        embed;

    if (service === "youtube") {
        embed = embedYoutube;
    } else if (service === "vimeo") {
        embed = embedVimeo;
    } else if (service === "facebook") {
        embed = embedFacebook;
    } else {
        return "";
    }

    iframe.setAttribute("src", embed.replace("ID", id));
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "1");

    this.parentNode.replaceChild(iframe, this);
}

function loadAsset(path, callback, o) {

    var selector = getUrlParameter('selector', path).replace(/['"]+/g, '').trim(),
        async = getUrlParameter('async', path) === 'true',
            assetType = 'js',
            assetTag = 'script',
            assetSrc = 'src',
            needAsset = true;

    if (selector.length > 0 && !document.querySelector(selector)) return false;

    function getUrlParameter(name, url) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        url = url ? url : window.location.search;

        // var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        var regex = new RegExp('[\\?&]' + name + '=([^&]*)'),
            results = regex.exec(url);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    path = path.split(/\?(.+)/)[0]; // remove url parameters (settings)

    if (path.slice(-3) === 'css') {
        assetType = 'css';
        assetTag = 'link';
        assetSrc = 'href';
    }

    if (document.querySelector(assetTag + '[' + assetSrc + '="' + path + '"]')) needAsset = false;

    function callCallback() {
        if (callback) {
            var obj = {};
            if (selector) obj.selector = selector;
            if (o) obj.o = o;
            callback.call(obj);
        }
    }

    if (needAsset) {

        var asset = document.createElement(assetTag);
        asset[assetSrc] = path;

        if (assetType === 'js') {
            asset.type = "text/javascript";
            asset.async = async;

            if (asset.readyState) { // IE
                asset.onreadystatechange = function () {
                    if (asset.readyState === "loaded" || asset.readyState === "complete") {
                        asset.onreadystatechange = null;
                        callCallback();
                    }
                };
            } else { // others
                asset.onload = callCallback;
            }

        } else { // CSS
            asset.rel = "stylesheet";
            callCallback();
        }
        document.getElementsByTagName("head")[0].appendChild(asset);

    } else { // always run callback
        callCallback();
    }
}