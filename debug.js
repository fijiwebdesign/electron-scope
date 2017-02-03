var script_path = location.search.slice(1)
if (script_path) {
    console.log('Ready to debug: ', script_path)
    var script = document.createEvent('script')
    script.src = script_path
    document.appendChild(script)
}