var script_path = location.search.slice(1)
if (script_path) {
    console.log('Ready to debug: ', script_path)
    require(script_path)
}