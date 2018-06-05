({
    baseUrl: "mylibs",
    mainConfigFile: 'main.js',
    name: "main",
    out: "compiled.js",
    include: "requireLib",
    paths:{
    	requireLib: '../require',
    	main:'../main'
    },
    closure: { 
    CompilationLevel: 'ADVANCED_OPTIMIZATIONS' 
	}
})

